import {generateRandomTypeCode, generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

describe([Tag.GTS], 'Content Types', () => {

  let contentType = {};

  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => cy.kcUILogout());

  describe('Unreferenced', () => {

    beforeEach(() => {
      cy.wrap(null).as('contentTypeToBeDeleted');
      contentType.code = generateRandomTypeCode();
      contentType.name = generateRandomId();
    });

    afterEach(() => cy.get('@contentTypeToBeDeleted').then(code => {
      if (code) deleteContentType(code);
    }));

    it('should have the functionality to add a new content type', () => {
      openContentTypesPage()
        .then(page => {
          cy.log(`Add content type with code ${contentType.code}`);
          page.getContent().openAddContentTypePage();
        })
        .then(page => page.getContent().addAndSaveContentType(contentType.code, contentType.name))
        .then(page => page.getContent().getTableRow(contentType.code).should('exist')
          .then(row => {
            cy.wrap(row).children(htmlElements.td).eq(0).should('contain.text', contentType.name);
            cy.wrap(row).children(htmlElements.td).eq(1).should('contain.text', contentType.code);
            cy.wrap(contentType.code).as('contentTypeToBeDeleted');
          }));
    });

    it('should have the functionality to edit a content type', () => {
      postContentType(contentType.code, contentType.name);

      cy.wrap(generateRandomId()).then(newContentTypeName => {
        openContentTypesPage()
          .then(page => {
            cy.log(`Edit content type with code ${contentType.code}`);
            page.getContent().getKebabMenu(contentType.code).open().openEdit();
          })
          .then(page => {
            page.getContent().getNameInput().then(input => page.getContent().type(input, newContentTypeName));
            page.getContent().save();
          })
          .then(page => page.getContent().getTableRow(contentType.code).find(htmlElements.td).eq(0).should('contain.text', newContentTypeName));
      });
    });

    it('should allow deleting a content type not referenced by a published content', () => {
      postContentType(contentType.code, contentType.name);

      openContentTypesPage()
        .then(page => {
          cy.log(`Delete content type with code ${contentType.code}`);
          page.getContent().getKebabMenu(contentType.code).open().clickDelete();
        })
        .then(page => page.getContent().submit())
        .then(page => {
          page.getContent().getTableRow(contentType.code).should('not.exist');
          cy.wrap(null).as('contentTypeToBeDeleted');
        });
    });

  });

  describe('Referenced by published content', () => {

    beforeEach(() => {
      cy.wrap(null).as('contentTypeToBeDeleted');
      contentType.code = generateRandomTypeCode();
      contentType.name = generateRandomId();

      postContentType(contentType.code, contentType.name);

      const content = {
        typeCode: contentType.code,
        description: generateRandomId(),
        mainGroup: 'administrators',
        status: 'published'
      };

      cy.contentsController().then(controller => controller.addContent(content))
        .then((response) => {
          const {body: {payload}} = response;
          cy.wrap(payload[0].id).as('contentToBeDeleted');
        });
    });

    afterEach(() => {
      cy.get('@contentToBeDeleted').then(contentId => {
        if (contentId) cy.contentsController().then(controller => controller.deleteContent(contentId));
      });
      cy.get('@contentTypeToBeDeleted').then(code => {
        if (code) deleteContentType(code);
      })
    });

    it('should not allow deleting a content type', () => {
      openContentTypesPage()
        .then(page => {
          cy.log(`Delete content type with code ${contentType.code}`);
          page.getContent().getKebabMenu(contentType.code).open().clickDelete();
        })
        .then(page => page.getContent().getAlertMessage().should('exist').and('contain.text', 'before deleting'));
    });

    it('should allow adding an attribute', () => {
      cy.wrap('Text').then(testAttribute => {
        openContentTypesPage()
          .then(page => page.getContent().getKebabMenu(contentType.code).open().openEdit())
          .then(page => page.getContent().openAddAttributePage(testAttribute))
          .then(page => {
            page.getContent().getCodeInput().then(input => page.getContent().type(input, testAttribute));
            page.getContent().continue();
          })
          .then(page => page.getContent().getAttributesTable().should('contain', testAttribute));
      });
    });

    it('should allow updating an attribute', () => {
      cy.wrap({ type: 'Text', code: 'Text' }).then(testAttribute => {
        cy.wrap('Text2').then(newAttributeName => {
          cy.contentTypeAttributesController(contentType.code).then(controller => controller.addAttribute(testAttribute));
          openContentTypesPage()
            .then(page => page.getContent().getKebabMenu(contentType.code).open().openEdit())
            .then(page => page.getContent().getKebabMenu(testAttribute.code).open().openEdit(testAttribute.code))
            .then(page => {
              page.getContent().getNameInput().then(input => page.getContent().type(input, newAttributeName));
              page.getContent().continue();
            })
            .then(page => page.getContent().getKebabMenu(testAttribute.code).open().openEdit(testAttribute.code))
            .then(page => page.getContent().getNameInput().should('have.value', newAttributeName));
        });
      });
    });

  });

  describe('Attributes', () => {

    const ATTRIBUTE_TYPES          = {
      LIST: 'List',
      MONOLIST: 'Monolist',
      COMPOSITE: 'Composite'
    };
    const COMPOSITE_SUB_ATTRIBUTES = [
      {type: 'Hypertext', code: undefined, names: {en: undefined}},
      {type: 'Link', code: undefined, names: {en: undefined}},
      {type: 'Timestamp', code: undefined, names: {en: undefined}},
      {type: 'Image', code: undefined, names: {en: undefined}}
    ];

    before(() => {
      cy.kcAPILogin();
      postContentType(generateRandomTypeCode(), generateRandomId(), 'contentType')
    });

    beforeEach(() => {
      cy.kcAPILogin();
      cy.wrap([]).as('attributesToBeDeleted');
    });

    afterEach(function () {
      cy.get('@attributesToBeDeleted').then(attributes => {
        if (attributes) {
          attributes.forEach(attribute =>
            cy.contentTypeAttributesController(this.contentType)
              .then(controller => controller.deleteAttribute(attribute)))
        }
      });
    });

    after(function () {
      cy.kcAPILogin();
      if (this.contentType) cy.contentTypesController().then(controller => controller.deleteContentType(this.contentType));
    });

    describe('Basic Attributes', () => {

      const BASIC_ATTRIBUTES = ['Attach', 'Boolean', 'CheckBox', 'Date', 'Email', 'Hypertext', 'Image', 'Link', 'Longtext', 'Monotext', 'Number', 'Text', 'ThreeState', 'Timestamp'];

      BASIC_ATTRIBUTES.forEach(type => {
        it(`Add ${type} attribute`, function () {
          cy.wrap(generateRandomId()).then(attribute => {
            openEditContentTypePage(this.contentType)
            .then(page => page.getContent().openAddAttributePage(type))
            .then(page => {
              page.getContent().getCodeInput().then(input => page.getContent().type(input, attribute));
              page.getContent().continue(type);
            })
            .then(page => {
              page.getContent().getAttributesTable().should('contain', attribute);
              cy.pushAlias('@attributesToBeDeleted', attribute);
            })
          })
        });
      });

      BASIC_ATTRIBUTES.forEach(type => {
        it(`Edit ${type} attribute`, function () {
          cy.wrap(generateRandomId()).then(updatedAttributeName => {
            cy.wrap(generateRandomId()).then(attribute => {
              postBasicAttribute(this.contentType, attribute, type);
              editAttributeName(type, updatedAttributeName, this.contentType, attribute)
                .then(page => page.getContent().getKebabMenu(attribute).open().openEdit(attribute))
                .then(page => page.getContent().getNameInput().should('have.value', updatedAttributeName));
            })
          });
        });
      });

      BASIC_ATTRIBUTES.forEach(type => {
        it(`Delete ${type} attribute`, function () {
          cy.wrap(generateRandomId()).then(attribute => {
            postTextAttribute(this.contentType);
            postBasicAttribute(this.contentType, attribute, type);

            openEditContentTypePage(this.contentType)
              .then(() => deleteAttribute(this.contentType, attribute))
              .then(page => {
                page.getContent().getAttributesTable().should('not.contain', attribute);
                cy.deleteAlias('@attributesToBeDeleted', attribute);
              });
          });
        });
      });

      const postBasicAttribute = (type, attribute, attributeType) => {
        cy.contentTypeAttributesController(type).then(controller => controller.addAttribute({ type: attributeType, code: attribute }));
        cy.pushAlias('@attributesToBeDeleted', attribute);
      };

    });

    describe('List', () => {

      it('Un-allowed nested attribute types', function () {
        openEditContentTypePage(this.contentType)
          .then(page => page.getContent().openAddAttributePage(ATTRIBUTE_TYPES.LIST))
          .then(page => page.getContent().getNestedAttributeType()
                            .should('not.contain', 'Text')
                            .and('not.contain', 'Longtext')
                            .and('not.contain', 'Hypertext')
                            .and('not.contain', 'Image')
                            .and('not.contain', 'Attach')
                            .and('not.contain', 'Link'));
      });

      describe('Allowed nested attribute types', () => {

        const NESTED_ATTRIBUTE_TYPES = {CHECKBOX: 'CheckBox', EMAIL: 'Email', DATE: 'Date'};

        Object.values(NESTED_ATTRIBUTE_TYPES).forEach(type =>
          it(`Add ${type} attribute`, function () {
            addArrayAttribute(ATTRIBUTE_TYPES.LIST, type, this.contentType);
          })
        );

        Object.values(NESTED_ATTRIBUTE_TYPES).forEach(type =>
          it(`Update ${type} attribute`, function () {
            cy.wrap(generateRandomId()).then(attribute => editArrayAttribute(ATTRIBUTE_TYPES.LIST, type, this.contentType, attribute));
          })
        );

      });

    });

    describe('Monolist', () => {

      it('Un-allowed nested attribute types', function () {
        openEditContentTypePage(this.contentType)
          .then(page => page.getContent().openAddAttributePage(ATTRIBUTE_TYPES.MONOLIST))
          .then(page => page.getContent().getNestedAttributeType()
                            .should('not.contain', 'Monolist')
                            .and('not.contain', 'List'));
      });

      describe('Allowed nested attribute types', () => {

        const NESTED_ATTRIBUTE_TYPES = {TEXT: 'Text', IMAGE: 'Image', ATTACH: 'Attach'};

        Object.values(NESTED_ATTRIBUTE_TYPES).forEach(type =>
          it(`Add ${type} attribute`, function () {
            addArrayAttribute(ATTRIBUTE_TYPES.MONOLIST, type, this.contentType)
          })
        );

        Object.values(NESTED_ATTRIBUTE_TYPES).forEach(type =>
          it(`Update ${type} attribute`, function () {
            cy.wrap(generateRandomId()).then(attribute => editArrayAttribute(ATTRIBUTE_TYPES.MONOLIST, type, this.contentType, attribute));
          })
        );

      });

      describe('Composite nested attribute', () => {

        beforeEach(() =>
            COMPOSITE_SUB_ATTRIBUTES.forEach(attribute => {
              attribute.code     = generateRandomId();
              attribute.names    = {};
              attribute.names.en = generateRandomId();
            })
        );

        it('Add monolist composite attribute', function () {
          cy.wrap(generateRandomId()).then(attribute => {
            openEditContentTypePage(this.contentType)
              .then(page => page.getContent().openAddAttributePage(ATTRIBUTE_TYPES.MONOLIST))
              .then(page => {
                page.getContent().getCodeInput().then(input => page.getContent().type(input, attribute));
                page.getContent().getNestedAttributeType().then(input => page.getContent().select(input, ATTRIBUTE_TYPES.COMPOSITE));
                page.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE);
              })
              .then(() => {
                cy.pushAlias('@attributesToBeDeleted', attribute);
                addCompositeSubAttributes(attribute, this.contentType);
              })
          })
        });

        it('Edit monolist composite attribute', function () {
          cy.wrap(generateRandomId()).then(attribute => {
            postMonolistCompositeAttribute(this.contentType, attribute);
            cy.wrap(generateRandomId()).then(updatedAttributeName => {
              editAttributeName(ATTRIBUTE_TYPES.COMPOSITE, updatedAttributeName, this.contentType, attribute);
            });
          });
        });

        it('Add sub-attribute', function () {
          cy.wrap(generateRandomId()).then(attribute => {
            postMonolistCompositeAttribute(this.contentType, attribute);
            openEditAttribute(this.contentType, attribute)
              .then(page => page.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE))
              .then(() => addCompositeSubAttribute(this.contentType, COMPOSITE_SUB_ATTRIBUTES[3].type, COMPOSITE_SUB_ATTRIBUTES[3].code))
          });
        });

        it('Remove sub-attribute', function () {
          cy.wrap(generateRandomId()).then(attribute => {
            postMonolistCompositeAttribute(this.contentType, attribute);
            openEditAttribute(this.contentType, attribute)
              .then(page => page.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE))
              .then(() => COMPOSITE_SUB_ATTRIBUTES.slice(0, 2).forEach(({code}) => deleteAttribute(this.contentType, code)));
          });
        });

        it('Delete monolist composite attribute', function () {
          postTextAttribute(this.contentType);
          cy.wrap(generateRandomId()).then(attribute => {
            postMonolistCompositeAttribute(this.contentType, attribute);
            openEditContentTypePage(this.contentType)
              .then(() => deleteAttribute(this.contentType, attribute))
              .then(page => {
                page.getContent().getAttributesTable().should('not.contain', attribute);
                cy.deleteAlias('@attributesToBeDeleted', attribute);
              });
          });
        });

        const postMonolistCompositeAttribute = (contentTypeCode, attributeCode) => {
          cy.wrap({
            type: ATTRIBUTE_TYPES.MONOLIST,
            code: attributeCode,
            nestedAttribute:
            {
              type: ATTRIBUTE_TYPES.COMPOSITE,
              code: attributeCode,
              compositeAttributes: COMPOSITE_SUB_ATTRIBUTES.slice(0, 3)
            }
          }).then(attribute => {
            cy.contentTypeAttributesController(contentTypeCode).then(controller => controller.addAttribute(attribute));
            cy.pushAlias('@attributesToBeDeleted', attributeCode);
          });
        };

      });

    });

    describe('Composite', () => {

      beforeEach(() =>
          COMPOSITE_SUB_ATTRIBUTES.forEach(attribute => {
            attribute.code     = generateRandomId();
            attribute.names    = {};
            attribute.names.en = generateRandomId();
          })
      );

      it('Add composite attribute', function () {
        cy.wrap(generateRandomId()).then(attribute => {
          openEditContentTypePage(this.contentType)
            .then(page => page.getContent().openAddAttributePage(ATTRIBUTE_TYPES.COMPOSITE))
            .then(page => {
              page.getContent().getCodeInput().then(input => page.getContent().type(input, attribute));
              page.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE);
            })
            .then(() => {
              addCompositeSubAttributes(attribute, this.contentType);
              cy.pushAlias('@attributesToBeDeleted', attribute);
            });
        });
      });

      it('Edit composite attribute', function () {
        cy.wrap(generateRandomId()).then(updatedAttributeName => {
          cy.wrap(generateRandomId()).then(attribute => {
            postCompositeAttribute(attribute, this.contentType);
            editAttributeName(ATTRIBUTE_TYPES.COMPOSITE, updatedAttributeName, this.contentType, attribute)
              .then(page => page.getContent().continue());
              // no way to verify the name change
          });
        });
      });

      it('Add sub-attribute', function () {
        cy.wrap(generateRandomId()).then(attribute => {
          postCompositeAttribute(attribute, this.contentType);
          openEditAttribute(this.contentType, attribute)
            .then(page => page.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE))
            .then(() => addCompositeSubAttribute(this.contentType, COMPOSITE_SUB_ATTRIBUTES[3].type, COMPOSITE_SUB_ATTRIBUTES[3].code))
            .then(page => page.getContent().continue());
        });
      });

      it('Remove sub-attribute', function () {
        cy.wrap(generateRandomId()).then(attribute => {
          postCompositeAttribute(attribute, this.contentType);
          openEditAttribute(this.contentType, attribute)
            .then(page => {
              page.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE);
              COMPOSITE_SUB_ATTRIBUTES.slice(0, 2).forEach(({code}) => deleteAttribute(this.contentType, code));
              page.getContent().continue();
            });
        });
      });

      it('Delete composite attribute', function () {
        postTextAttribute(this.contentType);
        cy.wrap(generateRandomId()).then(attribute => {
          postCompositeAttribute(attribute, this.contentType)
          openEditContentTypePage(this.contentType)
            .then(() => deleteAttribute(this.contentType, attribute));
        });
      });

      const postCompositeAttribute = (attributeCode, contentTypeCode) => {
        cy.wrap({
          code: attributeCode,
          type: ATTRIBUTE_TYPES.COMPOSITE,
          compositeAttributes: COMPOSITE_SUB_ATTRIBUTES.slice(0, 3)
        }).then(attribute => {
          cy.contentTypeAttributesController(contentTypeCode).then(controller => controller.addAttribute(attribute));
          cy.pushAlias('@attributesToBeDeleted', attributeCode);
        });
      };

    });

    const postTextAttribute = (type) => {
      cy.wrap(generateRandomId()).then(additionalTextAttribute => {
        cy.contentTypeAttributesController(type).then(controller => controller.addAttribute({type: 'Text', code: additionalTextAttribute}));
        cy.pushAlias('@attributesToBeDeleted', additionalTextAttribute);
      });
    };

    const openEditContentTypePage = (contentTypeCode) => {
      return openContentTypesPage()
               .then(page => page.getContent().getKebabMenu(contentTypeCode).open().openEdit());
    };

    const openEditAttribute = (contentTypeCode, attribute) => {
      return openEditContentTypePage(contentTypeCode)
               .then(page => page.getContent().getKebabMenu(attribute).open().openEdit(attribute));
    };

    const editAttributeName = (attributeType, updatedAttributeName, contentTypeCode, attribute) => {
      return openEditAttribute(contentTypeCode, attribute)
               .then(page => {
                 page.getContent().getNameInput().then(input => page.getContent().type(input, updatedAttributeName));
                 page.getContent().continue(attributeType);
               });
    };

    const addArrayAttribute  = (attributeType, nestedAttributeType, contentTypeCode) => {
      cy.wrap(generateRandomId()).then(attribute => {
        openEditContentTypePage(contentTypeCode)
          .then(page => page.getContent().openAddAttributePage(attributeType))
          .then(page => {
            page.getContent().getCodeInput().then(input => page.getContent().type(input, attribute));
            page.getContent().getNestedAttributeType().then(input => page.getContent().select(input, nestedAttributeType));
            page.getContent().continue(attributeType);
          })
          .then(page => page.getContent().continue())
          .then(page => {
            page.getContent().getAttributesTable().should('contain', attribute);
            cy.pushAlias('@attributesToBeDeleted', attribute);
          })
      })
    };

    const editArrayAttribute = (attributeType, nestedAttributeType, contentTypeCode, attributeCode) => {
      cy.wrap(generateRandomId()).then(updatedAttributeName => {
        cy.wrap({ code: attributeCode, type: attributeType, nestedAttribute: { type: nestedAttributeType, code: attributeCode } }).then(newAttribute => {
          cy.contentTypeAttributesController(contentTypeCode).then(controller => controller.addAttribute(newAttribute));
          cy.pushAlias('@attributesToBeDeleted', attributeCode);
          editAttributeName(attributeType, updatedAttributeName, contentTypeCode, attributeCode)
            .then(page => page.getContent().continue())
            .then(page => {
              cy.log('check if new name of list attribute exists');
              page.getContent().getKebabMenu(attributeCode).open().openEdit(attributeCode)
            })
            .then(page => page.getContent().getNameInput().should('have.value', updatedAttributeName));
        });
      });
    };

    const addCompositeSubAttribute  = (contentTypeCode, attributeType, attributeCode) => {
      cy.get('@currentPage')
        .then(page => {
          cy.log(`Add new composite attribute ${attributeType} to ${contentTypeCode}`);
          page.getContent().openAddAttributePage(attributeType);
        })
        .then(page => {
          page.getContent().getCodeInput().then(input => page.getContent().type(input, attributeCode));
          page.getContent().continue('', true);
        })
        .then(page => {
          cy.log('check if new list attribute exists');
          page.getContent().getAttributesTable().should('contain', attributeCode);
          return cy.wrap(page).as('currentPage');
        })
    };

    const addCompositeSubAttributes = (attributeCode, contentTypeCode) => {
      cy.get('@currentPage')
        .then(() => {
          COMPOSITE_SUB_ATTRIBUTES.slice(0, 3).forEach(({ type, code }) =>
            addCompositeSubAttribute(contentTypeCode, type, code)
          );
        })
        .then(page => page.getContent().continue())
        .then(page => {
          page.getContent().getAttributesTable().should('contain', attributeCode);
          return cy.wrap(page).as('currentPage');
        });
    };

    const deleteAttribute = (contentTypeCode, attributeCode) => {
      return cy.get('@currentPage')
               .then(page => {
                 cy.log(`Remove attribute ${attributeCode} from ${contentTypeCode}`);
                 page.getContent().getKebabMenu(attributeCode).open().getDelete().then(button => page.getContent().click(button));
               })
    };

  });

  const postContentType = (code, name, alias = 'contentTypeToBeDeleted') => {
    cy.contentTypesController().then(controller => controller.addContentType(code, name)).then(() => cy.wrap(code).as(alias))
  };

  const deleteContentType = (code) => cy.contentTypesController().then(controller => controller.deleteContentType(code));

  const openContentTypesPage = () => cy.get('@currentPage').then(page => page.getMenu().getContent().open().openTypes());

});
