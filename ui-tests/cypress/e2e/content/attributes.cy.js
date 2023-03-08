import contentTypeAttributes from '../../fixtures/data/contentTypeAttributes.json';

describe('Content Type Attributes', () => {

  before(() => {
    cy.kcClientCredentialsLogin();
    cy.contentTypesController()
      .then(controller => controller.addContentType(CONTENT_TYPE.code, CONTENT_TYPE.name));
  });

  beforeEach(() => {
    cy.wrap(null).as('contentToBeDeleted');
    cy.wrap(null).as('assetToBeDeleted');
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
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
    //FIXME/TODO needed as autosave might create unwanted contents
    cy.contentsController()
      .then(controller => controller.getContentList()).then(response =>
        response.body.payload.filter(content => content.typeCode === CONTENT_TYPE.code).forEach(content =>
            cy.contentsController().then(controller => controller.updateStatus(content.id, 'draft').then(() =>
                controller.deleteContent(content.id)))));
    cy.kcTokenLogout();
  });

  after(() => {
    cy.kcClientCredentialsLogin();
    cy.contentTypesController()
      .then(controller => controller.deleteContentType(CONTENT_TYPE.code));
  });

  contentTypeAttributes.forEach(contentTypeAttribute => {
    describe(`${contentTypeAttribute.type} attribute`, () => {

      const attributeProperties = contentTypeAttribute.properties || {};

      describe('Base attribute options', () => {

        before(() => {
          cy.kcClientCredentialsLogin();
          cy.contentTypeAttributesController(CONTENT_TYPE.code)
            .then(controller => controller.addAttribute({
              type: contentTypeAttribute.type,
              code: contentTypeAttribute.type,
              ...attributeProperties
            }));
        });

        after(() => deleteAttribute(contentTypeAttribute));

        it([Tag.GTS, 'ENG-2519', 'ENG-3862'], 'Create', () => {
          openAddPage()
              .then(() => {
                attributeProcessor[contentTypeAttribute.processor].fillContent(contentTypeAttribute);
                cy.get('@contentToBeDeleted').then(contentId => {
                  attributeProcessor[contentTypeAttribute.processor].validateContent(contentId, contentTypeAttribute.value);
                });
              });
        });

        if (['Email'].includes(contentTypeAttribute.type)) {
          it([Tag.GTS, 'ENG-2519'], 'Email format validation', () => {
            const testInvalidEmail = (email) => {
              cy.get('@currentPage')
                .then(page => {
                  page.getContent().fillAttributes([{value: email, type: 'Email'}], {editMode: true});
                  page.getContent().getSaveAction().click();
                  page.getContent().getAlertMessage().should('exist').and('contain.text', 'Email');
                  return cy.wrap(page).as('currentPage');
                });
            };

            openAddPage()
                .then(page => {
                  page.getContent().fillBeginContent('cypress basic attribute');
                  testInvalidEmail('cypress@entando');
                  testInvalidEmail('cypress@.com');
                  testInvalidEmail('@entando.com');
                  testInvalidEmail('cypressentando.com');
                  page.getContent().fillAttributes(
                      [{value: contentTypeAttribute.value, type: 'Email'}],
                      {editMode: true}
                  );
                  page.getContent().submitForm();
                })
                .then(page => page.getContent().getTableRow('cypress basic attribute').should('exist'));
          });
        }

        if (['Hypertext'].includes(contentTypeAttribute.type)) {
          describe('FCKEditor', () => {

            before(() => {
              cy.kcClientCredentialsLogin();
              cy.contentSettingsController().then(controller => controller.putContentEditor('fckeditor'));
            });

            after(() => {
              cy.kcClientCredentialsLogin();
              cy.contentSettingsController().then(controller => controller.putContentEditor());
            });

            //FIXME/TODO the fckeditor opens a new window to add links, and cypress can not handle it
            xit([Tag.GTS, 'ENG-2519'], 'Add multiple links to hypertext', () => {
              openAddPage()
                  .then(page => {
                    page.getContent().fillBeginContent('cypress basic attribute');
                    page.getContent().fillAttributes([{
                      type: contentTypeAttribute.type,
                      value: 'hello{selectall}'
                    }], null, true);
                    const editor = page.getContent().getAttributeByTypeIndex(contentTypeAttribute.type, 0);
                    editor.setLinkInfo({destType: 3, contentDest: 'NWS4', target: '_blank'});
                    editor.getInput().type('{movetoend} there, world!');
                    cy.realPress('ArrowLeft');
                    cy.realPress(['Shift', 'ArrowLeft']);
                    cy.realPress(['Shift', 'ArrowLeft']);
                    cy.realPress(['Shift', 'ArrowLeft']);
                    cy.realPress(['Shift', 'ArrowLeft']);
                    cy.realPress(['Shift', 'ArrowLeft']);
                    editor.setLinkInfo({destType: 3, contentDest: 'TCL6', target: '_blank'});
                    page.getContent().copyToAllLanguages();
                    attributeProcessor.submitContentAndWrapContentId();
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

          });
        }

        if (['Image'].includes(contentTypeAttribute.type)) {
          describe('Asset group', () => {

            const TEST_GROUP = 'testgroup';

            before(() => {
              cy.kcClientCredentialsLogin();
              cy.groupsController()
                .then(controller => controller.addGroup(TEST_GROUP, TEST_GROUP))
                .then(() => cy.assetsController().then(controller =>
                    controller.addAsset(
                                  {path: 'upload/entando_400x400.png', name: 'entando_400x400.png', type: 'image/png'},
                                  {group: TEST_GROUP, categories: [], type: 'image'})
                              .then(response => Cypress.env('imageToBeDeleted', response.payload.id))));
            });

            after(() => {
              cy.kcClientCredentialsLogin();
              cy.wrap(Cypress.env('imageToBeDeleted')).then(imageId => {
                if (imageId) { cy.assetsController().then(controller => controller.deleteAsset(imageId)); }
              });
              cy.groupsController().then(controller => controller.deleteGroup(TEST_GROUP));
            });

            it([Tag.GTS, 'ENG-2519', 'ENG-3862'], 'Check that image group is compatible with current content', () => {
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
              cy.wrap(Cypress.env('imageToBeDeleted')).then(imageId => {
                openAddPage()
                    .then(() => {
                      attributeProcessor[contentTypeAttribute.processor].fillGroupContent(addedImage, TEST_GROUP, imageId);
                      cy.get('@contentToBeDeleted').then(contentId => {
                        attributeProcessor[contentTypeAttribute.processor].validateContent(contentId, addedImage.value);
                      });
                    });
              });

            });

          });
        }

        describe('Existing content', () => {

          beforeEach(() => attributeProcessor[contentTypeAttribute.processor].postContent(contentTypeAttribute));

          it([Tag.GTS, 'ENG-2519', 'ENG-3862'], 'Edit', () => {
            cy.get('@contentToBeDeleted').then(contentId => {
              openEditPage(contentId)
                  .then(() => {
                    attributeProcessor[contentTypeAttribute.processor].editContent(contentTypeAttribute);
                    attributeProcessor[contentTypeAttribute.processor].validateContent(contentId, contentTypeAttribute.editedValue);
                  });
            });
          });

        });

      });

      describe('Field validation options', () => {

        //TODO Date and Timestamp have the mandatoriness validation and should be handled here, not excluded
        if (!['Boolean', 'CheckBox', 'ThreeState', 'Date', 'Timestamp'].includes(contentTypeAttribute.type)) {
          describe('Mandatoriness validation', () => {

            before(() => {
              cy.kcClientCredentialsLogin();
              cy.contentTypeAttributesController(CONTENT_TYPE.code)
                .then(controller => controller.addAttribute({
                  type: contentTypeAttribute.type,
                  code: contentTypeAttribute.type,
                  mandatory: true,
                  ...attributeProperties
                }));
            });

            after(() => deleteAttribute(contentTypeAttribute));

            it([Tag.GTS, 'ENG-2519'], 'Create', () => {
              openAddPage()
                  .then(page => {
                    page.getContent().fillBeginContent('cypress basic attribute');
                    attributeProcessor[contentTypeAttribute.processor].validateMandatoriness(contentTypeAttribute);
                  });
            });

          });
        }

        if (['Monotext', 'Text', 'Longtext'].includes(contentTypeAttribute.type)) {
          describe('Custom regex validation', () => {

            before(() => {
              cy.kcClientCredentialsLogin();
              cy.contentTypeAttributesController(CONTENT_TYPE.code)
                .then(controller => controller.addAttribute({
                  type: contentTypeAttribute.type,
                  code: contentTypeAttribute.type,
                  validationRules: {regex: '^[A-Za-z\\s]+$'},
                  ...attributeProperties
                }));
            });

            after(() => deleteAttribute(contentTypeAttribute));

            it([Tag.GTS, 'ENG-2519'], 'Create', () => {
              const value = ['Text', 'Longtext'].includes(contentTypeAttribute.type) ? contentTypeAttribute.value.en : contentTypeAttribute.value;

              openAddPage()
                  .then(page => {
                    page.getContent().fillBeginContent('cypress basic attribute');
                    page.getContent().fillAttributes([{
                      value: value + '0',
                      type: contentTypeAttribute.type
                    }]);
                    page.getContent().getSaveAction().click();
                    page.getContent().getAlertMessage().should('exist').and('contain.text', 'Invalid');
                    page.getContent().fillAttributes([{
                      value: value,
                      type: contentTypeAttribute.type
                    }], {editMode: true});
                    page.getContent().submitForm();
                  })
                  .then(page => page.getContent().getTableRow('cypress basic attribute').should('exist'));
            });

          });
        }

        if (['Number', 'Date'].includes(contentTypeAttribute.type)) {
          describe('Custom range validation', () => {

            before(() => {
              cy.kcClientCredentialsLogin();
              cy.contentTypeAttributesController(CONTENT_TYPE.code)
                .then(controller => controller.addAttribute({
                  type: contentTypeAttribute.type,
                  code: contentTypeAttribute.type,
                  validationRules: contentTypeAttribute.validationRules,
                  ...attributeProperties
                }));
            });

            after(() => deleteAttribute(contentTypeAttribute));

            it([Tag.GTS, 'ENG-2519'], 'Create', () => {
              openAddPage()
                  .then(page => {
                    page.getContent().fillBeginContent('cypress basic attribute');
                    page.getContent().fillAttributes(
                        [{value: contentTypeAttribute.value, type: contentTypeAttribute.type}]);
                    page.getContent().getSaveAction().click();
                    page.getContent().getAlertMessage().should('exist').and('contain.text', contentTypeAttribute.type);
                    page.getContent().fillAttributes(
                        [{value: contentTypeAttribute.editedValue, type: contentTypeAttribute.type}],
                        {editMode: true});
                    page.getContent().getSaveAction().click();
                    page.getContent().getAlertMessage().should('exist').and('contain.text', contentTypeAttribute.type);
                    page.getContent().fillAttributes(
                        [{
                          value: Object.values(contentTypeAttribute.validationRules)[0],
                          type: contentTypeAttribute.type
                        }],
                        {editMode: true});
                    page.getContent().submitForm();
                  })
                  .then(page => page.getContent().getTableRow('cypress basic attribute').should('exist'));
            });

          });
        }

      });

      describe('Nest in a composite attribute', () => {

        before(() => {
          cy.kcClientCredentialsLogin();
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
        });

        after(() => deleteAttribute(DEFAULT_COMPOSITE_ATTRIBUTE));

        it([Tag.GTS, 'ENG-2180', 'ENG-3861', 'ENG-3862'], 'Create', () => {
          openAddPage()
              .then(() => {
                attributeProcessor[contentTypeAttribute.processor].fillCompositeContent(contentTypeAttribute);
                cy.get('@contentToBeDeleted').then(contentId => {
                  attributeProcessor[contentTypeAttribute.processor].validateCompositeContent(contentId, contentTypeAttribute.value);
                });
              });
        });

      });

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
    submitContentAndWrapContentId: function () {
      return cy.get('@currentPage')
               .then(page => {
                 page.getContent().submitApproveForm();
                 checkAndSavePublishedContentId();
                 cy.wrap(page).as('currentPage');
               });
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
      fillContent: function (contentAttribute) {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().fillBeginContent('cypress basic attribute');
            page.getContent().fillAttributes([{value: contentAttribute.value, type: contentAttribute.type}]);
            return this.parent.submitContentAndWrapContentId();
          });
      },
      fillCompositeContent: function (contentAttribute) {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().fillBeginContent('cypress demo desc');
            page.getContent().fillAttributes([{
              type: DEFAULT_COMPOSITE_ATTRIBUTE.type,
              value: [{type: contentAttribute.type, value: contentAttribute.value}]
            }]);
            return this.parent.submitContentAndWrapContentId();
          });
      },
      editContent: function (contentAttribute) {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().fillAttributes([{
              value: contentAttribute.editedValue,
              type: contentAttribute.type
            }], {editMode: true});
            return page.getContent().submitApproveForm();
          });
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
      validateMandatoriness: function (contentTypeAttribute) {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().getSaveApproveAction().click();
            page.getContent().getAlertMessage().should('exist').and('contain.text', contentTypeAttribute.type);
            return cy.wrap(page).as('currentPage');
          });
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
      fillContent: function (contentAttribute) {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().fillBeginContent('cypress basic attribute');
            page.getContent().fillAttributes([{value: contentAttribute.value.en, type: contentAttribute.type}]);
            page.getContent().fillAttributes([{
              value: contentAttribute.value.it,
              type: contentAttribute.type
            }], {lang: 'it'});
            return this.parent.submitContentAndWrapContentId();
          });
      },
      fillCompositeContent: function (contentAttribute) {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().fillBeginContent('cypress demo desc');
            page.getContent().fillAttributes([{
              type: DEFAULT_COMPOSITE_ATTRIBUTE.type,
              value: [{type: contentAttribute.type, value: contentAttribute.value.en}]
            }]);
            page.getContent().fillAttributes([{
              type: DEFAULT_COMPOSITE_ATTRIBUTE.type,
              value: [{type: contentAttribute.type, value: contentAttribute.value.it}]
            }], {lang: 'it'});
            return this.parent.submitContentAndWrapContentId();
          });
      },
      editContent: function (contentAttribute) {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().fillAttributes([{
              value: contentAttribute.editedValue.en,
              type: contentAttribute.type
            }], {editMode: true});
            page.getContent().fillAttributes([{value: contentAttribute.editedValue.it, type: contentAttribute.type}], {
              lang: 'it',
              editMode: true
            });
            return page.getContent().submitApproveForm();
          });
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
      validateMandatoriness: function (contentTypeAttribute) {
        return this.parent.simple.validateMandatoriness(contentTypeAttribute);
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
                            value: contentAttribute.postValue.link,
                            values: contentAttribute.postValue.values
                          }]
                        })
                        .then(response => {
                          controller.updateStatus(response.body.payload[0].id, 'published');
                          cy.wrap(response.body.payload[0].id).as('contentToBeDeleted');
                        }));
      },
      fillContent: function (contentAttribute) {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().fillBeginContent('cypress basic attribute');
            page.getContent().fillAttributes([{
              value: {link: contentAttribute.value.link, value: contentAttribute.value.values.en},
              type: contentAttribute.type
            }]);
            page.getContent().fillAttributes([{
              value: {link: contentAttribute.value.link, value: contentAttribute.value.values.it},
              type: contentAttribute.type
            }], {lang: 'it'});
            return this.parent.submitContentAndWrapContentId();
          });
      },
      fillCompositeContent: function (contentAttribute) {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().fillBeginContent('cypress demo desc');
            page.getContent().fillAttributes([{
              type: DEFAULT_COMPOSITE_ATTRIBUTE.type,
              value: [{
                type: contentAttribute.type,
                value: {link: contentAttribute.value.link, value: contentAttribute.value.values.en}
              }]
            }]);
            page.getContent().fillAttributes([{
              type: DEFAULT_COMPOSITE_ATTRIBUTE.type,
              value: [{
                type: contentAttribute.type,
                value: {link: contentAttribute.value.link, value: contentAttribute.value.values.it}
              }]
            }], {lang: 'it'});
            return this.parent.submitContentAndWrapContentId();
          });
      },
      editContent: function (contentAttribute) {
        cy.get('@currentPage')
          .then(page => {
            page.getContent()
                .fillAttributes([{
                  value: {value: contentAttribute.editedValue.values.en},
                  type: contentAttribute.type
                }], {editMode: true});
            page.getContent()
                .fillAttributes([{
                  value: {value: contentAttribute.editedValue.values.it},
                  type: contentAttribute.type
                }], {lang: 'it', editMode: true});
            return page.getContent().submitApproveForm();
          });
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
      validateMandatoriness: function (contentTypeAttribute) {
        return this.parent.simple.validateMandatoriness(contentTypeAttribute);
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
                          }));
          });
      },
      fillContent: function (contentAttribute) {
        this.parent.multilang.fillContent(contentAttribute);
        cy.get('@contentToBeDeleted')
          .then(contentId => {
            getContent(contentId).then(payload => cy.wrap(payload.attributes[0].values.en.id).as('assetToBeDeleted'));
          });
        return cy.get('@currentPage');
      },
      fillCompositeContent: function (contentAttribute) {
        this.parent.multilang.fillCompositeContent(contentAttribute);
        cy.get('@contentToBeDeleted')
          .then(contentId => {
            getContent(contentId).then(payload => cy.wrap(payload.attributes[0].compositeelements[0].values.en.id).as('assetToBeDeleted'));
          });
        return cy.get('@currentPage');
      },
      editContent: function (contentAttribute) {
        return this.parent.multilang.editContent(contentAttribute);
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
      validateMandatoriness: function (contentTypeAttribute) {
        return this.parent.simple.validateMandatoriness(contentTypeAttribute);
      },
      formatResponseAttribute: function (attribute) {
        const formattedResponse = {en: null, it: null};
        formattedResponse.en    = (attribute.values.en ? attribute.values.en.name : null);
        formattedResponse.it    = (attribute.values.it ? attribute.values.it.name : null);
        return formattedResponse;
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
      fillContent: function (contentAttribute) {
        return this.parent.multilang.fillContent(contentAttribute);
      },
      fillGroupContent: function (contentAttribute, group, assetId) {
        cy.get('@currentPage')
          .then(page => {
            page.getContent().fillBeginContent('cypress basic attribute', group);
            page.getContent().fillAttributes([{
              value: contentAttribute.value.en,
              type: contentAttribute.type
            }], {}, assetId);
            page.getContent().fillAttributes([{
              value: contentAttribute.value.it,
              type: contentAttribute.type
            }], {lang: 'it'}, assetId);
            return this.parent.submitContentAndWrapContentId();
          });
      },
      fillCompositeContent: function (contentAttribute) {
        return this.parent.multilang.fillCompositeContent(contentAttribute);
      },
      editContent: function (contentAttribute) {
        return this.parent.multilang.editContent(contentAttribute);
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
      validateMandatoriness: function (contentTypeAttribute) {
        return this.parent.multilang.validateMandatoriness(contentTypeAttribute);
      },
      formatResponseAttribute: function (attribute) {
        const {values: {en, it}}    = attribute;
        const formattedResponse     = {
          en: {upload: null, metadata: {legend: null, alt: null, description: null}},
          it: {upload: null, metadata: {legend: null, alt: null, description: null}}
        };
        formattedResponse.en.upload = (en ? en.name : null);
        formattedResponse.it.upload = (it ? it.name : null);
        if (en) {
          if (en.metadata) {
            formattedResponse.en.metadata.legend      = en.metadata.legend;
            formattedResponse.en.metadata.alt         = en.metadata.alt;
            formattedResponse.en.metadata.description = en.metadata.description;
          }
        }
        if (it) {
          if (it.metadata) {
            formattedResponse.it.metadata.legend      = it.metadata.legend;
            formattedResponse.it.metadata.alt         = it.metadata.alt;
            formattedResponse.it.metadata.description = it.metadata.description;
          }
        }
        return formattedResponse;
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

  const openContentManagement = () => cy.get('@currentPage').then(page => page.getMenu().getContent().open().openManagement());
  const openAddPage           = () => openContentManagement().then(page => page.getContent().openAddContentPage(CONTENT_TYPE));
  // FIXME/TODO the element seems to be covered by another element
  const openEditPage          = (code) => openContentManagement().then(page => page.getContent().getKebabMenu(code).open(true).openEdit(true));

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

  const checkAndSavePublishedContentId = () => {
    cy.contentsController()
      .then(controller => controller.getContentList())
      .then(response => cy.wrap(response.body.payload.filter(content => content.typeCode === CONTENT_TYPE.code)[0].id).as('contentToBeDeleted'));
  };

  const deleteAttribute = (contentTypeAttribute) => {
    cy.kcClientCredentialsLogin();
    cy.contentTypeAttributesController(CONTENT_TYPE.code)
      .then(controller => controller.deleteAttribute(contentTypeAttribute.type));
  };

});
