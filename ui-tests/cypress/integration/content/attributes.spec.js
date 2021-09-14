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

const CONTENT = {
  description: 'basic content attribute test',
  mainGroup: 'free',
  typeCode: CONTENT_TYPE.code,
  attributes: [],
};

const compositeFormat = {
  type: 'Composite',
  compositeAttributeType: 'Composite',
  code: 'Composite',
  nestedAttribute: { code: 'Composite' },
  compositeAttributes: [],
};


describe('Content Type Attributes', () => {
  let currentPage;

  const navigateContentForm = (mode = 'create') => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getContent().open();
    currentPage = currentPage.openManagement();
    switch(mode) {
      case 'create':
      default:
        currentPage = currentPage.getContent().openAddContentPageWithContentType(CONTENT_TYPE.name);
        break;
      case 'edit':
        currentPage = currentPage.getContent().openEditContentPage();
        break;
    }
  };

  const fillAttributeWithValue = (attribute, value, editMode = false) => {
    if (attribute === 'Link') {
      const { link, values } = value;
      currentPage.getContent().fillAttributes([{
        value: { link, value: values.en },
        type: attribute,
      }], { editMode })
      .fillAttributes([{
        value: { link, value: values.it },
        type: attribute,
      }], { lang: 'it', editMode });
    } else if (isMultiLang(attribute)) {
      currentPage.getContent().fillAttributes([{
        value: value.en,
        type: attribute,
      }], { editMode })
      .fillAttributes([{
        value: value.it,
        type: attribute,
      }], { lang: 'it', editMode });
    } else {
      currentPage.getContent().fillAttributes([{
        value,
        type: attribute,
      }], { editMode });
    }
  };

  const formatCompareAttributeValues = (actualValue, attribute) => {
    switch(attribute) {
      case 'Attach': {
        const { values: { en, it } } = actualValue;
        return {
          en: {
            upload: { file: `upload/${en.name}` },
          },
          it: {
            upload: { file: `upload/${it.name}` },
          },
        };
      }
      case 'Image': {
        const { values: { en, it } } = actualValue;
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
        const { value: linkValue, values } = actualValue;
        // eslint-disable-next-line no-unused-vars
        const { symbolicDestination, resourceDest, ...linkProps } = linkValue;
        const link = Object.keys(linkProps)
          .filter(linkprop => linkValue[linkprop] !== null)
          .reduce((acc, curr) => ({ ...acc, [curr]: linkProps[curr] }), {});
        return { link, values };
      }
      default:
        return isMultiLang(attribute) ? actualValue.values : actualValue.value;
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
    cy.wrap(null).as('recentImageToDelete');
    cy.kcLogin('admin').as('tokens');
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
    cy.get('@recentImageToDelete').then((imageCounts) => {
      if (imageCounts !== null && imageCounts > 0) {
        cy.assetsController()
          .then(controller => controller.getAssetsList('image'))
          .then(({ controller, response }) => {
            response.body.payload
              .slice(0, imageCounts).map(image => image.id)
              .forEach(imageId => controller.deleteAsset(imageId));
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

  describe('Text attribute', () => {
    const attribute = 'Text';
    const testValue = {
      en: 'Demo',
      it: 'Demo It',
    };
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('deep.equal', testValue);
    });

    it('Edit', () => {
      const editedValues = {
        en: 'Demo en',
        it: 'Demo edited It',
      };
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, values: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValues, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('deep.equal', editedValues);
    });
  });

  describe('Monotext attribute', () => {
    const attribute = 'Monotext';
    const testValue = 'Le quick brown fox';
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', testValue);
    });

    it('Edit', () => {
      const editedValue = 'the edited slow fox';
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, value: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValue, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', editedValue);
    });
  });

  describe('Email attribute', () => {
    const attribute = 'Email';
    const testValue = 'jeff@jepoy.com';
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', testValue);
    });

    it('Edit', () => {
      const editedValue = 'mojo@jojo.com';
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, value: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValue, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', editedValue);
    });
  });

  describe('Longtext attribute', () => {
    const attribute = 'Longtext';
    const testValue = {
      en: 'Demo Long',
      it: 'Demo Long It',
    };
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('deep.equal', testValue);
    });

    it('Edit', () => {
      const editedValues = {
        en: 'Demo long edited en',
        it: 'Demo long edited It',
      };
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, values: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValues, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('deep.equal', editedValues);
    });
  });

  describe('Number attribute', () => {
    const attribute = 'Number';
    const testValue = '14';
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', testValue);
    });

    it('Edit', () => {
      const editedValue = '68';
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, value: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValue, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', editedValue);
    });
  });

  describe('Hypertext attribute', () => {
    const attribute = 'Hypertext';
    const testValue = {
      en: 'Hypertext it is',
      it: 'Hypertext e',
    };
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('deep.equal', testValue);
    });

    it('Edit', () => {
      const editedValues = {
        en: 'Hypertext edited it is',
        it: 'Hypertext edited it e',
      };
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, values: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValues, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('deep.equal', editedValues);
    });
  });

  describe('Image attribute', () => {
    const attribute = 'Image';
    const testValue = {
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
    };
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('deep.equal', testValue);
    });

    it('Edit', () => {
      const editedValues = {
        en: {
          upload: { file: 'upload/entando_400x400.png' },
          metadata: {
            legend: 'legend',
            alt: '_popup',
            description: 'desc edited',
          },
        },
        it: {
          upload: { file: 'upload/entando_400x400.png' },
          metadata: {
            legend: 'lengend it',
            alt: '_popup',
            description: 'desc edited',
          },
        },
      };

      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{
            code: attribute,
            values: {
              en: {
                id: 'entandoAtPlan',
                name: 'entando_at_plan.jpg',
                metadata: {
                  ...testValue,
                }
              },
              it: {
                id: 'entandoAtPlan',
                name: 'entando_at_plan.jpg',
                metadata: {
                  ...testValue,
                }
              },
            },
          }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValues, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.wrap(1).as('recentImageToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          const formatCompare = formatCompareAttributeValues(attr, attribute);
          return {
            en: {
              ...formatCompare.en,
              upload: { file: `upload/${attr.values.en.name}` },
            },
            it: {
              ...formatCompare.it,
              upload: { file: `upload/${attr.values.it.name}` },
            },
          };
        })
        .should('deep.equal', {
          en: {
            ...testValue.en,
            ...editedValues.en,
          },
          it: {
            ...testValue.it,
            ...editedValues.it,
          }
        });
    });
  });

  describe('Attach attribute', () => {
    const attribute = 'Attach';
    const testValue = {
      en: {
        upload: { file: 'upload/blank.pdf' },
      },
      it: {
        upload: { file: 'upload/blank.pdf' },
      },
    };
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.wrap(1).as('recentAttachToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('deep.equal', testValue);
    });

    it('Edit', () => {
      
      const editedValues = {
        en: {
          metadata: {
            name: 'blanko.pdf',
          },
        },
        it: {
          metadata: {
            name: 'blankow.pdf',
          },
        },
      };
      const fileInfo = { fixture: 'upload/lorem.doc', fileName: 'blank.pdf', fileType: 'application/doc' };

      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      cy.assetsController()
        .then(controller => controller.addAsset(fileInfo, { group: 'free', categories: [], type: 'file' }))
        .then(({ response }) => {
          return cy.contentsController()
            .then(controller => controller.postContent({
              ...CONTENT,
              attributes: [{
                code: attribute,
                values: {
                  en: {
                    id: response.payload.id,
                    name: 'blank.pdf',
                    metadata: {
                      ...testValue.en.metadata,
                    }
                  },
                  it: {
                    id: response.payload.id,
                    name: 'blank.pdf',
                    metadata: {
                      ...testValue.it.metadata,
                    }
                  },
                },
              }],
            }))
            .then(({ controller, response: { body: { payload } } }) => (
              controller.updateStatus(payload.id, 'published')
            ));
          });
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.wrap(1).as('recentAttachToDelete');
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValues, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return {
            en: {
              metadata: {
                name: attr.values.en.name,
              },
            },
            it: {
              metadata: {
                name: attr.values.it.name,
              },
            },
          };
        })
        .should('deep.equal', editedValues);
    });
  });

  describe('Boolean attribute', () => {
    const attribute = 'Boolean';
    const testValue = true;
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', testValue);
    });

    it('Edit', () => {
      const editedValue = false;
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, value: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValue, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', editedValue);
    });
  });

  describe('CheckBox attribute', () => {
    const attribute = 'CheckBox';
    const testValue = true;
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', testValue);
    });

    it('Edit', () => {
      const editedValue = false;
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, value: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValue, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', editedValue);
    });
  });

  describe('ThreeState attribute', () => {
    const attribute = 'ThreeState';
    const testValue = false;
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', testValue);
    });

    it('Edit', () => {
      const editedValue = null;
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, value: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValue, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', editedValue);
    });
  });

  describe('Link attribute', () => {
    const attribute = 'Link';
    const testValue = {
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
    };
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('deep.equal', testValue);
    });

    it('Edit', () => {
      const editedValues = {
        values: {
          en: 'Entando ENG',
          it: 'Entando ITA',
        },
      };
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{
            code: attribute,
            value: testValue.link,
            values: testValue.values,
          }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      cy.wait(500);
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValues, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('deep.equal', {
          ...editedValues,
          link: testValue.link,
        });
    });
  });

  describe('Date attribute', () => {
    const attribute = 'Date';
    const testValue = '2021-06-12 00:00:00';
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', testValue);
    });

    it('Edit', () => {
      const editedValue = '2021-07-20 00:00:00';
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, value: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValue, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', editedValue);
    });
  });

  describe('Enumerator attribute', () => {
    const attribute = 'Enumerator';
    const testValue = 'b';
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({
          type: attribute,
          code: attribute,
          enumeratorStaticItems: 'a,b,c',
          enumeratorStaticItemsSeparator: ',',
        }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', testValue);
    });

    it('Edit', () => {
      const editedValue = 'c';
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
      .then(controller => controller.addAttribute({
        type: attribute,
        code: attribute,
        enumeratorStaticItems: 'a,b,c',
        enumeratorStaticItemsSeparator: ',',
      }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, value: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValue, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', editedValue);
    });
  });

  describe('EnumeratorMap attribute', () => {
    const attribute = 'EnumeratorMap';
    const testValue = 'y';
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({
          type: attribute,
          code: attribute,
          enumeratorStaticItems: 'x=1,y=2,z=3',
          enumeratorStaticItemsSeparator: ',',
        }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', testValue);
    });

    it('Edit', () => {
      const editedValue = 'z';
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
      .then(controller => controller.addAttribute({
        type: attribute,
        code: attribute,
        enumeratorStaticItems: 'x=1,y=2,z=3',
        enumeratorStaticItemsSeparator: ',',
      }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, value: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValue, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', editedValue);
    });
  });

  describe('Timestamp attribute', () => {
    const attribute = 'Timestamp';
    const testValue = '2021-04-12 04:15:00';
    
    it ('Create', () => {
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');
      navigateContentForm();
      currentPage.getContent()
        .fillBeginContent('cypress basic attribute');
      fillAttributeWithValue(attribute, testValue);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', testValue);
    });

    it('Edit', () => {
      const editedValue = '2021-07-20 03:30:00';
      cy.contentTypeAttributeController(CONTENT_TYPE.code)
        .then(controller => controller.addAttribute({ type: attribute, code: attribute }));
      cy.wrap(attribute).as('attributeToDelete');

      cy.contentsController()
        .then(controller => controller.postContent({
          ...CONTENT,
          attributes: [{ code: attribute, value: testValue }],
        }))
        .then(({ controller, response }) => (
          controller.updateStatus(response.body.payload.id, 'published')
        ));
      
      navigateContentForm('edit');
      fillAttributeWithValue(attribute, editedValue, true);
      currentPage = currentPage.getContent().submitApproveForm();
      cy.wrap(1).as('recentContentsToUnpublish');
      cy.wrap(1).as('recentContentsToDelete');
      cy.contentsController()
        .then(controller => controller.getContentList())
        .then(({ response }) => {
          const { body: { payload } } = response;
          const { attributes: [attr] } = payload[0];
          return formatCompareAttributeValues(attr, attribute);
        })
        .should('eq', editedValue);
    });
  });


  /* it('try to set standard validation (required) and check it in content validation', () => {
      
  }); */

  /*
  describe('Nest to Complex Attributes', () => {
    it('nest non-complex attributes to a complex attribute and try the typical CRUD operations and check value and format of the visualized info', () => {

    });
  }); */
});
