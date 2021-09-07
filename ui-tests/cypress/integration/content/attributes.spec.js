import HomePage from '../../support/pageObjects/HomePage';
import {
  ATTRIBUTES,
  COMPLEX_ATTRIBUTES,
  MULTILANG_ATTRIBUTES,
} from '../../support/pageObjects/content/management/AddPage';

const CONTENT_TYPE = {
  code: 'CYP',
  name: 'Cypress Demo',
};

const BASIC_ATTRIBUTES = ATTRIBUTES.filter(attribute => !COMPLEX_ATTRIBUTES.includes(attribute));
const isMultiLang = attribute => MULTILANG_ATTRIBUTES.includes(attribute);

/* const NO_ATTRIBUTE_FOR_TYPE_LIST = [
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

const NO_ATTRIBUTE_FOR_TYPE_MONOLIST = ['List', 'Monolist']; */

const attributeValues = {
  Attach: {
    en: {
      upload: { file: 'icon/blank.pdf' },
    },
    it: {
      upload: { file: 'icon/blank.pdf' },
    },
  },
  Boolean: true,
  CheckBox: true,
  Date: '2021-06-12 00:00:00',
  Email: 'jeff@jepoy.com',
  Hypertext: {
    en: 'Hypertext it is',
    it: 'Hypertext e',
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
  Link: {
    link: {
      destType: 1,
      urlDest: 'https://entando.com',
      target: '_blank',
      hreflang: 'en'
    },
    values: {
      en: 'Entando en',
      it: 'Entando it',
    },
  },
  Longtext: {
    en: 'Demo Long',
    it: 'Demo Long It',
  },
  Monotext: 'Le quick brown fox',
  Number: '14',
  Text: {
    en: 'Demo',
    it: 'Demo It',
  },
  ThreeState: false,
  Timestamp: '2021-04-12 04:15:00',
};


describe('Content Type Attributes Extensive Tests', () => {
  let currentPage;

  const navigateCreateContent = () => {
    currentPage = currentPage.getMenu().getContent().open();
    currentPage = currentPage.openManagement();
    currentPage = currentPage.getContent().openAddContentPageWithContentType(CONTENT_TYPE.name);
  };

  const fillAttributeWithValue = (attribute, value) => {
    if (attribute === 'Link') {
      const { link, values } = value;
      currentPage.getContent().fillAttributes([{
        value: { link, value: values.en },
        type: attribute,
      }])
      .fillAttributes([{
        value: { link, value: values.it },
        type: attribute,
      }], 'it');
    } else if (isMultiLang(attribute)) {
      currentPage.getContent().fillAttributes([{
        value: value.en,
        type: attribute,
      }])
      .fillAttributes([{
        value: value.it,
        type: attribute,
      }], 'it');
    } else {
      currentPage.getContent().fillAttributes([{
        value,
        type: attribute,
      }]);
    }
  };

  const formatCompareAttributeValues = (value, attribute) => {
    switch(attribute) {
      case 'Attach': {
        const { values: { en, it } } = value;
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
        const { values: { en, it } } = value;
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
      case 'Link': {
        const { value: linkValue, values } = value;
        // eslint-disable-next-line no-unused-vars
        const { symbolicDestination, resourceDest, ...linkProps } = linkValue;
        const link = Object.keys(linkProps)
          .filter(linkprop => linkValue[linkprop] !== null)
          .reduce((acc, curr) => ({ ...acc, [curr]: linkProps[curr] }), {});
        return { link, values };
      }
      default:
        return isMultiLang(attribute) ? value.values : value.value;
    }
  };

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
    cy.wrap(null).as('recentAttachToDelete');
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
    cy.get('@recentAttachToDelete').then((attachCounts) => {
      if (attachCounts !== null && attachCounts > 0) {
        cy.assetsController()
          .then(controller => controller.getAssetsList('file'))
          .then(({ controller, response }) => {
            response.body.payload
              .slice(0, attachCounts).map(attach => attach.id)
              .forEach(assetId => controller.deleteAsset(assetId));
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

  describe('Basic Attributes', () => {
    describe('CRUD', () => {
      BASIC_ATTRIBUTES.forEach((attribute) => {
        it(`Create ${attribute} attribute`, () => {
          cy.contentTypeAttributeController(CONTENT_TYPE.code)
            .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
          cy.wrap(attribute).as('attributeToDelete');
          navigateCreateContent();
          currentPage.getContent()
            .fillBeginContent('cypress basic attribute');
          fillAttributeWithValue(attribute, attributeValues[attribute]);
          currentPage = currentPage.getContent().submitApproveForm();
          cy.wrap(1).as('recentContentsToUnpublish');
          cy.wrap(1).as('recentContentsToDelete');
          if (attribute === 'Attach') {
            cy.wrap(1).as('recentAttachToDelete');
          }
          cy.contentsController()
            .then(controller => controller.getContentList())
            .then(({ response }) => {
              const { body: { payload } } = response;
              const { attributes: [attr] } = payload[0];
              return formatCompareAttributeValues(attr, attribute);
            }).then((value) => {
              if (typeof value === 'object') {
                expect(value).to.deep.equal(attributeValues[attribute]);
              } else {
                expect(value).eq(attributeValues[attribute]);
              }
            });
        });        
      });
    });
    /* it('try to set standard validation (required) and check it in content validation', () => {
      
    }); */
  });

  describe('Multilanguage Attributes', () => {
    describe('try to set the value for both languages and be sure they are preserved', () => {
      MULTILANG_ATTRIBUTES.forEach((attribute) => {
        it(`${attribute} attribute`, () => {
          cy.contentTypeAttributeController(CONTENT_TYPE.code)
            .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
          cy.wrap(attribute).as('attributeToDelete');
          navigateCreateContent();
          currentPage.getContent()
            .fillBeginContent('cypress demo desc')
            .fillAttributes([{
              value: attributeValues[attribute].en,
              type: attribute,
            }])
            .fillAttributes([{
              value: attributeValues[attribute].it,
              type: attribute,
            }], 'it');
          currentPage = currentPage.getContent().submitApproveForm();
          cy.wrap(1).as('recentContentsToUnpublish');
          cy.wrap(1).as('recentContentsToDelete');
          if (attribute === 'Attach') {
            cy.wrap(1).as('recentAttachToDelete');
          }
          cy.contentsController()
            .then(controller => controller.getContentList())
            .then(({ response }) => {
              const { body: { payload } } = response;
              const { attributes: [attr] } = payload[0];
              return formatCompareAttributeValues(attr, attribute);
            })
            .should('deep.equal', attributeValues[attribute]);
        });
      });
    });

    describe('if multilanguage nest it in a complex attribute, try to set the value for both languages and be sure they are preserved and correct', () => {
      const compositeFormat = {
        type: 'Composite',
        compositeAttributeType: 'Composite',
        code: 'Composite',
        nestedAttribute: { code: 'Composite' },
        compositeAttributes: [],
      };
      
      MULTILANG_ATTRIBUTES.forEach((attribute) => {
        it(`${attribute} attribute`, () => {
          cy.contentTypeAttributeController(CONTENT_TYPE.code)
            .then(controller => controller.addAttribute({ 
              ...compositeFormat,
              compositeAttributes: [{
                compositeAttributeType: 'Composite',
                type: attribute,
                code: attribute,
              }]
            }));
          cy.wrap(compositeFormat.code).as('attributeToDelete');
          currentPage = currentPage.getMenu().getContent().open();
          currentPage = currentPage.openManagement();
          currentPage = currentPage.getContent().openAddContentPageWithContentType(CONTENT_TYPE.name);
          currentPage.getContent()
            .fillBeginContent('cypress demo desc')
            .fillAttributes([{
              type: 'Composite',
              value: [{
                type: attribute,
                value: attributeValues[attribute].en,
              }]
            }])
            .fillAttributes([{
              type: 'Composite',
              value: [{
                type: attribute,
                value: attributeValues[attribute].it,
              }]
            }], 'it');
          currentPage = currentPage.getContent().submitApproveForm();
          cy.wrap(1).as('recentContentsToUnpublish');
          cy.wrap(1).as('recentContentsToDelete');
          if (attribute === 'Attach') {
            cy.wrap(1).as('recentAttachToDelete');
          }
          cy.contentsController()
            .then(controller => controller.getContentList())
            .then(({ response }) => {
              const { body: { payload } } = response;
              const { compositeelements: [attr] } = payload[0].attributes[0];
              return formatCompareAttributeValues(attr, attribute);
            })
            .should('deep.equal', attributeValues[attribute]);
        });
      });
    });
  });

  /*
  describe('Nest to Complex Attributes', () => {
    it('nest non-complex attributes to a complex attribute and try the typical CRUD operations and check value and format of the visualized info', () => {

    });
  }); */
});