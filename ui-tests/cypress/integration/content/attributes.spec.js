import HomePage from '../../support/pageObjects/HomePage';

describe([Tag.GTS], 'Content Type Attributes', () => {

  let currentPage;

  const contentTypeAttributes = [
    {
      type: 'Monotext',
      value: 'Le quick brown fox',
      editedValue: 'the edited slow fox',
      processor: 'simple'
    },
    {
      type: 'Email',
      value: 'cypress@entando.com',
      editedValue: 'cypress.edited@entando.com',
      processor: 'simple'
    },
    {
      type: 'Number',
      value: '42',
      editedValue: '43',
      validationRules: {
        rangeStartNumber: '1',
        rangeEndNumber: '9'
      },
      processor: 'simple'
    },
    {
      type: 'Boolean',
      value: true,
      editedValue: false,
      processor: 'simple'
    },
    {
      type: 'CheckBox',
      value: true,
      editedValue: false,
      processor: 'simple'
    },
    {
      type: 'ThreeState',
      value: false,
      editedValue: null,
      processor: 'simple'
    },
    {
      type: 'Date',
      value: '2022-01-01 00:00:00',
      editedValue: '2022-01-02 00:00:00',
      validationRules: {
        rangeStartDate: '2021-01-01 00:00:00',
        rangeEndDate: '2021-12-31 23:59:59'
      },
      processor: 'simple'
    },
    {
      type: 'Timestamp',
      value: '2022-01-01 00:00:00',
      editedValue: '2022-01-02 00:00:00',
      processor: 'simple'
    },
    {
      type: 'Enumerator',
      value: 'b',
      properties: {
        enumeratorStaticItems: 'a,b,c',
        enumeratorStaticItemsSeparator: ','
      },
      editedValue: 'c',
      processor: 'simple'
    },
    {
      type: 'EnumeratorMap',
      value: 'y',
      properties: {
        enumeratorStaticItems: 'x=1,y=2,z=3',
        enumeratorStaticItemsSeparator: ','
      },
      editedValue: 'z',
      processor: 'simple'
    },
    {
      type: 'Text',
      value: {
        en: 'Demo',
        it: 'Demo It'
      },
      editedValue: {
        en: 'Demo edited',
        it: 'Demo It edited'
      },
      processor: 'multilang'
    },
    {
      type: 'Longtext',
      value: {
        en: 'Demo Long',
        it: 'Demo Long It'
      },
      editedValue: {
        en: 'Demo long edited en',
        it: 'Demo long edited It'
      },
      processor: 'multilang'
    },
    {
      type: 'Hypertext',
      value: {
        en: 'Hypertext it is',
        it: 'Hypertext e'
      },
      editedValue: {
        en: 'Hypertext it is edited',
        it: 'Hypertext e edited'
      },
      processor: 'multilang'
    },
    {
      type: 'Link',
      value: {
        link: {
          destType: 1,
          urlDest: 'https://entando.com',
          target: '_blank',
          hreflang: 'en'
        },
        values: {
          en: 'Entando en',
          it: 'Entando it'
        }
      },
      editedValue: {
        link: {
          destType: 1,
          urlDest: 'https://entando.com',
          target: '_blank',
          hreflang: 'en'
        },
        values: {
          en: 'Entando en edited',
          it: 'Entando it edited'
        }
      },
      processor: 'link'
    },
    {
      type: 'Attach',
      value: {
        en: {
          upload: {file: 'cypress/fixtures/upload/blank.pdf'},
          metadata: {
            name: 'blank.pdf'
          }
        },
        it: {
          upload: {file: 'cypress/fixtures/upload/blank.pdf'},
          metadata: {
            name: 'blank.pdf'
          }
        }
      },
      editedValue: {
        en: {
          metadata: {
            name: 'blanko.pdf'
          }
        },
        it: {
          metadata: {
            name: 'blankow.pdf'
          }
        }
      },
      processor: 'attach'
    },
    {
      type: 'Image',
      value: {
        en: {
          upload: 'entando_at_plan.jpg',
          metadata: {
            legend: 'TPlan',
            alt: 'Entando at Plan',
            description: 'At Plan'
          }
        },
        it: {
          upload: 'entando_at_plan.jpg',
          metadata: {
            legend: 'IPlan',
            alt: 'Entando al piano',
            description: 'It Plan'
          }
        }
      },
      editedValue: {
        en: {
          upload: 'entando_at_work.jpg',
          metadata: {
            legend: 'legend',
            alt: '_popup',
            description: 'desc edited'
          }
        },
        it: {
          upload: 'entando_at_work.jpg',
          metadata: {
            legend: 'lengend it',
            alt: '_popup',
            description: 'desc edited'
          }
        }
      },
      processor: 'image'
    }
  ];

  before(() => {
    cy.kcLogin('login/admin').as('tokens');
    cy.contentTypesController()
      .then(controller => controller.addContentType(CONTENT_TYPE.code, CONTENT_TYPE.name));
    cy.kcLogout();
  });

  beforeEach(() => {
    // TODO this wrap defines the behaviour of a page object and MUST be changed to a method argument
    cy.wrap(null).as('contentEditor');

    cy.wrap(null).as('contentToBeDeleted');
    cy.wrap(null).as('assetToBeDeleted');
    cy.kcLogin('login/admin').as('tokens');
    cy.visit('/');
    currentPage = new HomePage();
  });

  afterEach(() => {
    cy.get('@contentToBeDeleted').then(contentId => {
      if (contentId) {
        cy.contentsController().then(controller =>
            controller.updateStatus(contentId, 'draft')
                      .then(() => controller.deleteContent(contentId)));
      }
    });
    cy.get('@assetToBeDeleted').then(assetId => {
      if (assetId) {
        cy.assetsController().then(controller => controller.deleteAsset(assetId));
      }
    });
    cy.kcLogout();
  });

  after(() => {
    cy.kcLogin('login/admin').as('tokens');
    cy.contentTypesController()
      .then(controller => controller.deleteContentType(CONTENT_TYPE.code));
    cy.kcLogout();
  });

  contentTypeAttributes.forEach(contentTypeAttribute => {
    describe(`${contentTypeAttribute.type} attribute`, () => {

      const attributeProperties = contentTypeAttribute.properties || {};

      describe('Base attribute options', () => {

        before(() => {
          cy.kcLogin('login/admin').as('tokens');
          cy.contentTypeAttributesController(CONTENT_TYPE.code)
            .then(controller => controller.addAttribute({
              type: contentTypeAttribute.type,
              code: contentTypeAttribute.type,
              ...attributeProperties
            }));
          cy.kcLogout();
        });

        after(() => deleteAttribute(contentTypeAttribute));

        it('Create', () => {
          currentPage = openAddPage(currentPage);
          currentPage = attributeProcessor[contentTypeAttribute.processor].fillContent(currentPage, contentTypeAttribute);
          cy.get('@contentToBeDeleted').then(contentId => {
            attributeProcessor[contentTypeAttribute.processor].validateContent(contentId, contentTypeAttribute.value);
          });
        });

        if (['Email'].includes(contentTypeAttribute.type)) {
          it('Email format validation', () => {
            const testInvalidEmail = (page, field, email) => {
              page.getContent().fillAttributes([{value: email, type: 'Email'}], {editMode: true});
              field.getContents().should('have.class', 'has-error');
              field.getHelpBlock().should('exist');
            };

            currentPage = openAddPage(currentPage);

            currentPage.getContent().fillBeginContent('cypress basic attribute');
            const fieldArea = currentPage.getContent().getAttributeByTypeIndex('Email', 0);

            testInvalidEmail(currentPage, fieldArea, 'cypress@entando');
            testInvalidEmail(currentPage, fieldArea, 'cypress@.com');
            testInvalidEmail(currentPage, fieldArea, '@entando.com');
            testInvalidEmail(currentPage, fieldArea, 'cypressentando.com');

            currentPage.getContent().fillAttributes(
                [{value: contentTypeAttribute.value, type: 'Email'}],
                {editMode: true}
            );
            fieldArea.getContents().should('not.have.class', 'has-error');
            fieldArea.getHelpBlock().should('not.exist');
          });
        }

        if (['Hypertext'].includes(contentTypeAttribute.type)) {
          describe('FCKEditor', () => {

            before(() => {
              cy.kcLogin('login/admin').as('tokens');
              cy.contentSettingsController().then(controller => controller.putContentEditor('fckeditor'));
              cy.kcLogout();
            });

            beforeEach(() => cy.wrap(true).as('contentEditor'));

            after(() => {
              cy.kcLogin('login/admin').as('tokens');
              cy.contentSettingsController().then(controller => controller.putContentEditor());
              cy.kcLogout();
            });

            it('Add multiple links to hypertext', () => {
              currentPage = openAddPage(currentPage);

              currentPage.getContent()
                         .fillBeginContent('cypress basic attribute')
                         .fillAttributes([{type: contentTypeAttribute.type, value: 'hello{selectall}'}]);

              const editor = currentPage.getContent().getAttributeByTypeIndex(contentTypeAttribute.type, 0);
              editor.setLinkInfo({destType: 3, contentDest: 'NWS4', target: '_blank'});

              editor.getInput().type('{movetoend} there, world!');
              cy.realPress('ArrowLeft');
              cy.realPress(['Shift', 'ArrowLeft']);
              cy.realPress(['Shift', 'ArrowLeft']);
              cy.realPress(['Shift', 'ArrowLeft']);
              cy.realPress(['Shift', 'ArrowLeft']);
              cy.realPress(['Shift', 'ArrowLeft']);
              editor.setLinkInfo({destType: 3, contentDest: 'TCL6', target: '_blank'});

              currentPage.getContent().copyToAllLanguages();
              cy.wait(2000); //TODO wait toast to disappear

              currentPage = attributeProcessor.submitContentAndWrapContentId(currentPage);

              cy.get('@contentToBeDeleted').then(contentId => {
                getContentAttribute(contentId)
                    .then(attribute => attribute.values)
                    .should('deep.equal', {
                      en: '<p><a href="#!C;NWS4!#" target="_blank">hello</a> there, <a href="#!C;TCL6!#" target="_blank">world</a>!</p>',
                      it: '<p><a href="#!C;NWS4!#" target="_blank">hello</a> there, <a href="#!C;TCL6!#" target="_blank">world</a>!</p>'
                    });
              });
            });

          });
        }

        if (['Image'].includes(contentTypeAttribute.type)) {
          describe('Asset group', () => {

            const TEST_GROUP = 'testgroup';

            before(() => {
              cy.wrap(null).as('imageToBeDeleted');
              cy.kcLogin('login/admin').as('tokens');
              cy.groupsController()
                .then(controller => controller.addGroup(TEST_GROUP, TEST_GROUP))
                .then(() => cy.assetsController().then(controller =>
                    controller.addAsset(
                                  {path: 'upload/entando_400x400.png', name: 'entando_400x400.png', type: 'image/png'},
                                  {group: TEST_GROUP, categories: [], type: 'image'})
                              .then(response => cy.wrap(response.payload.id).as('imageToBeDeleted'))));
              cy.kcLogout();
            });

            after(() => {
              cy.kcLogin('login/admin').as('tokens');
              cy.get('@imageToBeDeleted').then(imageId => {
                if (imageId) { cy.assetsController().then(controller => controller.deleteAsset(imageId)); }
              });
              cy.groupsController().then(controller => controller.deleteGroup(TEST_GROUP));
              cy.kcLogout();
            });

            it('Check that image group is compatible with current content', () => {
              const addedImage = {...contentTypeAttribute};
              addedImage.value = {
                en: {
                  upload: 'entando_400x400.png',
                  metadata: {
                    legend: 'Ent',
                    alt: 'Entando',
                    description: 'Entando Logo'
                  }
                },
                it: {
                  upload: 'entando_400x400.png',
                  metadata: {
                    legend: 'Ent',
                    alt: 'Entando',
                    description: 'Entando Logo'
                  }
                }
              };

              currentPage = openAddPage(currentPage);

              currentPage = attributeProcessor[contentTypeAttribute.processor].fillGroupContent(currentPage, addedImage, TEST_GROUP);
              cy.get('@contentToBeDeleted').then(contentId => {
                attributeProcessor[contentTypeAttribute.processor].validateContent(contentId, addedImage.value);
              });
            });

          });
        }

        describe('Existing content', () => {

          beforeEach(() => attributeProcessor[contentTypeAttribute.processor].postContent(contentTypeAttribute));

          it('Edit', () => {
            currentPage = openEditPage(currentPage);
            currentPage = attributeProcessor[contentTypeAttribute.processor].editContent(currentPage, contentTypeAttribute);
            cy.get('@contentToBeDeleted').then(contentId => {
              attributeProcessor[contentTypeAttribute.processor].validateContent(contentId, contentTypeAttribute.editedValue);
            });
          });

        });

      });

      describe('Field validation options', () => {

        if (!['Boolean', 'CheckBox', 'ThreeState'].includes(contentTypeAttribute.type)) {
          describe('Mandatoriness validation', () => {

            before(() => {
              cy.kcLogin('login/admin').as('tokens');
              cy.contentTypeAttributesController(CONTENT_TYPE.code)
                .then(controller => controller.addAttribute({
                  type: contentTypeAttribute.type,
                  code: contentTypeAttribute.type,
                  mandatory: true,
                  ...attributeProperties
                }));
              cy.kcLogout();
            });

            after(() => deleteAttribute(contentTypeAttribute));

            it('Create', () => {
              currentPage = openAddPage(currentPage);
              currentPage.getContent().fillBeginContent('cypress basic attribute');
              attributeProcessor[contentTypeAttribute.processor].validateMandatoriness(currentPage, contentTypeAttribute);
            });

          });
        }

        if (['Monotext', 'Text', 'Longtext'].includes(contentTypeAttribute.type)) {
          describe('Custom regex validation', () => {

            before(() => {
              cy.kcLogin('login/admin').as('tokens');
              cy.contentTypeAttributesController(CONTENT_TYPE.code)
                .then(controller => controller.addAttribute({
                  type: contentTypeAttribute.type,
                  code: contentTypeAttribute.type,
                  validationRules: {regex: '^[A-Za-z\\s]+$'},
                  ...attributeProperties
                }));
              cy.kcLogout();
            });

            after(() => deleteAttribute(contentTypeAttribute));

            it('Create', () => {
              const value = ['Text', 'Longtext'].includes(contentTypeAttribute.type) ? contentTypeAttribute.value.en : contentTypeAttribute.value;
              currentPage = openAddPage(currentPage);

              currentPage.getContent().fillBeginContent('cypress basic attribute');
              const fieldArea = currentPage.getContent().getAttributeByTypeIndex(contentTypeAttribute.type, 0);

              currentPage.getContent().fillAttributes([{
                value: value + '0',
                type: contentTypeAttribute.type
              }]);
              fieldArea.getContents().should('have.class', 'has-error');
              fieldArea.getHelpBlock().should('exist');

              currentPage.getContent().fillAttributes([{
                value: value,
                type: contentTypeAttribute.type
              }], {editMode: true});
              fieldArea.getContents().should('not.have.class', 'has-error');
              fieldArea.getHelpBlock().should('not.exist');
            });

          });
        }

        if (['Number', 'Date'].includes(contentTypeAttribute.type)) {
          describe('Custom range validation', () => {

            before(() => {
              cy.kcLogin('login/admin').as('tokens');
              cy.contentTypeAttributesController(CONTENT_TYPE.code)
                .then(controller => controller.addAttribute({
                  type: contentTypeAttribute.type,
                  code: contentTypeAttribute.type,
                  validationRules: contentTypeAttribute.validationRules,
                  ...attributeProperties
                }));
              cy.kcLogout();
            });

            after(() => deleteAttribute(contentTypeAttribute));

            it('Create', () => {
              currentPage = openAddPage(currentPage);

              currentPage.getContent().fillBeginContent('cypress basic attribute');
              const fieldArea = currentPage.getContent().getAttributeByTypeIndex(contentTypeAttribute.type, 0);

              currentPage.getContent().fillAttributes(
                  [{value: contentTypeAttribute.value, type: contentTypeAttribute.type}]);
              fieldArea.getContents().should('have.class', 'has-error');

              currentPage.getContent().fillAttributes(
                  [{value: contentTypeAttribute.editedValue, type: contentTypeAttribute.type}],
                  {editMode: true});
              fieldArea.getContents().should('have.class', 'has-error');

              currentPage.getContent().fillAttributes(
                  [{value: Object.values(contentTypeAttribute.validationRules)[0], type: contentTypeAttribute.type}],
                  {editMode: true});
              fieldArea.getContents().should('not.have.class', 'has-error');
            });

          });
        }

      });

      // FIXME a bug on the appbuilder is preventing the test from cleaning the environment after test execution for link attribute
      if (!['Link'].includes(contentTypeAttribute.type)) {
        describe('Nest in a composite attribute', () => {

          before(() => {
            cy.kcLogin('login/admin').as('tokens');
            cy.contentTypeAttributesController(CONTENT_TYPE.code)
              .then(controller => controller.addAttribute({
                ...DEFAULT_COMPOSITE_ATTRIBUTE,
                compositeAttributes: [{
                  compositeAttributeType: DEFAULT_COMPOSITE_ATTRIBUTE.type,
                  type: contentTypeAttribute.type,
                  code: contentTypeAttribute.type,
                  ...attributeProperties
                }]
              }));
            cy.kcLogout();
          });

          after(() => deleteAttribute(DEFAULT_COMPOSITE_ATTRIBUTE));

          it('Create', () => {
            currentPage = openAddPage(currentPage);
            currentPage = attributeProcessor[contentTypeAttribute.processor].fillCompositeContent(currentPage, contentTypeAttribute);
            cy.get('@contentToBeDeleted').then(contentId => {
              attributeProcessor[contentTypeAttribute.processor].validateCompositeContent(contentId, contentTypeAttribute.value);
            });
          });

        });
      }

    });
  });

  const attributeProcessor = {
    init: function () {
      for (let i in this) {
        if (typeof this[i] == 'object') {
          this[i].init = this.init;
          this[i].init();
          this[i].parent = this;
        }
      }
      return this;
    },
    submitContentAndWrapContentId: function (page) {
      cy.contentsController().then(controller => controller.intercept({method: 'POST'}, 'interceptedPOST'));
      page = page.getContent().submitApproveForm();
      cy.wait('@interceptedPOST').then(interception => cy.wrap(interception.response.body.payload[0].id).as('contentToBeDeleted'));
      return page;
    },
    simple: {
      postContent: function (contentAttribute) {
        cy.contentsController()
          .then(controller =>
              controller.addContent({
                          ...DEFAULT_CONTENT,
                          attributes: [{code: contentAttribute.type, value: contentAttribute.value}]
                        })
                        .then(response => {
                          controller.updateStatus(response.body.payload[0].id, 'published');
                          cy.wrap(response.body.payload[0].id).as('contentToBeDeleted');
                        }));
      },
      fillContent: function (page, contentAttribute) {
        page.getContent()
            .fillBeginContent('cypress basic attribute')
            .fillAttributes([{value: contentAttribute.value, type: contentAttribute.type}]);
        return this.parent.submitContentAndWrapContentId(page);
      },
      fillCompositeContent: function (page, contentAttribute) {
        page.getContent()
            .fillBeginContent('cypress demo desc')
            .fillAttributes([{
              type: DEFAULT_COMPOSITE_ATTRIBUTE.type,
              value: [{type: contentAttribute.type, value: contentAttribute.value}]
            }]);
        return this.parent.submitContentAndWrapContentId(page);
      },
      editContent: function (page, contentAttribute) {
        page.getContent().fillAttributes([{
          value: contentAttribute.editedValue,
          type: contentAttribute.type
        }], {editMode: true});
        return page.getContent().submitApproveForm();
      },
      validateContent: function (contentId, expectedAttribute) {
        getContentAttribute(contentId)
            .then(actualAttribute => actualAttribute.value)
            .should('equal', expectedAttribute);
      },
      validateCompositeContent: function (contentId, expectedAttribute) {
        getContentCompositeAttribute(contentId)
            .then(actualAttribute => actualAttribute.value)
            .should('equal', expectedAttribute);
      },
      validateMandatoriness: function (page, contentTypeAttribute) {
        page = page.getContent().submitApproveForm();
        cy.validateToast(page, contentTypeAttribute.type, false);
        return page;
      }
    },
    multilang: {
      postContent: function (contentAttribute) {
        cy.contentsController()
          .then(controller =>
              controller.addContent({
                          ...DEFAULT_CONTENT,
                          attributes: [{code: contentAttribute.type, values: contentAttribute.value}]
                        })
                        .then(response => {
                          controller.updateStatus(response.body.payload[0].id, 'published');
                          cy.wrap(response.body.payload[0].id).as('contentToBeDeleted');
                        }));
      },
      fillContent: function (page, contentAttribute) {
        page.getContent()
            .fillBeginContent('cypress basic attribute')
            .fillAttributes([{value: contentAttribute.value.en, type: contentAttribute.type}])
            .fillAttributes([{value: contentAttribute.value.it, type: contentAttribute.type}], {lang: 'it'});
        return this.parent.submitContentAndWrapContentId(page);
      },
      fillCompositeContent: function (page, contentAttribute) {
        page.getContent()
            .fillBeginContent('cypress demo desc')
            .fillAttributes([{
              type: DEFAULT_COMPOSITE_ATTRIBUTE.type,
              value: [{type: contentAttribute.type, value: contentAttribute.value.en}]
            }])
            .fillAttributes([{
              type: DEFAULT_COMPOSITE_ATTRIBUTE.type,
              value: [{type: contentAttribute.type, value: contentAttribute.value.it}]
            }], {lang: 'it'});
        return this.parent.submitContentAndWrapContentId(page);
      },
      editContent: function (page, contentAttribute) {
        page.getContent()
            .fillAttributes([{value: contentAttribute.editedValue.en, type: contentAttribute.type}], {editMode: true})
            .fillAttributes([{value: contentAttribute.editedValue.it, type: contentAttribute.type}], {
              lang: 'it',
              editMode: true
            });
        return page.getContent().submitApproveForm();
      },
      validateContent: function (contentId, expectedAttribute) {
        getContentAttribute(contentId)
            .then(actualAttribute => actualAttribute.values)
            .should('deep.equal', expectedAttribute);
      },
      validateCompositeContent: function (contentId, expectedAttribute) {
        getContentCompositeAttribute(contentId)
            .then(actualAttribute => actualAttribute.values)
            .should('deep.equal', expectedAttribute);
      },
      // eslint-disable-next-line no-unused-vars
      validateMandatoriness: function (page, contentTypeAttribute) {
        // FIXME appbuilder should display a toast as per simple processor
        page.getContent().getSaveApproveAction().invoke('hasClass', 'disabled').should('be.true');
      }
    },
    link: {
      postContent: function (contentAttribute) {
        cy.contentsController()
          .then(controller =>
              controller.addContent({
                          ...DEFAULT_CONTENT,
                          attributes: [{
                            code: contentAttribute.type,
                            value: contentAttribute.value.link,
                            values: contentAttribute.value.values
                          }]
                        })
                        .then(response => {
                          controller.updateStatus(response.body.payload[0].id, 'published');
                          cy.wrap(response.body.payload[0].id).as('contentToBeDeleted');
                        }));
      },
      fillContent: function (page, contentAttribute) {
        page.getContent()
            .fillBeginContent('cypress basic attribute')
            .fillAttributes([{
              value: {link: contentAttribute.value.link, value: contentAttribute.value.values.en},
              type: contentAttribute.type
            }])
            .fillAttributes([{
              value: {link: contentAttribute.value.link, value: contentAttribute.value.values.it},
              type: contentAttribute.type
            }], {lang: 'it'});
        return this.parent.submitContentAndWrapContentId(page);
      },
      fillCompositeContent: function (page, contentAttribute) {
        page.getContent()
            .fillBeginContent('cypress demo desc')
            .fillAttributes([{
              type: DEFAULT_COMPOSITE_ATTRIBUTE.type,
              value: [{
                type: contentAttribute.type,
                value: {link: contentAttribute.link, value: contentAttribute.values.en}
              }]
            }])
            .fillAttributes([{
              type: DEFAULT_COMPOSITE_ATTRIBUTE.type,
              value: [{
                type: contentAttribute.type,
                value: {link: contentAttribute.link, value: contentAttribute.values.it}
              }]
            }], {lang: 'it'});
        return this.parent.submitContentAndWrapContentId(page);
      },
      editContent: function (page, contentAttribute) {
        page.getContent()
            .fillAttributes([{
              value: {value: contentAttribute.editedValue.values.en},
              type: contentAttribute.type
            }], {editMode: true})
            .fillAttributes([{
              value: {value: contentAttribute.editedValue.values.it},
              type: contentAttribute.type
            }], {lang: 'it', editMode: true});
        return currentPage.getContent().submitApproveForm();
      },
      validateContent: function (contentId, expectedAttribute) {
        getContentAttribute(contentId)
            .then(actualAttribute => this.formatResponseAttribute(actualAttribute))
            .should('deep.equal', expectedAttribute);
      },
      validateCompositeContent: function (contentId, expectedAttribute) {
        getContentCompositeAttribute(contentId)
            .then(actualAttribute => this.formatResponseAttribute(actualAttribute))
            .should('deep.equal', expectedAttribute);
      },
      validateMandatoriness: function (page, contentTypeAttribute) {
        return this.parent.multilang.validateMandatoriness(page, contentTypeAttribute);
      },
      formatResponseAttribute: function (attribute) {
        const {value: linkValue, values}                        = attribute;
        // eslint-disable-next-line no-unused-vars
        const {symbolicDestination, resourceDest, ...linkProps} = linkValue;
        const link                                              = Object.keys(linkProps)
                                                                        .filter(linkprop => linkValue[linkprop] !== null)
                                                                        .reduce((acc, curr) => ({
                                                                          ...acc,
                                                                          [curr]: linkProps[curr]
                                                                        }), {});
        return {link, values};
      }
    },
    attach: {
      postContent: function (contentAttribute) {
        cy.assetsController().then(controller =>
            controller.addAsset(
                {path: 'upload/lorem.doc', name: 'blank.pdf', type: 'application/doc'},
                {group: 'free', categories: [], type: 'file'}))
          .then(addAssetResponse => {
            cy.wrap(addAssetResponse.payload.id).as('assetToBeDeleted');
            cy.contentsController().then(controller =>
              controller.addContent({
                          ...DEFAULT_CONTENT,
                          attributes: [{
                            code: contentAttribute.type,
                            values: {
                              en: {
                                id: addAssetResponse.payload.id,
                                name: 'blank.pdf',
                                metadata: {...contentAttribute.value.en.metadata}
                              },
                              it: {
                                id: addAssetResponse.payload.id,
                                name: 'blank.pdf',
                                metadata: {...contentAttribute.value.it.metadata}
                              }
                            }
                          }]
                        })
                        .then(addContentResponse => {
                          controller.updateStatus(addContentResponse.body.payload[0].id, 'published');
                          cy.wrap(addContentResponse.body.payload[0].id).as('contentToBeDeleted');
                        }))});
      },
      fillContent: function (page, contentAttribute) {
        page = this.parent.multilang.fillContent(page, contentAttribute);
        cy.get('@interceptedPOST').then(interception => cy.wrap(interception.response.body.payload[0].attributes[0].values.en.id).as('assetToBeDeleted'));
        return page;
      },
      fillCompositeContent: function (page, contentAttribute) {
        page = this.parent.multilang.fillCompositeContent(page, contentAttribute);
        cy.get('@interceptedPOST').then(interception => cy.wrap(interception.response.body.payload[0].attributes[0].compositeelements[0].values.en.id).as('assetToBeDeleted'));
        return page;
      },
      editContent: function (page, contentAttribute) {
        return this.parent.multilang.editContent(page, contentAttribute);
      },
      validateContent: function (contentId, expectedAttribute) {
        getContentAttribute(contentId)
            .then(actualAttribute => this.formatResponseAttribute(actualAttribute))
            .should('deep.equal', {en: expectedAttribute.en.metadata.name, it: expectedAttribute.it.metadata.name});
      },
      validateCompositeContent: function (contentId, expectedAttribute) {
        getContentCompositeAttribute(contentId)
            .then(actualAttribute => this.formatResponseAttribute(actualAttribute))
            .should('deep.equal', {en: expectedAttribute.en.metadata.name, it: expectedAttribute.it.metadata.name});
      },
      validateMandatoriness: function (page, contentTypeAttribute) {
        return this.parent.simple.validateMandatoriness(page, contentTypeAttribute);
      },
      formatResponseAttribute: function (attribute) {
        return {
          en: attribute.values.en.name,
          it: attribute.values.it.name
        };
      }
    },
    image: {
      postContent: function (contentAttribute) {
        cy.contentsController()
          .then(controller =>
              controller.addContent({
                          ...DEFAULT_CONTENT,
                          attributes: [{
                            code: contentAttribute.type,
                            values: {
                              en: {
                                id: 'entandoAtPlan',
                                name: 'entando_at_plan.jpg',
                                metadata: {
                                  ...contentAttribute.value.en.metadata
                                }
                              },
                              it: {
                                id: 'entandoAtPlan',
                                name: 'entando_at_plan.jpg',
                                metadata: {
                                  ...contentAttribute.value.it.metadata
                                }
                              }
                            }
                          }]
                        })
                        .then(response => {
                          controller.updateStatus(response.body.payload[0].id, 'published');
                          cy.wrap(response.body.payload[0].id).as('contentToBeDeleted');
                        }));
      },
      fillContent: function (page, contentAttribute) {
        return this.parent.multilang.fillContent(page, contentAttribute);
      },
      fillGroupContent: function (page, contentAttribute, group) {
        page.getContent()
            .fillBeginContent('cypress basic attribute', group)
            .fillAttributes([{value: contentAttribute.value.en, type: contentAttribute.type}])
            .fillAttributes([{value: contentAttribute.value.it, type: contentAttribute.type}], {lang: 'it'});
        return this.parent.submitContentAndWrapContentId(page);
      },
      fillCompositeContent: function (page, contentAttribute) {
        return this.parent.multilang.fillCompositeContent(page, contentAttribute);
      },
      editContent: function (page, contentAttribute) {
        return this.parent.multilang.editContent(page, contentAttribute);
      },
      validateContent: function (contentId, expectedAttribute) {
        getContentAttribute(contentId)
            .then(actualAttribute => this.formatResponseAttribute(actualAttribute))
            .should('deep.equal', expectedAttribute);
      },
      validateCompositeContent: function (contentId, expectedAttribute) {
        getContentCompositeAttribute(contentId)
            .then(actualAttribute => this.formatResponseAttribute(actualAttribute))
            .should('deep.equal', expectedAttribute);
      },
      validateMandatoriness: function (page, contentTypeAttribute) {
        return this.parent.multilang.validateMandatoriness(page, contentTypeAttribute);
      },
      formatResponseAttribute: function (attribute) {
        const {values: {en, it}} = attribute;
        return {
          en: {
            upload: en.name,
            metadata: {
              legend: en.metadata.legend,
              alt: en.metadata.alt,
              description: en.metadata.description
            }
          },
          it: {
            upload: it.name,
            metadata: {
              legend: it.metadata.legend,
              alt: it.metadata.alt,
              description: it.metadata.description
            }
          }
        };
      }
    }
  }.init();

  const CONTENT_TYPE                = {code: 'CYP', name: 'Cypress Demo'};
  const DEFAULT_CONTENT             = {
    description: 'basic content attribute test',
    mainGroup: 'free',
    typeCode: CONTENT_TYPE.code,
    attributes: []
  };
  const DEFAULT_COMPOSITE_ATTRIBUTE = {
    type: 'Composite',
    compositeAttributeType: 'Composite',
    code: 'Composite',
    nestedAttribute: {code: 'Composite'},
    compositeAttributes: []
  };

  const openContentManagement = (page) => {
    page = page.getMenu().getContent().open();
    return page.openManagement();
  };
  const openAddPage           = (page) => {
    page = openContentManagement(page);
    return page.getContent().openAddContentPage(CONTENT_TYPE.name);
  };
  const openEditPage          = (page) => {
    page = openContentManagement(page);
    return page.getContent().openEditContentPage();
  };

  const getContent                   = (contentId) => {
    return cy.contentsController()
             .then(controller => controller.getContent(contentId))
             .then(response => response.body.payload);
  };
  const getContentAttribute          = (contentId) => {
    return getContent(contentId)
        .then(contentPayload => {
          const {attributes: [attribute]} = contentPayload;
          return attribute;
        });
  };
  const getContentCompositeAttribute = (contentId) => {
    return getContent(contentId)
        .then(contentPayload => {
          const {compositeelements: [attribute]} = contentPayload.attributes[0];
          return attribute;
        });
  };

  const deleteAttribute = (contentTypeAttribute) => {
    cy.kcLogin('login/admin').as('tokens');
    cy.contentTypeAttributesController(CONTENT_TYPE.code)
      .then(controller => controller.deleteAttribute(contentTypeAttribute.type));
    cy.kcLogout();
  };

});
