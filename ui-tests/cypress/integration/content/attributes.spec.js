import HomePage from '../../support/pageObjects/HomePage';

const CONTENT_TYPE = {
  code: 'CYP',
  name: 'Cypress Demo',
};

const BASIC_ATTRIBUTES = ['Attach', 'Boolean', 'CheckBox', 'Date', 'Email', 'Hypertext', 'Image', 'Link', 'Longtext', 'Monotext', 'Number', 'Text', 'ThreeState', 'Timestamp'];

const NO_ATTRIBUTE_FOR_TYPE_LIST = [
  'Attach',
  'Boolean',
  'Image',
  'Text',
  'Longtext',
  'Hypertext',
  'Monolist',
  'List',
  'Composite',
];

const MULTILANG_ATTRIBUTES = [
  'Attach',
  'Image',
  'Hypertext',
  'Longtext',
  'Text',
];

const NO_ATTRIBUTE_FOR_TYPE_MONOLIST = ['List', 'Monolist'];


describe('Content Type Attributes Extensive Tests', () => {
  let currentPage;

  before(() => {
    cy.kcLogin('admin').as('tokens');
    cy.contentTypesController()
      .then(controller => controller.addContentType(CONTENT_TYPE.code, CONTENT_TYPE.name));
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
          .then(controller => controller.getContentList())
          .then(({ controller, response }) => {
            response.body.payload
              .slice(0, contentCounts).map(content => content.id)
              .forEach(contentId => controller.updateStatus(contentId, 'draft'));
          });
      }
    });
    cy.get('@recentContentsToDelete').then((contentCounts) => {
      if (contentCounts !== null && contentCounts > 0) {
        cy.contentsController()
          .then(controller => controller.getContentList())
          .then(({ controller, response }) => {
            response.body.payload
              .slice(0, contentCounts).map(content => content.id)
              .forEach(contentId => controller.deleteContent(contentId));
          });
      }
    });
    cy.get('@attributeToDelete').then((attributeToDelete) => {
      if (attributeToDelete !== null) {
        cy.contentTypeAttributeController(CONTENT_TYPE.code)
          .then(controller => controller.deleteAttribute(attributeToDelete));
      }
    });
    cy.kcLogout();
  });

  after(() => {
    cy.kcLogin('admin').as('tokens');
    cy.contentTypesController()
      .then(controller => controller.deleteContentType(CONTENT_TYPE.code));
    cy.kcLogout();
  });

  describe('Multilanguage Attributes', () => {
    /* beforeEach(() => {
      currentPage = currentPage.getMenu().getContent().open();
      currentPage = currentPage.openTypes();
    }); */
    describe('try to set the value for both languages and be sure they are preserved', () => {
      const multilangValues = {
        Text: {
          en: 'Demo',
          it: 'Demo It',
        },
        Longtext: {
          en: 'Demo Long',
          it: 'Demo Long It',
        },
        Hypertext: {
          en: 'Hypertext it is',
          it: 'Hypertext e',
        },
        Attach: {
          en: {
            upload: { file: 'icon/blank.pdf' },
          },
          it: {
            upload: { file: 'icon/blank.pdf' },
          },
        },
        Image: {
          en: {
            upload: 'entando_at_plan.jpg',
            metadata: {
              legend: 'TPlan',
              alt: 'Entando at Plan',
              description: 'At Plan',
            },
          },
          it: {
            upload: 'entando_at_plan.jpg',
            metadata: {
              legend: 'IPlan',
              alt: 'Entando al piano',
              description: 'It Plan',
            },
          },
        },
      };
      MULTILANG_ATTRIBUTES.forEach((attribute) => {
        it(`${attribute} attribute`, () => {
          cy.contentTypeAttributeController(CONTENT_TYPE.code)
            .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
          cy.wrap(attribute).as('attributeToDelete');
          currentPage = currentPage.getMenu().getContent().open();
          currentPage = currentPage.openManagement();
          currentPage = currentPage.getContent().openAddContentPageWithContentType(CONTENT_TYPE.name);
          currentPage.getContent()
            .fillBeginContent('cypress demo desc')
            .fillAttributes([{
              value: multilangValues[attribute].en,
              type: attribute,
            }])
            .fillAttributes([{
              value: multilangValues[attribute].it,
              type: attribute,
            }], 'it');
          currentPage = currentPage.getContent().submitApproveForm();
          cy.wrap(1).as('recentContentsToUnpublish');
          cy.wrap(1).as('recentContentsToDelete');
          cy.contentsController()
            .then(controller => controller.getContentList())
            .then(({ response }) => {
              const { body: { payload } } = response;
              const { attributes: [attr] } = payload[0];
              switch(attribute) {
                case 'Text':
                case 'Longtext':
                case 'Hypertext':
                  return attr.values;
                case 'Attach': {
                  const { values: { en, it } } = attr;
                  return {
                    en: {
                      upload: { file: `icon/${en.name}` },
                    },
                    it: {
                      upload: { file: `icon/${it.name}` },
                    },
                  };
                }
                case 'Image': {
                  const { values: { en, it } } = attr;
                  return {
                    en: {
                      upload: en.name,
                      metadata: {
                        legend: en.metadata.legend,
                        alt: en.metadata.alt,
                        description: en.metadata.description,
                      },
                    },
                    it: {
                      upload: it.name,
                      metadata: {
                        legend: it.metadata.legend,
                        alt: it.metadata.alt,
                        description: it.metadata.description,
                      },
                    },
                  };
                }
              }
            })
            .should('deep.equal', multilangValues[attribute]);
        });
      });
    });

    /* it('if multilanguage nest it in a complex attribute, try to set the value for both languages and be sure they are preserved and correct', () => {

    }); */
  });

  /* describe('Basic Attributes', () => {
    it('try to set standard validation (required) and check it in content validation', () => {

    });
  });

  describe('Nest to Complex Attributes', () => {
    it('nest non-complex attributes to a complex attribute and try the typical CRUD operations and check value and format of the visualized info', () => {

    });
  }); */
});