import { htmlElements } from "../../support/pageObjects/WebElement";

const CONTENT_TYPE_WITH_LIST = {
  code: 'NES',
  name: 'Nested in a List'
};

const CONTENT_WITH_LIST = {
  description: 'content attribute inside list test',
  mainGroup: 'free',
  typeCode: CONTENT_TYPE_WITH_LIST.code,
  attributes: []
};

const listFormat = {
  type: 'List',
  code: 'List',
  nestedAttribute: {code: 'List'}
};

describe([Tag.GTS], 'Nested a in List Attribute', () => {

  const navigateToContentForm = (mode = 'create') => {
    return cy.get('@currentPage')
             .then(page => page.getMenu().getContent().open().openManagement())
             .then(page => {
               switch (mode) {
                 case 'create':
                 default:
                   page.getContent().openAddContentPage(CONTENT_TYPE_WITH_LIST.name);
                   break;
                 case 'edit':
                   cy.get('@contentToBeDeleted').then(code => page.getContent().getKebabMenu(code).open(true).openEdit());
               }
             });
  };

  const fillAttributeWithValue = (attribute, value, editMode = false) => {
    return cy.get('@currentPage')
      .then(page => page.getContent().fillAttributes([{
        type: 'List',
        nestedType: attribute,
        value: value.en
      }], {editMode}))
      .then(page => page.getContent().fillAttributes([{
        type: 'List',
        nestedType: attribute,
        value: value.it
      }], {lang: 'it', editMode}));
  };

  const formatCompareAttributeValues = (attribute) => {
    const actualValue = {
      en: attribute.listelements.en.map(element => element.value),
      it: attribute.listelements.it.map(element => element.value)
    };
    return actualValue;
  };

  const addAttributeToContentType = (attribute, extraProps = {}, extraListProps = {}) => {
    cy.contentTypeAttributesController(CONTENT_TYPE_WITH_LIST.code)
      .then(controller => controller.addAttribute({
        ...listFormat,
        nestedAttribute: {type: attribute, code: attribute, ...extraProps},
        ...extraListProps
      }));
    cy.wrap(listFormat.code).as('attributeToBeDeleted');
  };

  const checkAndSavePublishedContentId = () => {
    cy.contentsController()
      .then(controller => controller.getContentList())
      .then(response => cy.wrap(response.body.payload.filter(content => content.typeCode === CONTENT_TYPE_WITH_LIST.code)[0].id).as('contentToBeDeleted'));
  };

  const basicCreateContentAttributes = (attribute, testValues, addAttributeProps) => {
    addAttributeToContentType(attribute, addAttributeProps);
    return navigateToContentForm()
      .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
      .then(() => fillAttributeWithValue(attribute, testValues))
      .then(page => page.getContent().submitApproveForm())
      .then(() => checkAndSavePublishedContentId())
      .then(() => cy.get('@contentToBeDeleted').then(contentId => {
        cy.contentsController().then(controller => {
          controller.getContent(contentId).then(response => {
            return formatCompareAttributeValues(response.body.payload.attributes[0]);
          });
        });
      }));
  };

  const basicEditContentAttributes = (attribute, testValues, editedValues, addAttributeProps) => {
    addAttributeToContentType(attribute, addAttributeProps);
    cy.contentsController()
      .then((controller) => {
        controller.addContent({
          ...CONTENT_WITH_LIST,
          attributes: [{
            code: 'List',
            listelements: {
              en: testValues.en.map(value => ({code: 'List', value})),
              it: testValues.it.map(value => ({code: 'List', value}))
            }
          }]
        }).then(response => {
          controller.updateStatus(response.body.payload[0].id, 'published');
          cy.wrap(response.body.payload[0].id).as('contentToBeDeleted');
        });
      });

    return navigateToContentForm('edit')
      .then(() => fillAttributeWithValue(attribute, editedValues, true))
      .then(page => page.getContent().submitApproveForm())
      .then(() => cy.get('@contentToBeDeleted').then(contentId =>
        cy.contentsController().then(controller =>
          controller.getContent(contentId).then(response =>
            formatCompareAttributeValues(response.body.payload.attributes[0])
          )
        )
      ));
  };

  before(() => {
    cy.kcAPILogin();
    cy.contentTypesController()
      .then(controller => controller.addContentType(CONTENT_TYPE_WITH_LIST.code, CONTENT_TYPE_WITH_LIST.name));
  });

  beforeEach(() => {
    cy.wrap(null).as('attributeToBeDeleted');
    cy.wrap(null).as('contentToBeDeleted');

    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.get('@contentToBeDeleted').then(contentId => {
      if (contentId) {
        cy.contentsController().then(controller =>
          controller.updateStatus(contentId, 'draft')
                    .then(() => controller.deleteContent(contentId)))
      }
    });
    cy.get('@attributeToBeDeleted').then((attributeToBeDeleted) => {
      if (attributeToBeDeleted) {
        cy.contentTypeAttributesController(CONTENT_TYPE_WITH_LIST.code)
          .then(controller => controller.deleteAttribute(attributeToBeDeleted));
      }
    });

    cy.kcUILogout();
  });

  after(() => {
    cy.kcAPILogin();
    //FIXME/TODO needed as autosave might create unwanted contents
    cy.contentsController()
      .then(controller => controller.getContentList()).then(response =>
        response.body.payload.filter(content => content.typeCode === CONTENT_TYPE_WITH_LIST.code).forEach(content =>
          cy.contentsController().then(controller => controller.updateStatus(content.id, 'draft').then(() =>
            controller.deleteContent(content.id)))));
    cy.contentTypesController()
      .then(controller => controller.deleteContentType(CONTENT_TYPE_WITH_LIST.code));
  });

  describe('Monotext', () => {
    const attribute  = 'Monotext';
    const testValues = {
      en: ['Hello', 'World', 'Out', 'There'],
      it: ['Ciao', 'Bella', 'Ciao']
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
          .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['The', 'Quick', 'Brown', 'Fox', 'Jumped'],
        it: ['Bella', 'Ciao']
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
          .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, {mandatory: true});
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().getSaveApproveAction().then(input => page.getContent().click(input)))
        .then(page => {
          page.getContent().getAlertMessage().should('exist').and('contain.text', 'Mandatory');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: ['Hi there']
          }]);
        })
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });

    it('Verify every list element can\'t be empty', () => {
      const wrongValues = {
        en: ['The', 'Quick', '', 'Fox'],
        it: ['', 'Ciao']
      };
      addAttributeToContentType(attribute);
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en
        }]))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it
        }], {lang: 'it'}))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => page.getContent().getContentAttributesLanguageTab('en').then(button => page.getContent().click(button)))
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0);
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(2);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          listitem.field.setValue('Brown');
          page.getContent().getContentAttributesLanguageTab('it').then(button => page.getContent().click(button));
        })
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0, 'it');
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(0);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          listitem.field.setValue('Bella');
          page.getContent().submitApproveForm();
        })
        .then(() => checkAndSavePublishedContentId());
    });

    it('Try to set custom validation (regex) and check it in content validation', () => {
      const wrongValues   = {
        en: ['xyz', 'qwe'],
        it: ['s15']
      };
      const correctValues = {
        en: ['abc', 'bac'],
        it: ['ccc']
      };
      addAttributeToContentType(attribute, {validationRules: {regex: '^[aAbBcC]*$'}});
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en
        }]))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it
        }], {lang: 'it'}))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => page.getContent().getContentAttributesLanguageTab('en').then(button => page.getContent().click(button)))
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0);
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(0);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          listitem = fieldarea.generateInstanceListItem(1);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          page.getContent().getContentAttributesLanguageTab('it').then(button => page.getContent().click(button))
        })
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0, 'it');
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(0);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: correctValues.en
          }], {editMode: true});
        })
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.it
        }], {lang: 'it', editMode: true}))
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });

  });

  //FIXME: the email attribute input doesn't appear
  describe('Email', () => {
    const attribute  = 'Email';
    const testValues = {
      en: ['abc@xyz.com', 'bbc@dde.com'],
      it: ['bodo@dodo.com', 'bella@ciao.com', 'aa@xyz.com']
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
          .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['bodo@coco.com', 'mama@papa.com', 'entando@entando.com'],
        it: ['abc@xyz.com', 'jeff@gogo.com']
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
          .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, {mandatory: true});
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => {
          page.getContent().getAlertMessage().should('exist').and('contain.text', 'Mandatory');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: ['bo@aofa.co']
          }]);
        })
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });

    it('Verify every list element can\'t be empty', () => {
      const wrongValues = {
        en: ['bodo@coco.com', '', 'entando@entando.com'],
        it: ['abc@xyz.com', '']
      };
      addAttributeToContentType(attribute);
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en
        }]))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it
        }], {lang: 'it'}))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => page.getContent().getContentAttributesLanguageTab('en').then(button => page.getContent().click(button)))
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0);
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(1);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          listitem.field.setValue('mama@papa.com');
          page.getContent().getContentAttributesLanguageTab('it').then(button => page.getContent().click(button));
        })
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0, 'it');
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(1);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          listitem.field.setValue('jeff@gogo.com');
          page.getContent().submitApproveForm();
        })
        .then(() => checkAndSavePublishedContentId());
    });

    it('Check email address structure in content validation', () => {
      const wrongValues   = {
        en: ['xyz', 'qwe'],
        it: ['s15']
      };
      const correctValues = {
        en: ['abc@xyz.com', 'bac@cack.com'],
        it: ['ccc@ddd.com']
      };
      addAttributeToContentType(attribute);
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en
        }]))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it
        }], {lang: 'it'}))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => page.getContent().getContentAttributesLanguageTab('en').then(button => page.getContent().click(button)))
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0);
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(0);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          listitem = fieldarea.generateInstanceListItem(1);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          page.getContent().getContentAttributesLanguageTab('it').then(button => page.getContent().click(button))
        })
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0, 'it');
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(0);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: correctValues.en
          }], {editMode: true});
        })
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.it
        }], {lang: 'it', editMode: true}))
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });
  });

  describe('Number', () => {
    const attribute  = 'Number';
    const testValues = {
      en: ['14', '200', '5'],
      it: ['620', '123']
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
          .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['11'],
        it: ['23', '350']
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
          .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, {mandatory: true});
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => {
          page.getContent().getAlertMessage().should('exist').and('contain.text', 'Mandatory');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: ['43']
          }]);
        })
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });

    it('Verify every list element can\'t be empty', () => {
      const wrongValues = {
        en: [''],
        it: ['23', '']
      };
      addAttributeToContentType(attribute);
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en
        }]))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it
        }], {lang: 'it'}))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => page.getContent().getContentAttributesLanguageTab('en').then(button => page.getContent().click(button)))
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0);
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(0);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          listitem.field.setValue('11');
          page.getContent().getContentAttributesLanguageTab('it').then(button => page.getContent().click(button));
        })
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0, 'it');
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(1);
          listitem.field.getContents().parent().invoke('hasClass', 'panel-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          listitem.field.setValue('350');
          page.getContent().submitApproveForm();
        })
        .then(() => checkAndSavePublishedContentId());
    });

    it('Try to set custom validation (range) and check it in content validation', () => {
      const range         = {
        start: '3',
        end: '8'
      };
      const wrongValues   = {
        en: ['14', '2'],
        it: ['9']
      };
      const correctValues = {
        en: ['4', '6'],
        it: ['8']
      };
      addAttributeToContentType(
          attribute,
          {validationRules: {rangeStartNumber: range.start, rangeEndNumber: range.end}}
      );
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en
        }]))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it
        }], {lang: 'it'}))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => page.getContent().getContentAttributesLanguageTab('en').then(button => page.getContent().click(button)))
        .then(page => {
          let fieldarea =page.getContent().getAttributeByTypeIndex('List', 0);
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(0);
          listitem.field.getContents().children(htmlElements.p).invoke('hasClass', 'text-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          listitem = fieldarea.generateInstanceListItem(1);
          listitem.field.getContents().children(htmlElements.p).invoke('hasClass', 'text-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          page.getContent().getContentAttributesLanguageTab('it').then(button => page.getContent().click(button));
        })
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0, 'it');
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(0);
          listitem.field.getContents().children(htmlElements.p).invoke('hasClass', 'text-danger').should('be.true');
          listitem.field.getHelpBlock().should('be.visible');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: correctValues.en
          }], {editMode: true});
        })
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.it
        }], {lang: 'it', editMode: true}))
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });
  });

  describe('Date', () => {
    const attribute  = 'Date';
    const testValues = {
      en: ['2021-06-12 00:00:00', '2021-11-20 00:00:00'],
      it: ['2021-04-22 00:00:00']
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
          .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['2021-07-12 00:00:00'],
        it: ['2021-05-10 00:00:00', '2021-12-25 00:00:00']
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
          .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, {mandatory: true});
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => {
          page.getContent().getAlertMessage().should('exist').and('contain.text', 'Mandatory');
          page.getContent().fillAttributes([{
              type: 'List',
              nestedType: attribute,
              value: ['2021-07-12 00:00:00']
            }]);
        })
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });

    it('Try to set custom validation (range) and check it in content validation', () => {
      const validationRules = {
        rangeStartDate: '2021-09-01 00:00:00',
        rangeEndDate: '2021-09-30 00:00:00'
      };
      const wrongValues     = {
        en: ['2021-06-12 00:00:00', '2021-10-01 00:00:00'],
        it: ['2021-06-25 00:00:00']
      };
      const correctValues   = {
        en: ['2021-09-01 00:00:00', '2021-09-12 00:00:00'],
        it: ['2021-09-15 00:00:00']
      };
      addAttributeToContentType(attribute, {validationRules});
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en
        }]))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it
        }], {lang: 'it'}))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => page.getContent().getContentAttributesLanguageTab('en').then(button => page.getContent().click(button)))
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0);
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(0);
          listitem.field.getContents().children(htmlElements.p).invoke('hasClass', 'text-danger').should('be.true');
          listitem = fieldarea.generateInstanceListItem(1);
          listitem.field.getContents().children(htmlElements.p).invoke('hasClass', 'text-danger').should('be.true');
          page.getContent().getContentAttributesLanguageTab('it').then(button => page.getContent().click(button));
        })
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0, 'it');
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(0);
          listitem.field.getContents().children(htmlElements.p).invoke('hasClass', 'text-danger').should('be.true');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: correctValues.en
          }], { editMode: true });
        })
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.it
        }], {lang: 'it', editMode: true}))
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });
  });

  describe('Enumerator', () => {
    const attribute  = 'Enumerator';
    const enumProps  = {
      enumeratorStaticItems: 'a,b,c',
      enumeratorStaticItemsSeparator: ','
    };
    const testValues = {
      en: ['a'],
      it: ['b', 'b', 'a']
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues, enumProps)
          .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['c', 'a'],
        it: ['a', 'b']
      };
      basicEditContentAttributes(attribute, testValues, editedValues, enumProps)
          .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, enumProps, {mandatory: true});
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => {
          page.getContent().getAlertMessage().should('exist').and('contain.text', 'Mandatory');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: ['a']
          }]);
        })
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });

    it('Verify every list element can\'t be empty', () => {
      const wrongValues = {
        en: ['c', ''],
        it: ['a', '']
      };
      addAttributeToContentType(attribute, enumProps);
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en
        }]))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it
        }], {lang: 'it'}))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => page.getContent().getContentAttributesLanguageTab('en').then(button => page.getContent().click(button)))
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0);
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(1);
          listitem.field.getContents().children(htmlElements.p).invoke('hasClass', 'text-danger').should('be.true');
          listitem.field.setValue('a');
          page.getContent().getContentAttributesLanguageTab('it').then(button => page.getContent().click(button))
        })
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0, 'it');
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(1);
          listitem.field.getContents().children(htmlElements.p).invoke('hasClass', 'text-danger').should('be.true');
          listitem.field.setValue('b');
          page.getContent().submitApproveForm();
        })
        .then(() => checkAndSavePublishedContentId());
    });
  });

  describe('EnumeratorMap', () => {
    const attribute  = 'EnumeratorMap';
    const enumProps  = {
      enumeratorStaticItems: 'x=1,y=2,z=3',
      enumeratorStaticItemsSeparator: ','
    };
    const testValues = {
      en: ['z', 'x'],
      it: ['y', 'y', 'z']
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues, enumProps)
          .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['y', 'z'],
        it: ['x']
      };
      basicEditContentAttributes(attribute, testValues, editedValues, enumProps)
          .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, enumProps, {mandatory: true});
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => {
          page.getContent().getAlertMessage().should('exist').and('contain.text', 'Mandatory');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: ['x']
          }]);
        })
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });

    it('Verify every list element can\'t be empty', () => {
      const wrongValues = {
        en: ['y', '', 'z'],
        it: ['x', '']
      };
      addAttributeToContentType(attribute, enumProps);
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en
        }]))
        .then(page => page.getContent().fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it
        }], {lang: 'it'}))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => page.getContent().getContentAttributesLanguageTab('en').then(button => page.getContent().click(button)))
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0);
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(1);
          listitem.field.getContents().children(htmlElements.p).invoke('hasClass', 'text-danger').should('be.true');
          listitem.field.setValue('x');
          page.getContent().getContentAttributesLanguageTab('it').then(button => page.getContent().click(button));
        })
        .then(page => {
          let fieldarea = page.getContent().getAttributeByTypeIndex('List', 0, 'it');
          fieldarea.setAttributeType(attribute);
          let listitem = fieldarea.generateInstanceListItem(1);
          listitem.field.getContents().children(htmlElements.p).invoke('hasClass', 'text-danger').should('be.true');
          listitem.field.setValue('y');
          page.getContent().submitApproveForm();
        })
        .then(() => checkAndSavePublishedContentId());
    });
  });

  describe('Boolean', () => {
    const attribute  = 'Boolean';
    const testValues = {
      en: [true, false],
      it: [true]
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
          .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: [false, true, true],
        it: [false, true, false, false]
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
          .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, {mandatory: true});
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => {
          page.getContent().getAlertMessage().should('exist').and('contain.text', 'Mandatory');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: [false]
          }]);
        })
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });
  });

  describe('CheckBox', () => {
    const attribute  = 'CheckBox';
    const testValues = {
      en: [true, false],
      it: [true]
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
          .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: [false, true, true],
        it: [false, true, false, false]
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
          .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, {mandatory: true});
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().getSaveApproveAction().then(button => page.getContent().click(button)))
        .then(page => {
          page.getContent().getAlertMessage().should('exist').and('contain.text', 'Mandatory');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: [true]
          }]);
        })
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });
  });

  describe('ThreeState', () => {
    const attribute  = 'ThreeState';
    const testValues = {
      en: [true, null],
      it: [null, false]
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
          .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: [null, false, true],
        it: [false, null, null, true]
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
          .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, {mandatory: true});
      navigateToContentForm()
        .then(page => page.getContent().fillBeginContent(CONTENT_WITH_LIST.description))
        .then(page => page.getContent().getSaveApproveAction().then(input => page.getContent().click(input)))
        .then(page => {
          page.getContent().getAlertMessage().should('exist').and('contain.text', 'Mandatory');
          page.getContent().fillAttributes([{
            type: 'List',
            nestedType: attribute,
            value: [null]
          }]);
        })
        .then(page => page.getContent().submitApproveForm())
        .then(() => checkAndSavePublishedContentId());
    });

  });
});
