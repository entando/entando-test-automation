import {generateRandomTypeCode, generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage.js';

describe('Content Types', () => {

  let currentPage;
  let contentType = {};

  beforeEach(() => cy.kcLogin('admin').as('tokens'));

  afterEach(() => cy.kcLogout());

  describe('Unreferenced', () => {

    beforeEach(() => {
      contentType.code = generateRandomTypeCode();
      contentType.name = generateRandomId();
    });

    it('should have the functionality to add a new content type', () => {
      currentPage = openContentTypesPage();

      cy.log(`Add content type with code ${contentType.code}`);
      currentPage = currentPage.getContent().openAddContentTypePage();
      currentPage = currentPage.getContent().addAndSaveContentType(contentType.code, contentType.name);
      currentPage.getContent().getCodeInput().should('have.value', contentType.code).and('be.disabled');
      currentPage.getContent().getNameInput().should('have.value', contentType.name);

      currentPage = currentPage.getContent().save();
      currentPage.getContent().getTableRow(contentType.code).find(htmlElements.td).eq(0).should('contain.text', contentType.name);
      currentPage.getContent().getTableRow(contentType.code).find(htmlElements.td).eq(2).should('contain.text', contentType.code);

      deleteContentType(contentType.code);
    });

    it('should have the functionality to edit a content type', () => {
      postContentType(contentType.code, contentType.name);
      currentPage = openContentTypesPage();

      cy.log(`Edit content type with code ${contentType.code}`);
      currentPage              = currentPage.getContent().getKebabMenu(contentType.code).open().openEdit();
      const newContentTypeName = generateRandomId();
      currentPage.getContent().clearName();
      currentPage.getContent().typeName(newContentTypeName);
      currentPage = currentPage.getContent().save();
      currentPage.getContent().getTableRow(contentType.code).find(htmlElements.td).eq(0).should('contain.text', newContentTypeName);

      deleteContentType(contentType.code);
    });

    it('should allow deleting a content type not referenced by a published content', () => {
      postContentType(contentType.code, contentType.name);
      currentPage = openContentTypesPage();

      cy.log(`Delete content type with code ${contentType.code}`);
      currentPage.getContent().getKebabMenu(contentType.code).open().clickDelete();
      currentPage.getDialog().confirm();
      currentPage.getContent().getTable().should('not.contain', contentType.code);
    });

  });

  describe('Referenced by published content', () => {

    let contentId;

    beforeEach(() => {
      contentType.code = generateRandomTypeCode();
      contentType.name = generateRandomId();

      postContentType(contentType.code, contentType.name);

      const content = {
        typeCode: contentType.code,
        description: generateRandomId(),
        mainGroup: 'administrators',
        status: 'published'
      };
      cy.contentsController().then(controller => controller.postContent(content))
        .then((response) => {
          const {body: {payload}} = response;
          contentId               = payload[0].id;
        });
    });

    afterEach(() => {
      cy.contentsController().then(controller => controller.deleteContent(contentId));
      deleteContentType(contentType.code);
    });

    it('should not allow deleting a content type', () => {
      currentPage = openContentTypesPage();

      cy.log(`Delete content type with code ${contentType.code}`);
      currentPage.getContent().getKebabMenu(contentType.code).open().clickDelete();
      currentPage.getDialog().confirm();
      cy.validateToast(currentPage, contentType.code, false);
    });

    it('should allow adding an attribute', () => {
      currentPage = openContentTypesPage();

      const testAttribute = 'Text';
      currentPage         = currentPage.getContent().getKebabMenu(contentType.code).open().openEdit();
      currentPage         = currentPage.getContent().openAddAttributePage(testAttribute);

      currentPage.getContent().typeCode(testAttribute);
      currentPage = currentPage.getContent().continue();
      currentPage.getContent().getAttributesTable().should('contain', testAttribute);
    });

    it('should allow updating an attribute', () => {
      currentPage         = openContentTypesPage();
      const testAttribute = {type: 'Text', code: 'Text'};
      cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(testAttribute));

      currentPage = currentPage.getContent().getKebabMenu(contentType.code).open().openEdit();
      currentPage = currentPage.getContent().getKebabMenu(testAttribute.code).open().openEdit();
      currentPage.getContent().clearName('en');
      const newAttributeName = 'Text2';
      currentPage.getContent().typeName('en', newAttributeName);
      currentPage = currentPage.getContent().continue();
      currentPage.getContent().getAttributesTable().should('contain', newAttributeName);
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

    let attribute               = {};
    let attributeToBeDeleted    = false;
    let additionalTextAttribute = null;

    before(() => {
      contentType.code = generateRandomTypeCode();
      contentType.name = generateRandomId();

      cy.kcLogin('admin').as('tokens');
      cy.contentTypesController().then(controller => controller.addContentType(contentType.code, contentType.name));
      cy.kcLogout();
    });

    beforeEach(() => attribute.code = generateRandomId());

    afterEach(() => {
      if (attributeToBeDeleted) {
        cy.contentTypeAttributeController(contentType.code)
          .then(controller => controller.deleteAttribute(attribute.code))
          .then(() => attributeToBeDeleted = false);
      }
      if (additionalTextAttribute) {
        cy.contentTypeAttributeController(contentType.code)
          .then(controller => controller.deleteAttribute(additionalTextAttribute))
          .then(() => additionalTextAttribute = null);
      }
    });

    after(() => {
      cy.kcLogin('admin').as('tokens');
      cy.contentTypesController().then(controller => controller.deleteContentType(contentType.code));
      cy.kcLogout();
    });

    describe('Basic Attributes', () => {

      const BASIC_ATTRIBUTES = ['Attach', 'Boolean', 'CheckBox', 'Date', 'Email', 'Hypertext', 'Image', 'Link', 'Longtext', 'Monotext', 'Number', 'Text', 'ThreeState', 'Timestamp'];

      BASIC_ATTRIBUTES.forEach(type => {
        it(`Add ${type} attribute`, () => {
          currentPage = openEditContentTypePage(contentType.code);

          currentPage = currentPage.getContent().openAddAttributePage(type);
          currentPage.getContent().typeCode(attribute.code);
          currentPage = currentPage.getContent().continue(type);
          currentPage.getContent().getAttributesTable().should('contain', attribute.code);

          attributeToBeDeleted = true;
        });
      });

      BASIC_ATTRIBUTES.forEach(type => {
        it(`Edit ${type} attribute`, () => {
          const updatedAttributeName = generateRandomId();

          postBasicAttribute(type);

          currentPage = editAttributeName(type, updatedAttributeName);
          currentPage.getContent().getTableRow(attribute.code).should('contain', updatedAttributeName);
        });
      });

      BASIC_ATTRIBUTES.forEach(type => {
        it(`Delete ${type} attribute`, () => {
          postTextAttribute();
          postBasicAttribute(type);
          attributeToBeDeleted = false;

          currentPage = openEditContentTypePage(contentType.code);
          deleteAttribute(currentPage, contentType.code, attribute.code);
          currentPage.getContent().getAttributesTable().should('not.contain', attribute.code);
        });
      });

      const postBasicAttribute = (type) => {
        attribute.type = type;
        cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(attribute));
        attributeToBeDeleted = true;
      };

    });

    describe('List', () => {

      it('Un-allowed nested attribute types', () => {
        currentPage = openEditContentTypePage(contentType.code);
        currentPage = currentPage.getContent().openAddAttributePage(ATTRIBUTE_TYPES.LIST);

        currentPage.getContent().getNestedAttributeType()
                   .should('not.contain', 'Text')
                   .and('not.contain', 'Longtext')
                   .and('not.contain', 'Hypertext')
                   .and('not.contain', 'Image')
                   .and('not.contain', 'Attach')
                   .and('not.contain', 'Link');
      });

      describe('Allowed nested attribute types', () => {

        const NESTED_ATTRIBUTE_TYPES = {CHECKBOX: 'CheckBox', EMAIL: 'Email', DATE: 'Date'};

        Object.values(NESTED_ATTRIBUTE_TYPES).forEach(type =>
            it(`Add ${type} attribute`, () => addArrayAttribute(ATTRIBUTE_TYPES.LIST, type))
        );

        Object.values(NESTED_ATTRIBUTE_TYPES).forEach(type =>
            it(`Update ${type} attribute`, () => editArrayAttribute(ATTRIBUTE_TYPES.LIST, type))
        );

      });

    });

    describe('Monolist', () => {

      it('Un-allowed nested attribute types', () => {
        currentPage = openEditContentTypePage(contentType.code);
        currentPage = currentPage.getContent().openAddAttributePage(ATTRIBUTE_TYPES.MONOLIST);

        currentPage.getContent().getNestedAttributeType()
                   .should('not.contain', 'Monolist')
                   .and('not.contain', 'List');
      });

      describe('Allowed nested attribute types', () => {

        const NESTED_ATTRIBUTE_TYPES = {TEXT: 'Text', IMAGE: 'Image', ATTACH: 'Attach'};

        Object.values(NESTED_ATTRIBUTE_TYPES).forEach(type =>
            it(`Add ${type} attribute`, () => addArrayAttribute(ATTRIBUTE_TYPES.MONOLIST, type))
        );

        Object.values(NESTED_ATTRIBUTE_TYPES).forEach(type =>
            it(`Update ${type} attribute`, () => editArrayAttribute(ATTRIBUTE_TYPES.MONOLIST, type))
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

        it('Add monolist composite attribute', () => {
          currentPage = openEditContentTypePage(contentType.code);
          currentPage = currentPage.getContent().openAddAttributePage(ATTRIBUTE_TYPES.MONOLIST);

          currentPage.getContent().typeCode(attribute.code);
          currentPage.getContent().selectNestedAttributeType(ATTRIBUTE_TYPES.COMPOSITE);
          currentPage = currentPage.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE);
          cy.validateUrlPathname(`/cms/content-type/attribute/${contentType.code}/MonolistAdd/${attribute.code}`);
          attributeToBeDeleted = true;

          addCompositeSubAttributes(currentPage, attribute.code);
        });

        it('Edit monolist composite attribute', () => {
          const updatedAttributeName = generateRandomId();

          postMonolistCompositeAttribute();

          currentPage = editAttributeName(ATTRIBUTE_TYPES.COMPOSITE, updatedAttributeName);
        });

        it('Add sub-attribute', () => {
          postMonolistCompositeAttribute();

          currentPage = openEditAttribute();
          currentPage = currentPage.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE);
          currentPage = addCompositeSubAttribute(currentPage, contentType.code, COMPOSITE_SUB_ATTRIBUTES[3].type, COMPOSITE_SUB_ATTRIBUTES[3].code);
        });

        it('Remove sub-attribute', () => {
          postMonolistCompositeAttribute();

          currentPage = openEditAttribute();
          currentPage = currentPage.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE);
          COMPOSITE_SUB_ATTRIBUTES.slice(0, 2).forEach(({code}) => deleteAttribute(currentPage, contentType.code, code, true));
        });

        it('Delete monolist composite attribute', () => {
          postTextAttribute();
          postMonolistCompositeAttribute();
          attributeToBeDeleted = false;

          currentPage = openEditContentTypePage(contentType.code);
          deleteAttribute(currentPage, contentType.code, attribute.code);
          currentPage.getContent().getAttributesTable().should('not.contain', attribute.code);
        });

        const postMonolistCompositeAttribute = () => {
          attribute.type            = ATTRIBUTE_TYPES.MONOLIST;
          attribute.nestedAttribute = {
            type: ATTRIBUTE_TYPES.COMPOSITE,
            code: attribute.code,
            compositeAttributes: COMPOSITE_SUB_ATTRIBUTES.slice(0, 3)
          };
          cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(attribute));
          attributeToBeDeleted = true;
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

      it('Add composite attribute', () => {
        currentPage = openEditContentTypePage(contentType.code);
        currentPage = currentPage.getContent().openAddAttributePage(ATTRIBUTE_TYPES.COMPOSITE);

        currentPage.getContent().typeCode(attribute.code);
        currentPage = currentPage.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE);

        addCompositeSubAttributes(currentPage, attribute.code);
        attributeToBeDeleted = true;
      });

      it('Edit composite attribute', () => {
        const updatedAttributeName = generateRandomId();

        postCompositeAttribute();

        currentPage = editAttributeName(ATTRIBUTE_TYPES.COMPOSITE, updatedAttributeName);
        currentPage = currentPage.getContent().continue();

        currentPage.getContent().getTableRow(attribute.code).should('contain', updatedAttributeName);
      });

      it('Add sub-attribute', () => {
        postCompositeAttribute();

        currentPage = openEditAttribute();
        currentPage = currentPage.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE);
        currentPage = addCompositeSubAttribute(currentPage, contentType.code, COMPOSITE_SUB_ATTRIBUTES[3].type, COMPOSITE_SUB_ATTRIBUTES[3].code);
        currentPage = currentPage.getContent().continue();
      });

      it('Remove sub-attribute', () => {
        postCompositeAttribute();

        currentPage = openEditAttribute();
        currentPage = currentPage.getContent().continue(ATTRIBUTE_TYPES.COMPOSITE);
        COMPOSITE_SUB_ATTRIBUTES.slice(0, 2).forEach(({code}) =>
            deleteAttribute(currentPage, contentType.code, code, true)
        );
        currentPage = currentPage.getContent().continue();
      });

      it('Delete composite attribute', () => {
        postTextAttribute();
        postCompositeAttribute();
        attributeToBeDeleted = false;

        currentPage = openEditContentTypePage(contentType.code);

        deleteAttribute(currentPage, contentType.code, attribute.code);
      });

      const postCompositeAttribute = () => {
        attribute.type                = ATTRIBUTE_TYPES.COMPOSITE;
        attribute.compositeAttributes = COMPOSITE_SUB_ATTRIBUTES.slice(0, 3);
        cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(attribute));
        attributeToBeDeleted = true;
      };

    });

    const postTextAttribute = () => {
      additionalTextAttribute = generateRandomId();
      const textAttribute     = {type: 'Text', code: additionalTextAttribute};
      cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(textAttribute));
    };

    const openEditContentTypePage = (contentTypeCode) => {
      currentPage = openContentTypesPage();
      return currentPage.getContent().getKebabMenu(contentTypeCode).open().openEdit();
    };

    const openEditAttribute = () => {
      currentPage = openEditContentTypePage(contentType.code);

      currentPage = currentPage.getContent().getKebabMenu(attribute.code).open().openEdit();
      cy.validateUrlPathname(`/cms/content-type/attribute/${contentType.code}/edit/${attribute.code}`);
      return currentPage;
    };
    const editAttributeName = (attributeType, updatedAttributeName) => {
      currentPage = openEditAttribute();

      currentPage.getContent().clearName('en');
      currentPage.getContent().typeName('en', updatedAttributeName);
      return currentPage.getContent().continue(attributeType);
    };

    const addArrayAttribute  = (attributeType, nestedAttributeType) => {
      currentPage = openEditContentTypePage(contentType.code);
      currentPage = currentPage.getContent().openAddAttributePage(attributeType);

      currentPage.getContent().typeCode(attribute.code);
      currentPage.getContent().selectNestedAttributeType(nestedAttributeType);
      currentPage = currentPage.getContent().continue(attributeType);
      cy.validateUrlPathname(`/cms/content-type/attribute/${contentType.code}/MonolistAdd/${attribute.code}`);

      currentPage = currentPage.getContent().continue();
      cy.validateUrlPathname(`/cms/content-types/edit/${contentType.code}`);
      currentPage.getContent().getAttributesTable().should('contain', attribute.code);

      attributeToBeDeleted = true;
    };
    const editArrayAttribute = (attributeType, nestedAttributeType) => {
      const updatedAttributeName = generateRandomId();

      attribute.type            = attributeType;
      attribute.nestedAttribute = {
        type: nestedAttributeType,
        code: attribute.code
      };
      cy.contentTypeAttributeController(contentType.code).then(controller => controller.addAttribute(attribute));
      attributeToBeDeleted = true;

      currentPage = editAttributeName(attributeType, updatedAttributeName);
      cy.validateUrlPathname(`/cms/content-type/attribute/${contentType.code}/MonolistAdd/${attribute.code}`);

      currentPage = currentPage.getContent().continue();
      cy.validateUrlPathname(`/cms/content-types/edit/${contentType.code}`);

      cy.log('check if new name of list attribute exists');
      currentPage.getContent().getTableRow(attribute.code).should('contain', updatedAttributeName);
    };

    const addCompositeSubAttribute  = (page, contentTypeCode, attributeType, attributeCode) => {
      cy.log(`Add new composite attribute ${attributeType} to ${contentTypeCode}`);
      currentPage = page.getContent().openAddAttributePage(attributeType);
      currentPage.getContent().typeCode(attributeCode);
      currentPage = currentPage.getContent().continue('', true);
      cy.log('check if new list attribute exists');
      currentPage.getContent().getAttributesTable().should('contain', attributeCode);
      return currentPage;
    };
    const addCompositeSubAttributes = (page, attributeCode) => {
      COMPOSITE_SUB_ATTRIBUTES.slice(0, 3).forEach(({type, code}) =>
          currentPage = addCompositeSubAttribute(page, contentType.code, type, code)
      );
      currentPage = currentPage.getContent().continue();
      currentPage.getContent().getAttributesTable().should('contain', attributeCode);
      return currentPage;
    };

    const deleteAttribute = (page, contentTypeCode, attributeCode, isSubAttribute = false) => {
      cy.log(`Remove attribute ${attributeCode} from ${contentTypeCode}`);
      page.getContent().getKebabMenu(attributeCode).open().clickDelete();
      if (!isSubAttribute) {
        page.getDialog().getBody().getStateInfo().should('contain', attributeCode);
        page.getDialog().confirm();
      }
      page.getContent().getAttributesTable().should('not.contain', attributeCode);
    };

  });

  const postContentType   = (code, name) => cy.contentTypesController().then(controller => controller.addContentType(code, name));
  const deleteContentType = (code) => cy.contentTypesController().then(controller => controller.deleteContentType(code));

  const openContentTypesPage = () => {
    cy.visit('/');
    let currentPage = new HomePage();
    currentPage     = currentPage.getMenu().getContent().open();
    return currentPage.openTypes();
  };

});
