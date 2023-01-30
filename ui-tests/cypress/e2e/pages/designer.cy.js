import {generateRandomId, generateRandomNumericId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import sampleContentTemplate from '../../fixtures/data/sampleContentTemplate.json';

describe('Pages Designer', () => {

  before(() => {
    cy.kcClientCredentialsLogin();
    cy.fixture('data/demoPage.json').then(page => {
      page.code      = generateRandomId();
      page.pageModel = '1-2-column';
      cy.seoPagesController().then(controller => controller.addNewPage(page));
      cy.wrap(page).as('pageToBeDeleted');
      cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));
    });
  });

  beforeEach(() => {
    cy.wrap(null).as('widgetToBeRemovedFromPage');
    cy.wrap(null).as('widgetToBeDeleted');
    cy.wrap(null).as('widgetToBeReverted');
    cy.wrap(null).as('templateToBeDeleted');
    cy.wrap([]).as('contentsToBeDeleted');
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(function () {
    cy.wrap(this.pageToBeDeleted).then(page => {
      cy.get('@widgetToBeRemovedFromPage').then(widget => {
        if (widget) cy.pageWidgetsController(page.code).then(controller => controller.deleteWidget(widget));
      });
      cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));
    });
    cy.get('@widgetToBeDeleted').then(widgetToBeDeleted => {
      if (widgetToBeDeleted) cy.widgetsController().then(controller => controller.deleteWidget(widgetToBeDeleted));
    });
    cy.get('@widgetToBeReverted').then(widgetToBeReverted => {
      if (widgetToBeReverted)
        cy.widgetsController(widgetToBeReverted.code).then(controller =>
            controller.getWidget().then(response =>
                controller.putWidget({...response.body.payload, ...widgetToBeReverted})));
    });
    cy.get('@contentsToBeDeleted').then(contentIDs => contentIDs
        .forEach(contentID => cy.contentsController().then(controller => controller.updateStatus(contentID, 'draft').then(() => controller.deleteContent(contentID)))));
    cy.get('@templateToBeDeleted').then(template => {
      if (template) cy.contentTemplatesController().then(controller => controller.deleteContentTemplate(template));
    });
    cy.kcTokenLogout();
  });

  after(function () {
    cy.kcClientCredentialsLogin();
    cy.wrap(this.pageToBeDeleted).then(page =>
        cy.pagesController()
          .then(controller => controller.setPageStatus(page.code, 'draft')
                                        .then(() => controller.deletePage(page.code))));
  });

  describe('Change page status', () => {

    beforeEach(function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'draft')));
    });

    it([Tag.GTS, 'ENG-2244'], 'Publish a page', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage =>
          cy.get('@currentPage')
            .then(page => page.getMenu().getPages().open().openDesigner())
            .then(page => page.getContent().clickSidebarTab(1))
            .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
            .then(page => page.getContent().publishPageDesign(demoPage.code))
            .then(page => page.getContent().getPageStatusIcon()
                              .should('have.class', 'PageStatusIcon--published')
                              .and('have.attr', 'title').should('eq', 'Published')));
    });

  });

  describe('Widgets Out of the box', () => {

    describe('CMS Content Widget', () => {

      const widgetType = 'content_viewer';

      it([Tag.GTS, Tag.SMOKE, 'ENG-2496', 'ENG-4448'], 'Basic add with widget settings', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openDesigner())
              .then(page => page.getContent().clickSidebarTab(1))
              .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
              .then(page => page.getContent().clickSidebarTab(0))
              .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage, 0, 2, 1, 0, widgetType))
              .then(page => {
                cy.validateUrlPathname(`/widget/config/${widgetType}/page/${demoPage.code}/frame/4`);
                page.getContent().clickAddContentButton();
              })
              .then(page => page.getDialog().getBody().checkBoxFromTitle('Sample - About Us'))
              .then(page => page.getDialog().confirm())
              .then(page => page.getContent().confirmConfig(demoPage.code))
              .then(page => {
                cy.wrap(4).as('widgetToBeRemovedFromPage');
                cy.validateToast(page);
                page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                    .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                    .then(contents => {
                      cy.wrap(contents).children()
                        .should('have.length', 3)
                        .should(content => expect(content.eq(2)).to.have.text('Content'));
                    });
                cy.then(() => page);
              })
              .then(page => {
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--draft')
                    .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                page.getContent().publishPageDesign(demoPage.code);
              })
              .then(page => {
                cy.validateToast(page);
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--published')
                    .and('have.attr', 'title').should('eq', 'Published');
              }));
      });

      describe('Existing widget', () => {

        beforeEach(function () {
          cy.wrap({
            ownerGroup: 'administrators',
            joinGroups: [],
            contentId: 'TCL6',
            contentDescription: 'Sample - About Us',
            modelId: 'default'
          }).then(widgetConfig =>
              cy.wrap(this.pageToBeDeleted).then(demoPage => {
                cy.pageWidgetsController(demoPage.code)
                  .then(controller => controller.addWidget(4, widgetType, widgetConfig))
                  .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
                cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
              }));
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2496', 'ENG-4082'], 'Basic edit with widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
                .then(page => {
                  cy.validateUrlPathname(`/widget/edit/${widgetType}`);
                  page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
                  page.getContent().editFormFields({group: 'Administrator'});
                  page.getContent().submitForm();
                })
                .then(() => {
                  cy.wrap({code: widgetType, group: 'free'}).as('widgetToBeReverted');
                  cy.validateUrlPathname('/widget');
                  cy.widgetsController(widgetType).then(controller =>
                    controller.getWidget().then(response => expect(response.body.payload.group).to.eq('administrators')));
                }));
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2496', 'ENG-4277'], 'Editing widget in Settings (widget config)', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openSettings(widgetType))
                .then(page => page.getContent().clickChangeContentButton())
                .then(page => {
                  page.getDialog().getBody().getCheckboxFromTitle('Sample Banner').check({force: true});
                  page.getDialog().confirm();
                })
                .then(page => page.getContent().confirmConfig(demoPage.code))
                .then(page => {
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--draft')
                      .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                  page.getContent().publishPageDesign(demoPage.code);
                })
                .then(page => {
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--published')
                      .and('have.attr', 'title').should('eq', 'Published');
                }));
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2496'], 'Open Widget Details from the widget dropped', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage => {
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openDesigner())
              .then(page => page.getContent().clickSidebarTab(1))
              .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
              .then(page => page.getContent().clickSidebarTab(0))
              .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openDetails());
            cy.validateUrlPathname(`/widget/detail/${widgetType}`);
          });
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2496', 'ENG-4277'], 'Save As Widget', function () {
          cy.wrap(generateRandomId()).then(clonedWidgetCode =>
              cy.wrap(this.pageToBeDeleted).then(demoPage =>
                  cy.get('@currentPage')
                    .then(page => page.getMenu().getPages().open().openDesigner())
                    .then(page => page.getContent().clickSidebarTab(1))
                    .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                    .then(page => page.getContent().clickSidebarTab(0))
                    .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openSaveAs())
                    .then(page => {
                      cy.validateUrlPathname(`/page/${demoPage.code}/clone/4/widget/${widgetType}/viewerConfig`);
                      page.getContent().fillWidgetForm('Mio Widget', clonedWidgetCode, '', 'Free Access');
                      page.getContent().getConfigTabConfiguration().should('exist');
                      page.getContent().clickConfigTabConfiguration();
                    })
                    .then(page => {
                      page.getContent().getFormBody().contains('Change content').should('exist');
                      page.getContent().submitCloneWidget();
                    })
                    .then(page => {
                      cy.wrap(clonedWidgetCode).as('widgetToBeDeleted');
                      cy.validateUrlPathname(`/page/configuration/${demoPage.code}`);
                      page.getContent().getPageStatusIcon()
                          .should('have.class', 'PageStatusIcon--draft')
                          .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                      page.getContent().publishPageDesign(demoPage.code);
                    })
                    .then(page => {
                      page.getContent().getPageStatusIcon()
                          .should('have.class', 'PageStatusIcon--published')
                          .and('have.attr', 'title').should('eq', 'Published');
                    })));
        });

      });

      describe('Extended', () => {

        it([Tag.GTS, 'ENG-2497'], 'select a content and a content template that is unrelated or inconsistent with the content type, then implement in Content widget. Publish the page and view published page', function () {
          cy.wrap(sampleContentTemplate).then(contentTemplate => {
            contentTemplate.id    = generateRandomNumericId();
            contentTemplate.descr = generateRandomId();
          }).then(contentTemplate => {
            cy.contentTemplatesController().then(controller => controller.addContentTemplate(contentTemplate))
              .then(() => cy.wrap(contentTemplate.id).as('templateToBeDeleted'));

            cy.wrap(this.pageToBeDeleted).then(demoPage => {
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage, 0, 2, 1, 0, widgetType))
                .then(page => {
                  cy.validateUrlPathname(`/widget/config/${widgetType}/page/${demoPage.code}/frame/4`);
                  page.getContent().clickAddContentButton();
                })
                .then(page => page.getDialog().getBody().checkBoxFromTitle('Sample Banner'))
                .then(page => page.getDialog().confirm())
                .then(page => page.getContent().getModelIdSelect().then(select => page.getContent().select(select, contentTemplate.descr)))
                .then(page => page.getContent().confirmConfig(demoPage.code))
                .then(page => {
                  cy.wrap(4).as('widgetToBeRemovedFromPage');
                  cy.validateToast(page);
                  page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                      .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                      .then(contents => {
                        cy.wrap(contents).children()
                          .should('have.length', 3)
                          .should(content => expect(content.eq(2)).to.have.text('Content'));
                      });
                  cy.then(() => page);
                })
                .then(page => {
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--draft')
                      .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                  page.getContent().publishPageDesign(demoPage.code);
                })
                .then(page => {
                  cy.validateToast(page);
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--published')
                      .and('have.attr', 'title').should('eq', 'Published');
                });
              cy.visit(`/${demoPage.code}.page`, {portalUI: true});
              cy.get(`${htmlElements.div}.bar-content-edit-container`).should('contain', 'test');
            });
          });
        });

        it([Tag.GTS, 'ENG-2497', 'ENG-4448'], 'add a new no published content with a content type and content template, fill in all mandatory fields, save the content, then save the widget configuration', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage, 0, 2, 1, 0, widgetType))
                .then(page => page.getContent().clickNewContentWith('Banner'))
                .then(page => page.getContent().addContentFromContentWidgetConfig('Unpublish En Title', 'Unpublish It Title', 'Unpublish Sample Description', true))
                .then(page => {
                  page.getContent().getTableRow('Unpublish Sample Description').then(row => {
                    cy.get(row).should('exist').and('be.visible');
                    cy.get(row).children(htmlElements.td).eq(3).then(code => cy.unshiftAlias('@contentsToBeDeleted', code.text().trim()));
                  });
                  cy.then(() => page);
                })
                .then(page => page.getMenu().getPages().open().openDesigner(true))
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage, 0, 2, 1, 0, widgetType))
                .then(page => {
                  cy.validateUrlPathname(`/widget/config/${widgetType}/page/${demoPage.code}/frame/4`);
                  page.getContent().clickAddContentButton();
                })
                .then(page => page.getDialog().getBody().checkBoxFromTitle('Unpublish Sample Description'))
                .then(page => page.getDialog().confirm())
                .then(page => page.getContent().confirmConfig(demoPage.code))
                .then(page => {
                  cy.wrap(4).as('widgetToBeRemovedFromPage');
                  cy.validateToast(page);
                  page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                      .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                      .then(contents => {
                        cy.wrap(contents).children()
                          .should('have.length', 3)
                          .should(content => expect(content.eq(2)).to.have.text('Content'));
                      });
                  cy.then(() => page);
                })
                .then(page => {
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--draft')
                      .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                  page.getContent().publishPageDesign(demoPage.code);
                })
                .then(page => {
                  cy.validateToast(page);
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--published')
                      .and('have.attr', 'title').should('eq', 'Published');
                }));
        });

        it([Tag.GTS, 'ENG-2497'], 'add a new content with a content type and content template, fill in all mandatory fields, save and approve, then save the configuration', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage, 0, 2, 1, 0, widgetType))
                .then(page => page.getContent().clickNewContentWith('Banner'))
                .then(page => page.getContent().addContentFromContentWidgetConfig('En Title', 'It Title', 'Sample Description', true))
                .then(page => {
                  page.getContent().getTableRow('Sample Description').then(row => {
                    cy.get(row).should('exist').and('be.visible');
                    cy.get(row).children(htmlElements.td).eq(3).then(code => cy.unshiftAlias('@contentsToBeDeleted', code.text().trim()));
                  });
                  cy.then(() => page);
                })
                .then(page => page.getMenu().getPages().open().openDesigner(true))
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage, 0, 2, 1, 0, widgetType))
                .then(page => {
                  cy.validateUrlPathname(`/widget/config/${widgetType}/page/${demoPage.code}/frame/4`);
                  page.getContent().clickAddContentButton();
                })
                .then(page => page.getDialog().getBody().checkBoxFromTitle('Sample Description'))
                .then(page => page.getDialog().confirm())
                .then(page => page.getContent().getModelIdSelect().then(select => page.getContent().select(select, 'Banner - Text, Image, CTA')))
                .then(page => page.getContent().confirmConfig(demoPage.code))
                .then(page => {
                  cy.wrap(4).as('widgetToBeRemovedFromPage');
                  cy.validateToast(page);
                  page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                      .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                      .then(contents => {
                        cy.wrap(contents).children()
                          .should('have.length', 3)
                          .should(content => expect(content.eq(2)).to.have.text('Content'));
                      });
                  cy.then(() => page);
                })
                .then(page => {
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--draft')
                      .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                  page.getContent().publishPageDesign(demoPage.code);
                })
                .then(page => {
                  cy.validateToast(page);
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--published')
                      .and('have.attr', 'title').should('eq', 'Published');
                }));
        });

      });

    });

    describe('CMS Content List Widget', () => {

      const widgetType = 'row_content_viewer_list';

      it([Tag.GTS, Tag.SMOKE, 'ENG-2498', 'ENG-4448'], 'Basic add with widget settings', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openDesigner())
              .then(page => page.getContent().clickSidebarTab(1))
              .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
              .then(page => page.getContent().clickSidebarTab(0))
              .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage.code, 0, 4, 1, 0, widgetType))
              .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Sample - About Us'))
              .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Sample Banner'))
              .then(page => page.getContent().getModelIdDropdownByIndex(0).then(select => page.getContent().select(select, '2-column-content')))
              .then(page => page.getContent().getModelIdDropdownByIndex(1).then(select => page.getContent().select(select, 'Banner - Text, Image, CTA')))
              .then(page => page.getContent().confirmConfig(demoPage.code))
              .then(page => {
                cy.wrap(4).as('widgetToBeRemovedFromPage');
                cy.validateToast(page);
                page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                    .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                    .then(contents => {
                      cy.wrap(contents).children()
                        .should('have.length', 3)
                        .should(content => expect(content.eq(2)).to.have.text('Content List'));
                    });
                cy.then(() => page);
              })
              .then(page => {
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--draft')
                    .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                page.getContent().publishPageDesign(demoPage.code);
              })
              .then(page => {
                cy.validateToast(page);
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--published')
                    .and('have.attr', 'title').should('eq', 'Published');
              }));
      });

      describe('Existing widget', () => {

        beforeEach(function () {
          cy.wrap({
            ownerGroup: 'administrators',
            joinGroups: [],
            contents: [
              {contentId: 'TCL6', modelId: '10004', contentDescription: 'Sample - About Us'},
              {contentId: 'BNR2', modelId: '10003', contentDescription: 'Sample Banner'}
            ]
          }).then(widgetConfig =>
              cy.wrap(this.pageToBeDeleted).then(demoPage => {
                cy.pageWidgetsController(demoPage.code)
                  .then(controller => controller.addWidget(4, widgetType, widgetConfig))
                  .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
                cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
              }));
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2498', 'ENG-4082'], 'Basic edit with widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
                .then(page => {
                  cy.validateUrlPathname(`/widget/edit/${widgetType}`);
                  page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
                  page.getContent().editFormFields({group: 'Administrator'});
                  page.getContent().submitForm();
                })
                .then(() => {
                  cy.wrap({code: widgetType, group: 'free'}).as('widgetToBeReverted');
                  cy.validateUrlPathname('/widget');
                  cy.widgetsController(widgetType).then(controller =>
                    controller.getWidget().then(response => expect(response.body.payload.group).to.eq('administrators')));
                }));
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2498', 'ENG-4277', 'ENG-4448'], 'Editing widget in Settings (widget config)', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openSettings(widgetType))
                .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('A Modern Platform for Modern UX'))
                .then(page => page.getContent().getModelIdDropdownByIndex(2).then(select => page.getContent().select(select, 'Banner - Search Results')))
                .then(page => page.getContent().confirmConfig(demoPage.code))
                .then(page => {
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--draft')
                      .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                  page.getContent().publishPageDesign(demoPage.code);
                })
                .then(page => {
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--published')
                      .and('have.attr', 'title').should('eq', 'Published');
                }));
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2498'], 'Open Widget Details from the widget dropped', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openDetails())
                .then(() => cy.validateUrlPathname(`/widget/detail/${widgetType}`)));
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2498', 'ENG-4277'], 'Save As Widget', function () {
          cy.wrap(generateRandomId()).then(clonedWidgetCode =>
              cy.wrap(this.pageToBeDeleted).then(demoPage =>
                  cy.get('@currentPage')
                    .then(page => page.getMenu().getPages().open().openDesigner())
                    .then(page => page.getContent().clickSidebarTab(1))
                    .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                    .then(page => page.getContent().clickSidebarTab(0))
                    .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openSaveAs())
                    .then(page => {
                      cy.validateUrlPathname(`/page/${demoPage.code}/clone/4/widget/${widgetType}/rowListViewerConfig`);
                      page.getContent().fillWidgetForm('Mio Widget', clonedWidgetCode, '', 'Free Access');
                      page.getContent().getConfigTabConfiguration().should('exist');
                      page.getContent().clickConfigTabConfiguration();
                    })
                    .then(page => {
                      page.getContent().getFormBody().contains('Content List').should('exist');
                      page.getContent().submitCloneWidget();
                    })
                    .then(page => {
                      cy.wrap(clonedWidgetCode).as('widgetToBeDeleted');
                      cy.validateUrlPathname(`/page/configuration/${demoPage.code}`);
                      page.getContent().getPageStatusIcon()
                          .should('have.class', 'PageStatusIcon--draft')
                          .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                      page.getContent().publishPageDesign(demoPage.code);
                    })
                    .then(page => {
                      page.getContent().getPageStatusIcon()
                          .should('have.class', 'PageStatusIcon--published')
                          .and('have.attr', 'title').should('eq', 'Published');
                    })));
        });

      });

      describe('Extended', () => {

        it([Tag.GTS, 'ENG-2499', 'ENG-4448'], 'Add all existing published OOTB contents', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage.code, 0, 4, 1, 0, widgetType))
                .then(page => {
                  cy.validateUrlPathname(`/widget/config/${widgetType}/page/${demoPage.code}/frame/4`);
                  page.getContent().clickAddButtonFromTableRowWithTitle('Sample - About Us');
                })
                .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Why You Need a Micro Frontend Platform for Kubernetes'))
                .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Entando and JHipster: How It Works'))
                .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Sample Banner'))
                .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('A Modern Platform for Modern UX'))
                .then(page => page.getContent().getModelIdDropdownByIndex(0).then(select => page.getContent().select(select, '2-column-content')))
                .then(page => page.getContent().getModelIdDropdownByIndex(1).then(select => page.getContent().select(select, 'News - Detail')))
                .then(page => page.getContent().getModelIdDropdownByIndex(2).then(select => page.getContent().select(select, 'News - Detail')))
                .then(page => page.getContent().getModelIdDropdownByIndex(3).then(select => page.getContent().select(select, 'Banner - Text, Image, CTA')))
                .then(page => page.getContent().getModelIdDropdownByIndex(4).then(select => page.getContent().select(select, 'Banner - Text, Image, CTA')))
                .then(page => page.getContent().confirmConfig(demoPage.code))
                .then(page => {
                  cy.wrap(4).as('widgetToBeRemovedFromPage');
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--draft')
                      .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                  page.getContent().publishPageDesign(demoPage.code);
                })
                .then(page => {
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--published')
                      .and('have.attr', 'title').should('eq', 'Published');
                }));
        });

        it([Tag.GTS, 'ENG-2499', 'ENG-4448'], 'Add new existing published contents', function () {
          cy.wrap(generateRandomId()).then(firstContentDescription => {
            cy.wrap(generateRandomId()).then(secondContentDescription => {
              cy.fixture('data/testContent.json').then(testContent =>
                  cy.contentsController().then(controller => {
                    testContent.code        = generateRandomId();
                    testContent.description = firstContentDescription;
                    controller.addContent(testContent)
                              .then(response => cy.unshiftAlias('@contentsToBeDeleted', response.body.payload[0].id))
                              .then(content => controller.updateStatus(content, 'published'));
                    testContent.code        = generateRandomId();
                    testContent.description = secondContentDescription;
                    controller.addContent(testContent)
                              .then(response => cy.unshiftAlias('@contentsToBeDeleted', response.body.payload[0].id))
                              .then(content => controller.updateStatus(content, 'published'));
                  }));
              cy.wrap(this.pageToBeDeleted).then(demoPage => {
                cy.get('@currentPage')
                  .then(page => page.getMenu().getPages().open().openDesigner())
                  .then(page => page.getContent().clickSidebarTab(1))
                  .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                  .then(page => page.getContent().clickSidebarTab(0))
                  .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage.code, 0, 4, 1, 0, widgetType))
                  .then(page => {
                    cy.validateUrlPathname(`/widget/config/${widgetType}/page/${demoPage.code}/frame/4`);
                    page.getContent().clickAddButtonFromTableRowWithTitle(firstContentDescription);
                  })
                  .then(page => page.getContent().clickAddButtonFromTableRowWithTitle(secondContentDescription, true))
                  .then(page => page.getContent().getModelIdDropdownByIndex(0).then(select => page.getContent().select(select, 'Banner - Text, Image, CTA')))
                  .then(page => page.getContent().getModelIdDropdownByIndex(1).then(select => page.getContent().select(select, 'Banner - Text, Image, CTA')))
                  .then(page => page.getContent().confirmConfig(demoPage.code))
                  .then(page => {
                    cy.wrap(4).as('widgetToBeRemovedFromPage');
                    page.getContent().getPageStatusIcon()
                        .should('have.class', 'PageStatusIcon--draft')
                        .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                    page.getContent().publishPageDesign(demoPage.code);
                  })
                  .then(page => {
                    page.getContent().getPageStatusIcon()
                        .should('have.class', 'PageStatusIcon--published')
                        .and('have.attr', 'title').should('eq', 'Published');
                  });
              });
            });
          });
        });

      });

    });

    describe('CMS Content Search Query Widget', () => {

      const widgetType = 'content_viewer_list';

      it([Tag.GTS, Tag.SMOKE, 'ENG-2500'], 'Basic add with widget settings', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openDesigner())
              .then(page => page.getContent().clickSidebarTab(1))
              .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
              .then(page => page.getContent().clickSidebarTab(0))
              .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage.code, 0, 3, 1, 0, widgetType))
              .then(page => {
                cy.validateUrlPathname(`/widget/config/${widgetType}/page/${demoPage.code}/frame/4`);
                page.getContent().getContentTypeField().then(select => page.getContent().select(select, 'Banner'));
                page.getContent().getPublishSettingsAccordButton().click();
                page.getContent().getMaxTotalElemDropdown().then(select => page.getContent().select(select, '10'));
              })
              .then(page => page.getContent().confirmConfig(demoPage.code))
              .then(page => {
                cy.wrap(4).as('widgetToBeRemovedFromPage');
                cy.validateToast(page);
                page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                    .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                    .then(contents => {
                      cy.wrap(contents).children()
                        .should('have.length', 3)
                        .should(content => expect(content.eq(2)).to.have.text('Content Search Query'));
                    });
                cy.then(() => page);
              })
              .then(page => {
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--draft')
                    .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                page.getContent().publishPageDesign(demoPage.code);
              })
              .then(page => {
                cy.validateToast(page);
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--published')
                    .and('have.attr', 'title').should('eq', 'Published');
              }));
      });

      describe('Existing widget', () => {

        beforeEach(function () {
          cy.wrap({
            contentType: 'BNR',
            maxElemForItem: '10'
          }).then(widgetConfig =>
              cy.wrap(this.pageToBeDeleted).then(demoPage => {
                cy.pageWidgetsController(demoPage.code)
                  .then(controller => controller.addWidget(4, widgetType, widgetConfig))
                  .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
                cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
              }));
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2500', 'ENG-4082'], 'Basic edit with widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
                .then(page => {
                  cy.validateUrlPathname(`/widget/edit/${widgetType}`);
                  page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
                  page.getContent().editFormFields({group: 'Administrator'});
                  page.getContent().submitForm();
                })
                .then(() => {
                  cy.wrap({code: widgetType, group: 'free'}).as('widgetToBeReverted');
                  cy.validateUrlPathname('/widget');
                  cy.widgetsController(widgetType).then(controller =>
                    controller.getWidget().then(response => expect(response.body.payload.group).to.eq('administrators')));
                }));
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2500', 'ENG-4277'], 'Editing widget in Settings (widget config)', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openSettings(widgetType))
                .then(page => {
                  cy.validateUrlPathname(`/widget/config/${widgetType}/page/${demoPage.code}/frame/4`);
                  page.getContent().publishSettings();
                })
                .then(page => page.getContent().getMaxElemForItemDropdown().then(select => page.getContent().select(select, '6')))
                .then(page => page.getContent().getMaxTotalElemDropdown().then(select => page.getContent().select(select, '10')))
                .then(page => page.getContent().confirmConfig(demoPage.code))
                .then(page => {
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--draft')
                      .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                  page.getContent().publishPageDesign(demoPage.code);
                })
                .then(page => {
                  page.getContent().getPageStatusIcon()
                      .should('have.class', 'PageStatusIcon--published')
                      .and('have.attr', 'title').should('eq', 'Published');
                }));
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2500'], 'Open Widget Details from the widget dropped', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openDetails())
                .then(() => cy.validateUrlPathname(`/widget/detail/${widgetType}`)));
        });

        it([Tag.GTS, Tag.SMOKE, 'ENG-2500', 'ENG-4277'], 'Save As Widget', function () {
          cy.wrap(generateRandomId()).then(clonedWidgetCode =>
              cy.wrap(this.pageToBeDeleted).then(demoPage =>
                  cy.get('@currentPage')
                    .then(page => page.getMenu().getPages().open().openDesigner())
                    .then(page => page.getContent().clickSidebarTab(1))
                    .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                    .then(page => page.getContent().clickSidebarTab(0))
                    .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openSaveAs())
                    .then(page => {
                      cy.validateUrlPathname(`/page/${demoPage.code}/clone/4/widget/${widgetType}/listViewerConfig`);
                      page.getContent().fillWidgetForm('Mio Widget', clonedWidgetCode, '', 'Free Access');
                      page.getContent().getConfigTabConfiguration().should('exist');
                      page.getContent().clickConfigTabConfiguration();
                    })
                    .then(page => {
                      page.getContent().getFormBody().contains('Publishing settings').should('exist');
                      page.getContent().submitCloneWidget();
                    })
                    .then(page => {
                      cy.wrap(clonedWidgetCode).as('widgetToBeDeleted');
                      cy.validateUrlPathname(`/page/configuration/${demoPage.code}`);
                      page.getContent().getPageStatusIcon()
                          .should('have.class', 'PageStatusIcon--draft')
                          .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                      page.getContent().publishPageDesign(demoPage.code);
                    })
                    .then(page => {
                      page.getContent().getPageStatusIcon()
                          .should('have.class', 'PageStatusIcon--published')
                          .and('have.attr', 'title').should('eq', 'Published');
                    })));
        });

      });

    });

    describe('CMS Search Form Widget', () => {

      const widgetType = 'search_form';

      it([Tag.GTS, 'ENG-2501'], 'Basic add', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage => {
          cy.get('@currentPage')
            .then(page => page.getMenu().getPages().open().openDesigner())
            .then(page => page.getContent().clickSidebarTab(1))
            .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
            .then(page => page.getContent().clickSidebarTab(0))
            .then(page => page.getContent().addWidgetToGrid(demoPage, 0, 5, 1, 0))
            .then(page => {
              cy.wrap(4).as('widgetToBeRemovedFromPage');
              page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                  .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                  .then(contents => {
                    cy.wrap(contents).children()
                      .should('have.length', 3)
                      .should(content => expect(content.eq(2)).to.have.text('Search Form'));
                  });
              cy.then(() => page);
            })
            .then(page => {
              page.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
              page.getContent().publishPageDesign(demoPage.code);
            })
            .then(page => {
              page.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
            });
        });
      });

      describe('Existing widget', () => {

        beforeEach(function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage => {
            cy.pageWidgetsController(demoPage.code)
              .then(controller => controller.addWidget(4, widgetType))
              .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
            cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
          });
        });

        it([Tag.GTS, 'ENG-2501', 'ENG-4082', 'ENG-4280'], 'Basic edit with CMS Search Form widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
                .then(page => {
                  cy.validateUrlPathname(`/widget/edit/${widgetType}`);
                  page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
                  page.getContent().editFormFields({group: 'Administrator'});
                  page.getContent().submitForm();
                })
                .then(() => {
                  cy.wrap({code: widgetType, group: 'free'}).as('widgetToBeReverted');
                  cy.validateUrlPathname('/widget');
                  cy.widgetsController(widgetType).then(controller =>
                    controller.getWidget().then(response => expect(response.body.payload.group).to.eq('administrators')));
                }));
        });

        it([Tag.GTS, 'ENG-2501', 'ENG-4280'], 'Open Widget Details from the dropped CMS Search Form widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openDetails())
                .then(() => cy.validateUrlPathname(`/widget/detail/${widgetType}`)));
        });

      });

    });

    describe('CMS Search Results Widget', () => {

      const widgetType = 'search_result';

      it([Tag.GTS, 'ENG-2501'], 'Basic add', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage => {
          cy.get('@currentPage')
            .then(page => page.getMenu().getPages().open().openDesigner())
            .then(page => page.getContent().clickSidebarTab(1))
            .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
            .then(page => page.getContent().clickSidebarTab(0))
            .then(page => page.getContent().addWidgetToGrid(demoPage, 0, 6, 1, 0))
            .then(page => {
              cy.wrap(4).as('widgetToBeRemovedFromPage');
              page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                  .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                  .then(contents => {
                    cy.wrap(contents).children()
                      .should('have.length', 3)
                      .should(content => expect(content.eq(2)).to.have.text('Search Results'));
                  });
              cy.then(() => page);
            })
            .then(page => {
              page.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
              page.getContent().publishPageDesign(demoPage.code);
            })
            .then(page => {
              page.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
            });
        });
      });

      describe('Existing widget', () => {

        beforeEach(function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage => {
            cy.pageWidgetsController(demoPage.code)
              .then(controller => controller.addWidget(4, widgetType))
              .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
            cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
          });
        });

        it([Tag.GTS, 'ENG-2501', 'ENG-4082'], 'Basic edit with CMS Search Result widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
                .then(page => {
                  cy.validateUrlPathname(`/widget/edit/${widgetType}`);
                  page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
                  page.getContent().editFormFields({group: 'Administrator'});
                  page.getContent().submitForm();
                })
                .then(() => {
                  cy.wrap({code: widgetType, group: 'free'}).as('widgetToBeReverted');
                  cy.validateUrlPathname('/widget');
                  cy.widgetsController(widgetType).then(controller =>
                    controller.getWidget().then(response => expect(response.body.payload.group).to.eq('administrators')));
                }));
        });

        it([Tag.GTS, 'ENG-2501'], 'Open Widget Details from the dropped CMS Search Results widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openDetails())
                .then(() => cy.validateUrlPathname(`/widget/detail/${widgetType}`)));
        });

      });

    });

    describe('CMS News Archive Widget', () => {

      const widgetType = 'NWS_Archive';

      it([Tag.GTS, 'ENG-2503'], 'Basic add', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openDesigner())
              .then(page => page.getContent().clickSidebarTab(1))
              .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
              .then(page => page.getContent().clickSidebarTab(0))
              .then(page => page.getContent().addWidgetToGrid(demoPage, 0, 0, 1, 0))
              .then(page => {
                cy.wrap(4).as('widgetToBeRemovedFromPage');
                page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                    .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                    .then(contents => {
                      cy.wrap(contents).children()
                        .should('have.length', 3)
                        .should(content => expect(content.eq(2)).to.have.text('News Archive'));
                    });
                cy.then(() => page);
              })
              .then(page => {
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--draft')
                    .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                page.getContent().publishPageDesign(demoPage.code);
              })
              .then(page => {
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--published')
                    .and('have.attr', 'title').should('eq', 'Published');
              }));
      });

      describe('Existing widget', () => {

        beforeEach(function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage => {
            cy.pageWidgetsController(demoPage.code)
              .then(controller => controller.addWidget(4, widgetType))
              .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
            cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
          });
        });

        it([Tag.GTS, 'ENG-2503'], 'Basic edit with News Archive widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
                .then(page => {
                  cy.validateUrlPathname(`/widget/edit/${widgetType}`);
                  page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
                  page.getContent().editFormFields({group: 'Administrator'});
                  page.getContent().submitForm();
                })
                .then(() => {
                  cy.wrap({code: widgetType, group: 'free'}).as('widgetToBeReverted');
                  cy.validateUrlPathname('/widget');
                  cy.widgetsController(widgetType).then(controller =>
                    controller.getWidget().then(response => expect(response.body.payload.group).to.eq('administrators')));
                }));
        });

        it([Tag.GTS, 'ENG-2503'], 'Open Widget Details from the dropped CMS News Archive widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openDetails())
                .then(() => cy.validateUrlPathname(`/widget/detail/${widgetType}`)));
        });

      });

    });

    describe('CMS News Latest Widget', () => {

      const widgetType = 'NWS_Latest';

      it([Tag.GTS, 'ENG-2505'], 'Basic add', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openDesigner())
              .then(page => page.getContent().clickSidebarTab(1))
              .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
              .then(page => page.getContent().clickSidebarTab(0))
              .then(page => page.getContent().addWidgetToGrid(demoPage, 0, 1, 1, 0))
              .then(page => {
                cy.wrap(4).as('widgetToBeRemovedFromPage');
                page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                    .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                    .then(contents => {
                      cy.wrap(contents).children()
                        .should('have.length', 3)
                        .should(content => expect(content.eq(2)).to.have.text('News Latest'));
                    });
                cy.then(() => page);
              })
              .then(page => {
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--draft')
                    .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                page.getContent().publishPageDesign(demoPage.code);
              })
              .then(page => {
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--published')
                    .and('have.attr', 'title').should('eq', 'Published');
              }));
      });

      describe('Existing widget', () => {

        beforeEach(function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage => {
            cy.pageWidgetsController(demoPage.code)
              .then(controller => controller.addWidget(4, widgetType))
              .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
            cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
          });
        });

        it([Tag.GTS, 'ENG-2505', 'ENG-4082'], 'Basic edit with News Latest widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
                .then(page => {
                  cy.validateUrlPathname(`/widget/edit/${widgetType}`);
                  page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
                  page.getContent().editFormFields({group: 'Administrator'});
                  page.getContent().submitForm();
                })
                .then(() => {
                  cy.wrap({code: widgetType, group: 'free'}).as('widgetToBeReverted');
                  cy.validateUrlPathname('/widget');
                  cy.widgetsController(widgetType).then(controller =>
                    controller.getWidget().then(response => expect(response.body.payload.group).to.eq('administrators')));
                }));
        });

        it([Tag.GTS, 'ENG-2505'], 'Open Widget Details from the dropped CMS News Latest widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openDetails())
                .then(() => cy.validateUrlPathname(`/widget/detail/${widgetType}`)));
        });

      });

    });

    describe('Page Language Widget', () => {

      const widgetType = 'language';

      it([Tag.GTS, 'ENG-2509'], 'Basic add', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openDesigner())
              .then(page => page.getContent().clickSidebarTab(1))
              .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
              .then(page => page.getContent().clickSidebarTab(0))
              .then(page => page.getContent().toggleSidebarWidgetSection(2))
              .then(page => page.getContent().addWidgetToGrid(demoPage, 2, 0, 1, 0))
              .then(page => {
                cy.wrap(4).as('widgetToBeRemovedFromPage');
                page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                    .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                    .then(contents => {
                      cy.wrap(contents).children()
                        .should('have.length', 3)
                        .should(content => expect(content.eq(2)).to.have.text('Language'));
                    });
                cy.then(() => page);
              })
              .then(page => {
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--draft')
                    .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                page.getContent().publishPageDesign(demoPage.code);
              })
              .then(page => {
                cy.validateToast(page);
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--published')
                    .and('have.attr', 'title').should('eq', 'Published');
              }));
      });

      describe('Existing widget', () => {

        beforeEach(function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage => {
            cy.pageWidgetsController(demoPage.code)
              .then(controller => controller.addWidget(4, widgetType))
              .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
            cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
          });
        });

        it([Tag.GTS, 'ENG-2509', 'ENG-4082'], 'Basic edit with Language widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
                .then(page => {
                  cy.validateUrlPathname(`/widget/edit/${widgetType}`);
                  page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
                  page.getContent().editFormFields({group: 'Administrator'});
                  page.getContent().submitForm();
                })
                .then(() => {
                  cy.wrap({code: widgetType, group: 'free'}).as('widgetToBeReverted');
                  cy.validateUrlPathname('/widget');
                  cy.widgetsController(widgetType).then(controller =>
                    controller.getWidget().then(response => expect(response.body.payload.group).to.eq('administrators')));
                }));
        });

        it([Tag.GTS, 'ENG-2509'], 'Open Widget Details from the dropped Language widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openDetails())
                .then(() => cy.validateUrlPathname(`/widget/detail/${widgetType}`)));
        });

      });

    });

    describe('Page Logo Widget', () => {

      const widgetType = 'logo';

      it([Tag.GTS, 'ENG-2509'], 'Basic add', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openDesigner())
              .then(page => page.getContent().clickSidebarTab(1))
              .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
              .then(page => page.getContent().clickSidebarTab(0))
              .then(page => page.getContent().toggleSidebarWidgetSection(2))
              .then(page => page.getContent().addWidgetToGrid(demoPage, 2, 1, 1, 0))
              .then(page => {
                cy.wrap(4).as('widgetToBeRemovedFromPage');
                page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                    .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                    .then(contents => {
                      cy.wrap(contents).children()
                        .should('have.length', 3)
                        .should(content => expect(content.eq(2)).to.have.text('Logo'));
                    });
                cy.then(() => page);
              })
              .then(page => {
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--draft')
                    .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                page.getContent().publishPageDesign(demoPage.code);
              })
              .then(page => {
                cy.validateToast(page);
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--published')
                    .and('have.attr', 'title').should('eq', 'Published');
              }));
      });

      describe('Existing widget', () => {

        beforeEach(function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage => {
            cy.pageWidgetsController(demoPage.code)
              .then(controller => controller.addWidget(4, widgetType))
              .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
            cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
          });
        });

        it([Tag.GTS, 'ENG-2509', 'ENG-4082'], 'Basic edit with Logo widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
                .then(page => {
                  cy.validateUrlPathname(`/widget/edit/${widgetType}`);
                  page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
                  page.getContent().editFormFields({group: 'Administrator'});
                  page.getContent().submitForm();
                })
                .then(() => {
                  cy.wrap({code: widgetType, group: 'free'}).as('widgetToBeReverted');
                  cy.validateUrlPathname('/widget');
                  cy.widgetsController(widgetType).then(controller =>
                    controller.getWidget().then(response => expect(response.body.payload.group).to.eq('administrators')));
                }));
        });

        it([Tag.GTS, 'ENG-2509'], 'Open Widget Details from the dropped Logo widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openDetails())
                .then(() => cy.validateUrlPathname(`/widget/detail/${widgetType}`)));
        });

      });

      describe('Extended', () => {

        const CURRENT_LOGO = 'Entando_light.svg';
        const CHANGE_LOGO  = 'entando-logo_badge.png';
        const CUSTOM_UI    = '<#assign wp=JspTaglibs["/aps-core"]>{enter}{enter}\
     <@wp.info key="systemParam" paramName="applicationBaseURL" var="appUrl" />{enter}\
     <img src="${{}appUrl{}}resources/static/img/Entando_light.svg" aria-label="Entando" alt="Logo" role="logo" />';

        it([Tag.GTS, 'ENG-2510'], 'Add the Logo widget in page (config), edit the logo widget (in kebab actions) changing, in the Custom UI, the default logo\'s image with a new image (.svg/.png/.jpg)', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().toggleSidebarWidgetSection(2))
                .then(page => page.getContent().addWidgetToGrid(demoPage, 2, 1, 1, 0))
                .then(page => {
                  cy.wrap(4).as('widgetToBeRemovedFromPage');
                  page.getContent().publishPageDesign(demoPage.code);
                })
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
                .then(page => {
                  page.getContent().getCustomUiInput().should('not.be.empty');
                  page.getContent().getCustomUiInput().then(input => {
                    page.getContent().clear(input);
                    page.getContent().type(input, CUSTOM_UI.replace(CURRENT_LOGO, CHANGE_LOGO));
                  });
                })
                .then(page => page.getContent().submitForm())
                .then(() => {
                  cy.wrap({
                    code: widgetType,
                    customUi: CUSTOM_UI.replaceAll('{enter}', '\n').replaceAll('{}', '')
                  }).as('widgetToBeReverted');
                  cy.visit(`/${demoPage.code}.page`, {portalUI: true});
                  cy.get(`${htmlElements.img}[role="logo"]`).should('have.attr', 'src')
                    .should('not.include', CURRENT_LOGO)
                    .and('include', CHANGE_LOGO);
                }));
        });

      });

    });

    describe('System APIs Widget', () => {

      const widgetType = 'entando_apis';

      it([Tag.GTS, 'ENG-2513'], 'Basic add', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openDesigner())
              .then(page => page.getContent().clickSidebarTab(1))
              .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
              .then(page => page.getContent().clickSidebarTab(0))
              .then(page => page.getContent().toggleSidebarWidgetSection(4))
              .then(page => page.getContent().addWidgetToGrid(demoPage, 4, 0, 1, 0))
              .then(page => {
                cy.wrap(4).as('widgetToBeRemovedFromPage');
                page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                    .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                    .then(contents => {
                      cy.wrap(contents).children()
                        .should('have.length', 3)
                        .should(content => expect(content.eq(2)).to.have.text('APIs'));
                    });
                cy.then(() => page);
              })
              .then(page => {
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--draft')
                    .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                page.getContent().publishPageDesign(demoPage.code);
              })
              .then(page => {
                cy.validateToast(page);
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--published')
                    .and('have.attr', 'title').should('eq', 'Published');
              }));
      });

      describe('Existing widget', () => {

        beforeEach(function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage => {
            cy.pageWidgetsController(demoPage.code)
              .then(controller => controller.addWidget(4, widgetType))
              .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
            cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
          });
        });

        it([Tag.GTS, 'ENG-2513', 'ENG-4082'], 'Basic edit with APIs widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
                .then(page => {
                  cy.validateUrlPathname(`/widget/edit/${widgetType}`);
                  page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
                  page.getContent().editFormFields({group: 'Administrator'});
                  page.getContent().submitForm();
                })
                .then(() => {
                  cy.wrap({code: widgetType, group: 'free'}).as('widgetToBeReverted');
                  cy.validateUrlPathname('/widget');
                  cy.widgetsController(widgetType).then(controller =>
                    controller.getWidget().then(response => expect(response.body.payload.group).to.eq('administrators')));
                }));
        });

        it([Tag.GTS, 'ENG-2513'], 'Open Widget Details from the dropped APIs widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openDetails())
                .then(() => cy.validateUrlPathname(`/widget/detail/${widgetType}`)));
        });

      });

    });

    describe('System System Messages Widget', () => {

      const widgetType = 'messages_system';

      it([Tag.GTS, 'ENG-2511'], 'Basic add', function () {
        cy.wrap(this.pageToBeDeleted).then(demoPage =>
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openDesigner())
              .then(page => page.getContent().clickSidebarTab(1))
              .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
              .then(page => page.getContent().clickSidebarTab(0))
              .then(page => page.getContent().toggleSidebarWidgetSection(4))
              .then(page => page.getContent().addWidgetToGrid(demoPage, 4, 4, 1, 0))
              .then(page => {
                cy.wrap(4).as('widgetToBeRemovedFromPage');
                page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                    .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                    .then(contents => {
                      cy.wrap(contents).children()
                        .should('have.length', 3)
                        .should(content => expect(content.eq(2)).to.have.text('System Messages'));
                    });
                cy.then(() => page);
              })
              .then(page => {
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--draft')
                    .and('have.attr', 'title').should('eq', 'Published, with pending changes');
                page.getContent().publishPageDesign(demoPage.code);
              })
              .then(page => {
                cy.validateToast(page);
                page.getContent().getPageStatusIcon()
                    .should('have.class', 'PageStatusIcon--published')
                    .and('have.attr', 'title').should('eq', 'Published');
              }));
      });

      describe('Existing widget', () => {

        beforeEach(function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage => {
            cy.pageWidgetsController(demoPage.code)
              .then(controller => controller.addWidget(4, widgetType))
              .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
            cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
          });
        });

        it([Tag.GTS, 'ENG-2511', 'ENG-4082'], 'Basic edit with System Messages widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage => {
            cy.get('@currentPage')
              .then(page => page.getMenu().getPages().open().openDesigner())
              .then(page => page.getContent().clickSidebarTab(1))
              .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
              .then(page => page.getContent().clickSidebarTab(0))
              .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openEdit())
              .then(page => {
                cy.validateUrlPathname(`/widget/edit/${widgetType}`);
                page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
                page.getContent().editFormFields({group: 'Administrator'});
                page.getContent().submitForm();
              })
              .then(() => {
                cy.wrap({code: widgetType, group: 'free'}).as('widgetToBeReverted');
                cy.validateUrlPathname('/widget');
                cy.widgetsController(widgetType).then(controller =>
                  controller.getWidget().then(response => expect(response.body.payload.group).to.eq('administrators')));
              });
          });
        });

        it([Tag.GTS, 'ENG-2511'], 'Open Widget Details from the dropped System Messages widget', function () {
          cy.wrap(this.pageToBeDeleted).then(demoPage =>
              cy.get('@currentPage')
                .then(page => page.getMenu().getPages().open().openDesigner())
                .then(page => page.getContent().clickSidebarTab(1))
                .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
                .then(page => page.getContent().clickSidebarTab(0))
                .then(page => page.getContent().getDesignerGridFrameKebabMenu(1, 0, widgetType).open().openDetails())
                .then(() => cy.validateUrlPathname(`/widget/detail/${widgetType}`)));
        });

      });

    });

  });

  describe('Drag and drop widgets', () => {

    it([Tag.GTS, 'ENG-2244'], 'Move widget to different frame', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(4, 'NWS_Archive'))
          .then(() => cy.wrap(4).as('widgetToBeRemovedFromPage'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().dragGridWidgetToFrame(demoPage, 1, 0, 1, 1))
          .then(page => {
            cy.wrap(5).as('widgetToBeRemovedFromPage');
            page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).should('have.class', 'EmptyFrame');
            page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                .should(contents => expect(contents).to.have.prop('tagName').to.equal('SPAN'));
            page.getContent().getDesignerGridFrame(1, 1).children(htmlElements.div).children()
                .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                .then(contents => {
                  cy.wrap(contents).children()
                    .should('have.length', 3)
                    .should(content => expect(content.eq(2)).to.have.text('News Archive'));
                });
          });
      });
    });

  });

});
