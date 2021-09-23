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
        currentPage = currentPage.getContent().openAddContentPageWithContentType(CONTENT_TYPE_WITH_LIST.name);
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

  const formatCompareAttributeValues = (actualValue, attribute) => {
    const { listelements: { en, it } } = actualValue;
    switch(attribute) {
      default:
      case 'Monotext': {
        return {
          en: en.map(({ value }) => value),
          it: it.map(({ value }) => value),
        };
      }
    }
  };

  const addAttributeToContentType = (attribute, extraProps = {}) => {
    cy.contentTypeAttributeController(CONTENT_TYPE_WITH_LIST.code)
        .then(controller => controller.addAttribute({
          ...listFormat,
          nestedAttribute: { type: attribute, code: attribute },
          ...extraProps,
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
        return formatCompareAttributeValues(attr, attribute);
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
          return formatCompareAttributeValues(attr, attribute);
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
  });

  describe('Checkbox', () => {
    const attribute = 'Checkbox';
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
  });
});
