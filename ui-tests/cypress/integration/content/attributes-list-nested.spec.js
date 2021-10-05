import HomePage from '../../support/pageObjects/HomePage';

const CONTENT_TYPE_WITH_LIST = {
  code: 'NES',
  name: 'Nested in a List',
};

const CONTENT_WITH_LIST = {
  description: 'content attribute inside list test',
  mainGroup: 'free',
  typeCode: CONTENT_TYPE_WITH_LIST.code,
  attributes: [],
};

const listFormat = {
  type: 'List',
  code: 'List',
  nestedAttribute: { code: 'List' },
};

describe('Nested a in List Attribute', () => {
  let currentPage;

  const navigateToContentForm = (mode = 'create') => {
    currentPage = currentPage.getMenu().getContent().open();
    currentPage = currentPage.openManagement();
    switch(mode) {
      case 'create':
      default:
        currentPage = currentPage.getContent().openAddContentPage(CONTENT_TYPE_WITH_LIST.name);
        break;
      case 'edit':
        currentPage = currentPage.getContent().openEditContentPage();
        break;
    }
  };

  const fillAttributeWithValue = (attribute, value, editMode = false) => {
    currentPage.getContent().fillAttributes([{
      type: 'List',
      nestedType: attribute,
      value: value.en,
    }], { editMode })
    .fillAttributes([{
      type: 'List',
      nestedType: attribute,
      value: value.it,
    }], { lang: 'it', editMode });
  };

  const formatCompareAttributeValues = (actualValue) => {
    const { listelements: { en, it } } = actualValue;
    return {
      en: en.map(({ value }) => value),
      it: it.map(({ value }) => value),
    };
  };

  const addAttributeToContentType = (attribute, extraProps = {}, extraListProps = {}) => {
    cy.contentTypeAttributeController(CONTENT_TYPE_WITH_LIST.code)
        .then(controller => controller.addAttribute({
          ...listFormat,
          nestedAttribute: { type: attribute, code: attribute, ...extraProps },
          ...extraListProps,
        }));
      cy.wrap(listFormat.code).as('attributeToDelete');
  };

  const basicCreateContentAttributes = (attribute, testValues, addAttributeProps) => {
    addAttributeToContentType(attribute, addAttributeProps);
    navigateToContentForm();
    currentPage.getContent()
      .fillBeginContent(CONTENT_WITH_LIST.description);
    fillAttributeWithValue(attribute, testValues);
    currentPage = currentPage.getContent().submitApproveForm();
    cy.wrap(1).as('recentContentsToUnpublish');
    cy.wrap(1).as('recentContentsToDelete');
    return cy.contentsController()
      .then(controller => controller.getContentList())
      .then((response) => {
        const { body: { payload } } = response;
        const { attributes: [attr] } = payload[0];
        return formatCompareAttributeValues(attr);
      });
  };

  const basicEditContentAttributes = (attribute, testValues, editedValues, addAttributeProps) => {
    addAttributeToContentType(attribute, addAttributeProps);
      cy.contentsController()
        .then((controller) => {
          controller.postContent({
            ...CONTENT_WITH_LIST,
            attributes: [{
              code: 'List',
              listelements: {
                en: testValues.en.map(value => ({ code: 'List', value })),
                it: testValues.it.map(value => ({ code: 'List', value })),
              }
            }],
          }).then((response) => (
            controller.updateStatus(response.body.payload.id, 'published')
          ));
        });
      cy.wrap(1).as('recentContentsToDelete');
      
      navigateToContentForm('edit');
      fillAttributeWithValue(attribute, editedValues, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');

      return cy.contentsController()
        .then(controller => controller.getContentList())
        .then((response) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr);
        });
  };

  before(() => {
    cy.kcLogin('admin').as('tokens');
    
    cy.contentTypesController()
      .then(controller => controller.addContentType(CONTENT_TYPE_WITH_LIST.code, CONTENT_TYPE_WITH_LIST.name));
    cy.kcLogout();
  });

  beforeEach(() => {
    cy.wrap(null).as('attributeToDelete');
    cy.wrap(null).as('recentContentsToUnpublish');
    cy.wrap(null).as('recentContentsToDelete');

    cy.kcLogin('admin').as('tokens');
    cy.visit('/');
    currentPage = new HomePage();
  });

  afterEach(() => {
    cy.get('@recentContentsToUnpublish').then((contentCounts) => {
      if (contentCounts !== null && contentCounts > 0) {
        cy.contentsController()
          .then((controller) => {
            controller.getContentList()
              .then((response) => {
                response.body.payload
                  .slice(0, contentCounts).map(content => content.id)
                  .forEach(contentId => controller.updateStatus(contentId, 'draft'));
              });
          });
      }
    });
    cy.get('@recentContentsToDelete').then((contentCounts) => {
      if (contentCounts !== null && contentCounts > 0) {
        cy.contentsController()
          .then((controller) => {
            controller.getContentList()
              .then((response) => {
                response.body.payload
                  .slice(0, contentCounts).map(content => content.id)
                  .forEach(contentId => controller.deleteContent(contentId));
              });
          });
      }
    });
    cy.get('@attributeToDelete').then((attributeToDelete) => {
      if (attributeToDelete !== null) {
        cy.contentTypeAttributeController(CONTENT_TYPE_WITH_LIST.code)
          .then(controller => controller.deleteAttribute(attributeToDelete));
      }
    });

    cy.kcLogout();
  });

  after(() => {
    cy.kcLogin('admin').as('tokens');
    cy.contentTypesController()
      .then(controller => controller.deleteContentType(CONTENT_TYPE_WITH_LIST.code));
    cy.kcLogout();
  });

  describe('Monotext', () => {
    const attribute = 'Monotext';
    const testValues = {
      en: ['Hello', 'World', 'Out', 'There'],
      it: ['Ciao', 'Bella', 'Ciao'],
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
        .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['The', 'Quick', 'Brown', 'Fox', 'Jumped'],
        it: ['Bella', 'Ciao'],
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
        .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, { mandatory: true });
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: ['Hi there'],
        }])
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });

    it('Verify every list element can\'t be empty', () => {
      const wrongValues = {
        en: ['The', 'Quick', '', 'Fox'],
        it: ['', 'Ciao'],
      };
      addAttributeToContentType(attribute);
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en,
        }])
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it,
        }], { lang: 'it' });
      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent().getEnLanguageTab().click();
      let fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0);
      fieldarea.setAttributeType(attribute);
      let listitem = fieldarea.generateInstanceListItem(2);
      listitem.field.setValue('Brown');
      currentPage.getContent().getItLanguageTab().click();
      fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0, 'it');
      fieldarea.setAttributeType(attribute);
      listitem = fieldarea.generateInstanceListItem(0);
      listitem.field.setValue('Bella');
      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });

    it('Try to set custom validation (regex) and check it in content validation', () => {
      const wrongValues = {
        en: ['xyz', 'qwe'],
        it: ['s15'],
      };
      const correctValues = {
        en: ['abc', 'bac'],
        it: ['ccc'],
      };
      addAttributeToContentType(attribute, { validationRules: { regex: '^[aAbBcC]*$' } });
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en,
        }])
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it,
        }], { lang: 'it' });
      
      currentPage.getContent().getEnLanguageTab().click();

      let fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0);
      fieldarea.setAttributeType(attribute);
      let listitem = fieldarea.generateInstanceListItem(0);
      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');
      listitem.field.getHelpBlock().should('be.visible');

      listitem = fieldarea.generateInstanceListItem(1);
      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');
      listitem.field.getHelpBlock().should('be.visible');

      currentPage.getContent().getItLanguageTab().click();

      fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0, 'it');
      fieldarea.setAttributeType(attribute);
      listitem = fieldarea.generateInstanceListItem(0);
      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');
      listitem.field.getHelpBlock().should('be.visible');

      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.en,
        }], { editMode: true })
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.it,
        }], { lang: 'it', editMode: true });

      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });
  });

  describe('Email', () => {
    const attribute = 'Email';
    const testValues = {
      en: ['abc@xyz.com', 'bbc@dde.com'],
      it: ['bodo@dodo.com', 'bella@ciao.com', 'aa@xyz.com'],
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
        .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['bodo@coco.com', 'mama@papa.com', 'entando@entando.com'],
        it: ['abc@xyz.com', 'jeff@gogo.com'],
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
        .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, { mandatory: true });
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: ['bo@aofa.co'],
        }])
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });

    it('Verify every list element can\'t be empty', () => {
      const wrongValues = {
        en: ['bodo@coco.com', '', 'entando@entando.com'],
        it: ['abc@xyz.com', ''],
      };
      addAttributeToContentType(attribute);
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en,
        }])
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it,
        }], { lang: 'it' });
      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent().getEnLanguageTab().click();
      let fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0);
      fieldarea.setAttributeType(attribute);
      let listitem = fieldarea.generateInstanceListItem(1);
      listitem.field.setValue('mama@papa.com');
      currentPage.getContent().getItLanguageTab().click();
      fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0, 'it');
      fieldarea.setAttributeType(attribute);
      listitem = fieldarea.generateInstanceListItem(1);
      listitem.field.setValue('jeff@gogo.com');
      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });

    it('Check email address structure in content validation', () => {
      const wrongValues = {
        en: ['xyz', 'qwe'],
        it: ['s15'],
      };
      const correctValues = {
        en: ['abc@xyz.com', 'bac@cack.com'],
        it: ['ccc@ddd.com'],
      };
      addAttributeToContentType(attribute);
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en,
        }])
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it,
        }], { lang: 'it' });
      
      currentPage.getContent().getEnLanguageTab().click();

      let fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0);
      fieldarea.setAttributeType(attribute);
      let listitem = fieldarea.generateInstanceListItem(0);
      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');
      listitem.field.getHelpBlock().should('be.visible');

      listitem = fieldarea.generateInstanceListItem(1);
      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');
      listitem.field.getHelpBlock().should('be.visible');

      currentPage.getContent().getItLanguageTab().click();

      fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0, 'it');
      fieldarea.setAttributeType(attribute);
      listitem = fieldarea.generateInstanceListItem(0);
      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');
      listitem.field.getHelpBlock().should('be.visible');

      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.en,
        }], { editMode: true })
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.it,
        }], { lang: 'it', editMode: true });

      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });
  });

  describe('Number', () => {
    const attribute = 'Number';
    const testValues = {
      en: ['14', '200', '5'],
      it: ['620', '123'],
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
        .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['11'],
        it: ['23', '350'],
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
        .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, { mandatory: true });
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: ['43'],
        }])
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });

    it('Verify every list element can\'t be empty', () => {
      const wrongValues = {
        en: [''],
        it: ['23', ''],
      };
      addAttributeToContentType(attribute);
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en,
        }])
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it,
        }], { lang: 'it' });
      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent().getEnLanguageTab().click();
      let fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0);
      fieldarea.setAttributeType(attribute);
      let listitem = fieldarea.generateInstanceListItem(0);
      listitem.field.setValue('11');
      currentPage.getContent().getItLanguageTab().click();
      fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0, 'it');
      fieldarea.setAttributeType(attribute);
      listitem = fieldarea.generateInstanceListItem(1);
      listitem.field.setValue('350');
      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });

    it('Try to set custom validation (range) and check it in content validation', () => {
      const range = { 
        start: '3',
        end: '8',
      };
      const wrongValues = {
        en: ['14', '2'],
        it: ['9'],
      };
      const correctValues = {
        en: ['4', '6'],
        it: ['8'],
      };
      addAttributeToContentType(
        attribute,
        { validationRules: { rangeStartNumber: range.start, rangeEndNumber: range.end }},
      );
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en,
        }])
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it,
        }], { lang: 'it' });
      
      currentPage.getContent().getEnLanguageTab().click();

      let fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0);
      fieldarea.setAttributeType(attribute);
      let listitem = fieldarea.generateInstanceListItem(0);
      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');
      listitem.field.getHelpBlock().should('be.visible');

      listitem = fieldarea.generateInstanceListItem(1);
      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');
      listitem.field.getHelpBlock().should('be.visible');

      currentPage.getContent().getItLanguageTab().click();

      fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0, 'it');
      fieldarea.setAttributeType(attribute);
      listitem = fieldarea.generateInstanceListItem(0);
      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');
      listitem.field.getHelpBlock().should('be.visible');

      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.en,
        }], { editMode: true })
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.it,
        }], { lang: 'it', editMode: true });

      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });
  });

  describe('Date', () => {
    const attribute = 'Date';
    const testValues = {
      en: ['2021-06-12 00:00:00', '2021-11-20 00:00:00'],
      it: ['2021-04-22 00:00:00'],
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
        .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['2021-07-12 00:00:00'],
        it: ['2021-05-10 00:00:00', '2021-12-25 00:00:00'],
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
        .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, { mandatory: true });
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: ['2021-07-12 00:00:00'],
        }])
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });

    it('Try to set custom validation (range) and check it in content validation', () => {
      const validationRules = { 
        rangeStartDate: '2021-09-01 00:00:00',
        rangeEndDate: '2021-09-30 00:00:00',
      };
      const wrongValues = {
        en: ['2021-06-12 00:00:00', '2021-10-01 00:00:00'],
        it: ['2021-06-25 00:00:00'],
      };
      const correctValues = {
        en: ['2021-09-01 00:00:00', '2021-09-12 00:00:00'],
        it: ['2021-09-15 00:00:00'],
      };
      addAttributeToContentType(attribute, { validationRules });
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en,
        }])
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it,
        }], { lang: 'it' });

      let fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0, 'it');
      fieldarea.setAttributeType(attribute);
      let listitem = fieldarea.generateInstanceListItem(0);

      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');

      currentPage.getContent().getEnLanguageTab().click();

      fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0);
      fieldarea.setAttributeType(attribute);
      listitem = fieldarea.generateInstanceListItem(0);
      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');

      listitem = fieldarea.generateInstanceListItem(1);
      listitem.field.getContents().children('div').invoke('hasClass', 'has-error').should('be.true');

      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.en,
        }], { editMode: true })
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: correctValues.it,
        }], { lang: 'it', editMode: true });

      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });
  });

  describe('Enumerator', () => {
    const attribute = 'Enumerator';
    const enumProps = {
      enumeratorStaticItems: 'a,b,c',
      enumeratorStaticItemsSeparator: ',',
    };
    const testValues = {
      en: ['a'],
      it: ['b', 'b', 'a'],
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues, enumProps)
        .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['c', 'a'],
        it: ['a', 'b'],
      };
      basicEditContentAttributes(attribute, testValues, editedValues, enumProps)
        .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, enumProps, { mandatory: true });
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: ['a'],
        }])
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });

    it('Verify every list element can\'t be empty', () => {
      const wrongValues = {
        en: ['c', ''],
        it: ['a', ''],
      };
      addAttributeToContentType(attribute, enumProps);
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en,
        }])
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it,
        }], { lang: 'it' });
      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent().getEnLanguageTab().click();
      let fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0);
      fieldarea.setAttributeType(attribute);
      let listitem = fieldarea.generateInstanceListItem(1);
      listitem.field.setValue('a');
      currentPage.getContent().getItLanguageTab().click();
      fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0, 'it');
      fieldarea.setAttributeType(attribute);
      listitem = fieldarea.generateInstanceListItem(1);
      listitem.field.setValue('b');
      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });
  });

  describe('EnumeratorMap', () => {
    const attribute = 'EnumeratorMap';
    const enumProps = {
      enumeratorStaticItems: 'x=1,y=2,z=3',
      enumeratorStaticItemsSeparator: ',',
    };
    const testValues = {
      en: ['z', 'x'],
      it: ['y', 'y', 'z'],
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues, enumProps)
        .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: ['y', 'z'],
        it: ['x'],
      };
      basicEditContentAttributes(attribute, testValues, editedValues, enumProps)
        .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, enumProps, { mandatory: true });
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: ['x'],
        }])
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });

    it('Verify every list element can\'t be empty', () => {
      const wrongValues = {
        en: ['y', '', 'z'],
        it: ['x', ''],
      };
      addAttributeToContentType(attribute, enumProps);
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.en,
        }])
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: wrongValues.it,
        }], { lang: 'it' });
      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent().getEnLanguageTab().click();
      let fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0);
      fieldarea.setAttributeType(attribute);
      let listitem = fieldarea.generateInstanceListItem(1);
      listitem.field.setValue('x');
      currentPage.getContent().getItLanguageTab().click();
      fieldarea = currentPage.getContent().getAttributeByTypeIndex('List', 0, 'it');
      fieldarea.setAttributeType(attribute);
      listitem = fieldarea.generateInstanceListItem(1);
      listitem.field.setValue('y');
      currentPage.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });
  });

  describe('Boolean', () => {
    const attribute = 'Boolean';
    const testValues = {
      en: [true, false],
      it: [true],
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
        .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: [false, true, true],
        it: [false, true, false, false],
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
        .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, { mandatory: true });
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: [false],
        }])
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });
  });

  describe('CheckBox', () => {
    const attribute = 'CheckBox';
    const testValues = {
      en: [true, false],
      it: [true],
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
        .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: [false, true, true],
        it: [false, true, false, false],
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
        .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, { mandatory: true });
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: [true],
        }])
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });
  });

  describe('ThreeState', () => {
    const attribute = 'ThreeState';
    const testValues = {
      en: [true, null],
      it: [null, false],
    };

    it('Create', () => {
      basicCreateContentAttributes(attribute, testValues)
        .should('deep.equal', testValues);
    });

    it('Edit', () => {
      const editedValues = {
        en: [null, false, true],
        it: [false, null, null, true],
      };
      basicEditContentAttributes(attribute, testValues, editedValues)
        .should('deep.equal', editedValues);
    });

    it('Try to set standard validation (required) and check it in content validation', () => {
      addAttributeToContentType(attribute, {}, { mandatory: true });
      navigateToContentForm();
      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      currentPage.getContent()
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: [null],
        }])
        .getSaveApproveAction().invoke('hasClass', 'disabled').should('be.false');
    });
  });
});
