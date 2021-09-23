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
      cy.wrap(attribute).as('attributeToDelete');
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
      addAttributeToContentType(attribute);
      navigateToContentForm();

      currentPage.getContent()
        .fillBeginContent(CONTENT_WITH_LIST.description)
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: testValues.en,
        }])
        .fillAttributes([{
          type: 'List',
          nestedType: attribute,
          value: testValues.it,
        }], { lang: 'it' });
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      return cy.contentsController()
        .then(controller => controller.getContentList())
        .then((response) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('deep.equal', testValues);
    });

    /* it('Edit', () => {
      addAttributeToContentType(attribute);

    }); */
  });

  /* describe('Email', () => {

  });

  describe('Number', () => {

  });

  describe('Date', () => {

  });

  describe('Enumerator', () => {

  });

  describe('Enumerator Map', () => {

  });

  describe('Boolean', () => {

  });

  describe('Checkbox', () => {

  });

  describe('ThreeState', () => {

  }); */
});