import {generateRandomId} from '../../support/utils';
import DesignerPage       from '../../support/pageObjects/pages/designer/DesignerPage';
import {htmlElements}     from '../../support/pageObjects/WebElement';

const {CMS_WIDGETS, SYSTEM_WIDGETS, PAGE_WIDGETS} = DesignerPage;

const SAMPLE_DUPE_WIDGET_CODE = 'mio_widget';

//TODO remove The_Page and Page_Name when "CMS Content Widget - Extended" describe is fixed
const PAGE_NAME = generateRandomId();
const THE_PAGE  = {
  charset: 'utf-8',
  contentType: 'text/html',
  displayedInMenu: true,
  joinGroups: null,
  seo: false,
  titles: {
    en: PAGE_NAME
  },
  code: PAGE_NAME,
  ownerGroup: 'administrators',
  pageModel: '1-column',
  parentCode: 'homepage'
};

describe([Tag.GTS], 'Widgets Out-Of-The-Box Testing', () => {

  //TODO remove currentPage and selectPageFromSidebar when "CMS Content Widget - Extended" describe is fixed
  let currentPage;
  const selectPageFromSidebar = (pageCode = THE_PAGE.code) => {
    const currentPageContent = currentPage.getContent();
    currentPageContent.clickSidebarTab(1);
    cy.wait('@sidebarLoaded');
    cy.get(`${htmlElements.div}#toolbar-tab-pane-1`).should('be.visible');
    currentPageContent.designPageFromSidebarPageTreeTable(pageCode);
    cy.wait('@pageWidgetsLoaded');
    currentPageContent.clickSidebarTab(0);
    cy.get(`${htmlElements.div}#toolbar-tab-pane-0`).should('be.visible');
  };

  before(() => {
    cy.kcAPILogin();
    cy.fixture('data/demoPage.json').then(page => {
      page.code      = generateRandomId();
      page.titles.en = generateRandomId();
      cy.seoPagesController().then(controller => controller.addNewPage(page));
      cy.pagesController().then((controller) => controller.setPageStatus(page.code, 'published'));
      cy.wrap(page).as('pageToBeDeleted');
    });
  });

  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
    cy.wrap([]).as('widgetsToBeRemovedFromPage');
    cy.wrap(null).as('widgetToBeDeleted');
    cy.wrap(null).as('widgetToBeReverted');
    cy.wrap([]).as('contentsToBeDeleted');
  });

  afterEach(function () {
    cy.wrap(this.pageToBeDeleted).then(page =>
        cy.get('@widgetsToBeRemovedFromPage').then(widgets => widgets.forEach(widget => {
          cy.pageWidgetsController(page.code).then(controller => controller.deleteWidget(widget));
          cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));
        })));
    cy.get('@widgetToBeDeleted').then(widgetToBeDeleted => {
      if (widgetToBeDeleted) cy.widgetsController().then(controller => controller.deleteWidget(widgetToBeDeleted));
    });
    cy.get('@widgetToBeReverted').then(widgetToBeReverted => {
      if (widgetToBeReverted)
        cy.widgetsController(widgetToBeReverted.code)
          .then(controller => controller.getWidget())
          .then(({controller, formData}) => controller.putWidget({...formData, ...widgetToBeReverted}));
    });
    cy.get('@contentsToBeDeleted').then(contentIDs => contentIDs.forEach(contentID =>
        cy.contentsController().then(controller => controller.updateStatus(contentID, 'draft').then(() => controller.deleteContent(contentID)))));
    cy.kcUILogout();
  });

  after(function () {
    cy.wrap(this.pageToBeDeleted).then(page =>
        cy.pagesController()
          .then(controller => controller.setPageStatus(page.code, 'draft')
                                        .then(() => controller.deletePage(page.code))));
  });

  describe('CMS Content Widget', () => {

    const WIDGET_FRAME = {
      frameName: 'Frame 3',
      frameNum: 6
    };

    const WIDGET_CONFIG = {
      ownerGroup: 'administrators',
      joinGroups: [],
      contentId: 'TCL6',
      contentDescription: 'Sample - About Us',
      modelId: 'default'
    };


    it('Basic add with widget settings', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage =>
          cy.get('@currentPage')
            .then(page => page.getMenu().getPages().open().openDesigner())
            .then(page => page.getContent().clickSidebarTab(1))
            .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
            .then(page => page.getContent().clickSidebarTab(0))
            .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`).then(() => page))
            .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage.code, 0, 2, 3, 0, CMS_WIDGETS.CONTENT.code))
            .then(page => cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${demoPage.code}/frame/${WIDGET_FRAME.frameNum}`).then(() => page))
            .then(page => page.getContent().clickAddContentButton())
            .then(page => {
              page.getDialog().getBody().getTableRows().should('have.length', 5);
              page.getDialog().getBody().checkBoxFromTitle(WIDGET_CONFIG.contentDescription);
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
              cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum);
            }));
    });

    it('Basic edit with widget', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code).open().openEdit())
          .then(page => {
            cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.CONTENT.code}`);
            page.getContent().editFormFields({group: 'Administrator'});
            page.getContent().submitForm();
          })
          .then(() => {
            cy.wrap({code: CMS_WIDGETS.CONTENT.code, group: 'free'}).as('widgetToBeReverted');
            cy.validateUrlPathname('/widget');
          });
      });
    });


    it('Editing widget in Settings (widget config)', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code).open().openSettings( CMS_WIDGETS.CONTENT.code))
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
            cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum);
          });
      });
    });

    it('Open Widget Details from the widget dropped', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page =>
              page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code).open().openDetails());
        cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.CONTENT.code}`);
      });
    });

    it('Save As Widget', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code).open().openSaveAs())
          .then(page => {
            cy.validateUrlPathname(`/page/${demoPage.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT.code}/viewerConfig`);
            page.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
            page.getContent().getConfigTabConfiguration().should('exist');
            page.getContent().clickConfigTabConfiguration();
          })
          .then(page => {
            page.getContent().getFormBody().contains('Change content').should('exist');
            page.getContent().submitCloneWidget();
            cy.wrap(SAMPLE_DUPE_WIDGET_CODE).as('widgetToBeDeleted');
            cy.validateUrlPathname(`/page/configuration/${demoPage.code}`);
          });
        cy.get('@currentPage')
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
  });

  describe('CMS Content List Widget', () => {

    const WIDGET_CONFIG = {
      ownerGroup: 'administrators',
      joinGroups: [],
      contents: [
        {contentId: 'TCL6', modelId: '10004', contentDescription: 'Sample - About Us'},
        {contentId: 'BNR2', modelId: '10003', contentDescription: 'Sample Banner'}
      ]
    };

    const WIDGET_FRAME = {
      frameName: 'Frame 4',
      frameNum: 7
    };

    it('Basic add with widget settings', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`).then(() => page))
          .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage.code, 0, 4, 4, 0, CMS_WIDGETS.CONTENT_LIST.code))
          .then(page => cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${demoPage.code}/frame/${WIDGET_FRAME.frameNum}`).then(() => page))
        cy.wait(1000)
        cy.get('@currentPage')
          .then(page => {
                page.getContent().getContentListTableRowWithTitle('Sample - About Us').should('exist');
                page.getContent().clickAddButtonFromTableRowWithTitle('Sample - About Us');
              })
          .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Sample Banner'))
          .then(page => page.getContent().getModelIdDropdownByIndex(0).then(select => page.getContent().select(select, '2-column-content')))
          .then(page => page.getContent().getModelIdDropdownByIndex(1).then(select => page.getContent().select(select, 'Banner - Text, Image, CTA')))
          .then(page => page.getContent().confirmConfig(demoPage.code))
          .then(page => {
            page.getContent().getPageStatusIcon()
                .should('have.class', 'PageStatusIcon--draft')
                .and('have.attr', 'title').and('eq', 'Published, with pending changes');
            page.getContent().publishPageDesign(demoPage.code);
          })
          .then(page => {
            page.getContent().getPageStatusIcon()
                .should('have.class', 'PageStatusIcon--published')
                .and('have.attr', 'title').and('eq', 'Published');
          });
      });

    });

    it('Basic edit with widget', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_LIST.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code).open().openEdit())
          .then(page => {
            cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.CONTENT_LIST.code}`);
            page.getContent().editFormFields({group: 'Administrator'});
            page.getContent().submitForm();
          })
          .then(() => {
            cy.wrap({code: CMS_WIDGETS.CONTENT_LIST.code, group: 'free'}).as('widgetToBeReverted');
            cy.validateUrlPathname('/widget');
          });
      });
    });

    it('Editing widget in Settings (widget config)', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_LIST.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code).open().openSettings(CMS_WIDGETS.CONTENT_LIST.code));
        cy.wait(1000);
        cy.get('@currentPage')
          .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('A Modern Platform for Modern UX'))
          .then(page => page.getContent().getModelIdDropdownByIndex(2).select('Banner - Search Results'));
        cy.get('@currentPage')
          .then(page => page.getContent().confirmConfig(demoPage.code));
        cy.get('@currentPage')
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

    it('Open Widget Details from the widget dropped', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_LIST.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page =>
              page.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code).open().openDetails());
        cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.CONTENT_LIST.code}`);
      });
    });

    it('Save As Widget', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_LIST.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code).open().openSaveAs())
          .then(page => {
            cy.validateUrlPathname(`/page/${demoPage.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_LIST.code}/rowListViewerConfig`);
            page.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
            page.getContent().getConfigTabConfiguration().should('exist');
            page.getContent().clickConfigTabConfiguration();
          })
          .then(page => {
            page.getContent().getFormBody().contains('Content List').should('exist');
            page.getContent().submitCloneWidget();
            cy.wrap(SAMPLE_DUPE_WIDGET_CODE).as('widgetToBeDeleted');
            cy.validateUrlPathname(`/page/configuration/${demoPage.code}`);
          });
        cy.get('@currentPage')
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
  });

  describe('CMS Content Search Query Widget', () => {

    const WIDGET_FRAME = {
      frameName: 'Frame 3',
      frameNum: 6
    };

    const WIDGET_CONFIG = {
      contentType: 'BNR',
      maxElemForItem: '10'
    };

    it('Basic add with widget settings', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`).then(() => page))
          .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage.code, 0, 3, 3, 0, CMS_WIDGETS.CONTENT_QUERY.code));
        cy.get('@currentPage')
          .then(page => {
            cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_QUERY.code}/page/${demoPage.code}/frame/${WIDGET_FRAME.frameNum}`);
            page.getContent().getContentTypeField().then(select => page.getContent().select(select, 'Banner'));
            page.getContent().getPublishSettingsAccordButton().click();
            page.getContent().getMaxTotalElemDropdown().then(select => page.getContent().select(select, '10'));
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
          });
        cy.wrap(WIDGET_FRAME.frameNum).as('widgetToBeRemovedFromPage');
      });
    });

    it('Basic edit with widget', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_QUERY.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code).open().openEdit())
          .then(page => {
            cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.CONTENT_QUERY.code}`);
            page.getContent().editFormFields({group: 'Administrator'});
            page.getContent().submitForm();
          })
          .then(() => {
            cy.wrap({code: CMS_WIDGETS.CONTENT_QUERY.code, group: 'free'}).as('widgetToBeReverted');
            cy.validateUrlPathname('/widget');
          });
      });
    });

    it('Editing widget in Settings (widget config)', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_QUERY.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code).open().openSettings(CMS_WIDGETS.CONTENT_QUERY.code));//todo trovare un modo migliore per differenziare l'apertura dei pageObjects
        cy.wait(1000);
        cy.get('@currentPage')
          .then(page => {
            cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_QUERY.code}/page/${demoPage.code}/frame/${WIDGET_FRAME.frameNum}`);
            page.getContent().getPublishSettingsAccordButton().click();
            page.getContent().getMaxElemForItemDropdown().then(select => page.getContent().select(select, '6'));
            page.getContent().getMaxTotalElemDropdown().then(select => page.getContent().select(select, '10'));
          })
          .then(page => page.getContent().confirmConfig(demoPage.code));
        cy.get('@currentPage')
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

    it('Open Widget Details from the widget dropped', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_QUERY.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page =>
              page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code).open().openDetails());
        cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.CONTENT_QUERY.code}`);
      });
    });

    it('Save As Widget', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_QUERY.code, WIDGET_CONFIG))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code).open().openSaveAs())
          .then(page => {
            cy.validateUrlPathname(`/page/${demoPage.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_QUERY.code}/listViewerConfig`);
            page.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
            page.getContent().getConfigTabConfiguration().should('exist');
            page.getContent().clickConfigTabConfiguration();
          })
          .then(page => {
            page.getContent().getFormBody().contains(/^Publishing settings$/i).should('exist');
            page.getContent().submitCloneWidget();
            cy.wrap(SAMPLE_DUPE_WIDGET_CODE).as('widgetToBeDeleted');
            cy.validateUrlPathname(`/page/configuration/${demoPage.code}`);
          });
        cy.get('@currentPage')
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

  });

  describe('CMS Search Form and Search Results Widgets', () => {

    const WIDGET_FRAME_1 = {
      frameName: 'Frame 2',
      frameNum: 5
    };

    const WIDGET_FRAME_2 = {
      frameName: 'Frame 3',
      frameNum: 6
    };

    it('Basic add', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`).then(() => page))
          .then(page => page.getContent().dragWidgetToGridOld(0, 5, 2, 0))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`).then(() => page));
        cy.get('@currentPage')
          .then(page => page.getContent().dragWidgetToGridOld(0, 6, 3, 0));
        cy.get('@currentPage')
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
        cy.wrap([WIDGET_FRAME_1.frameNum, WIDGET_FRAME_2.frameNum]).as('widgetsToBeRemovedFromPage');
      });
    });

    it('Basic edit with CMS Search Form widget', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, CMS_WIDGETS.SEARCH_FORM.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_1.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.SEARCH_FORM.code).open().openEdit())
          .then(page => {
            cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.SEARCH_FORM.code}`);
            page.getContent().editFormFields({group: 'Administrator'});
            page.getContent().submitForm();
          })
          .then(() => {
            cy.wrap({code: CMS_WIDGETS.SEARCH_FORM.code, group: 'free'}).as('widgetToBeReverted');
            cy.validateUrlPathname('/widget');
          });
      });
    });

    it('Basic edit with CMS Search Result widget', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, CMS_WIDGETS.SEARCH_RESULT.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_1.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.SEARCH_RESULT.code).open().openEdit())
          .then(page => {
            cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.SEARCH_RESULT.code}`);
            page.getContent().editFormFields({group: 'Administrator'});
            page.getContent().submitForm();
          })
          .then(() => {
            cy.wrap({code: CMS_WIDGETS.SEARCH_RESULT.code, group: 'free'}).as('widgetToBeReverted');
            cy.validateUrlPathname('/widget');
          });
      });
    });

    it('Open Widget Details from the dropped CMS Search Form widget', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, CMS_WIDGETS.SEARCH_FORM.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_1.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page =>
              page.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.SEARCH_FORM.code).open().openDetails());
        cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.SEARCH_FORM.code}`);
      });
    });

    it('Open Widget Details from the dropped CMS Search Results widget', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, CMS_WIDGETS.SEARCH_RESULT.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_2.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page =>
              page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.SEARCH_RESULT.code).open().openDetails());
        cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.SEARCH_RESULT.code}`);
      });
    });
  });

  describe('CMS News Archive and News Latest Widgets', () => {

    const WIDGET_FRAME_1 = {
      frameName: 'Frame 2',
      frameNum: 5
    };

    const WIDGET_FRAME_2 = {
      frameName: 'Frame 3',
      frameNum: 6
    };

    it('Basic add', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`).then(() => page))
          .then(page => page.getContent().dragWidgetToGridOld(0, 0, 2, 0))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`).then(() => page));
        cy.get('@currentPage')
          .then(page => page.getContent().dragWidgetToGridOld(0, 1, 3, 0));
        cy.get('@currentPage')
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

    it('Basic edit with News Archive widget', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, CMS_WIDGETS.NEWS_ARCHIVE.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_1.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.NEWS_ARCHIVE.code).open().openEdit())
          .then(page => {
            cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
            page.getContent().editFormFields({group: 'Administrator'});
            page.getContent().submitForm();
          })
          .then(() => {
            cy.wrap({code: CMS_WIDGETS.NEWS_ARCHIVE.code, group: 'free'}).as('widgetToBeReverted');
            cy.validateUrlPathname('/widget');
          });
      });
    });

    it('Basic edit with News Latest widget', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, CMS_WIDGETS.NEWS_LATEST.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_2.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.NEWS_LATEST.code).open().openEdit())
          .then(page => {
            cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.NEWS_LATEST.code}`);
            page.getContent().editFormFields({group: 'Administrator'});
            page.getContent().submitForm();
          })
          .then(() => {
            cy.wrap({code: CMS_WIDGETS.NEWS_LATEST.code, group: 'free'}).as('widgetToBeReverted');
            cy.validateUrlPathname('/widget');
          });
      });

    });


    it('Open Widget Details from the dropped CMS News Archive widget', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, CMS_WIDGETS.NEWS_ARCHIVE.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_1.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page =>
              page.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.NEWS_ARCHIVE.code).open().openDetails());
        cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
      });

    });


    it('Open Widget Details from the dropped CMS News Latest widget', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, CMS_WIDGETS.NEWS_LATEST.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_2.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page =>
              page.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.NEWS_LATEST.code).open().openDetails());
        cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.NEWS_LATEST.code}`);
      });

    });
  });

  describe('Page Widgets - Language and Logo', () => {

    const WIDGET_FRAME_1 = {
      frameName: 'Frame 2',
      frameNum: 5
    };

    const WIDGET_FRAME_2 = {
      frameName: 'Frame 3',
      frameNum: 6
    };

    it('Basic add', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().toggleSidebarWidgetSection(2))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`).then(() => page))
          .then(page => page.getContent().dragWidgetToGridOld(2, 0, 2, 0))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`).then(() => page));
        cy.get('@currentPage')
          .then(page => page.getContent().dragWidgetToGridOld(2, 1, 3, 0));
        cy.get('@currentPage')
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
        cy.wrap([WIDGET_FRAME_1.frameNum, WIDGET_FRAME_2.frameNum]).as('widgetsToBeRemovedFromPage');
      });
    });

    it('Basic edit with Language widget', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, PAGE_WIDGETS.LANGUAGE.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_1.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(2, 0, PAGE_WIDGETS.LANGUAGE.code).open().openEdit())
          .then(page => {
            cy.validateUrlPathname(`/widget/edit/${PAGE_WIDGETS.LANGUAGE.code}`);
            page.getContent().editFormFields({group: 'Administrator'});
            page.getContent().submitForm();
          })
          .then(() => {
            cy.wrap({code: PAGE_WIDGETS.LANGUAGE.code, group: 'free'}).as('widgetToBeReverted');
            cy.validateUrlPathname('/widget');
          });
      });
    });

    it('Basic edit with Logo widget', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, PAGE_WIDGETS.LOGO.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_2.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(3, 0, PAGE_WIDGETS.LOGO.code).open().openEdit())
          .then(page => {
            cy.validateUrlPathname(`/widget/edit/${PAGE_WIDGETS.LOGO.code}`);
            page.getContent().editFormFields({group: 'Administrator'});
            page.getContent().submitForm();
          })
          .then(() => {
            cy.wrap({code: PAGE_WIDGETS.LOGO.code, group: 'free'}).as('widgetToBeReverted');
            cy.validateUrlPathname('/widget');
          });
      });
    });

    it('Open Widget Details from the dropped Language widget', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, PAGE_WIDGETS.LANGUAGE.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_1.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page =>
              page.getContent().getDesignerGridFrameKebabMenu(2, 0, PAGE_WIDGETS.LANGUAGE.code).open().openDetails());
        cy.validateUrlPathname(`/widget/detail/${PAGE_WIDGETS.LANGUAGE.code}`);
      });
    });

    it('Open Widget Details from the dropped Logo widget', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, PAGE_WIDGETS.LOGO.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_2.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page =>
              page.getContent().getDesignerGridFrameKebabMenu(3, 0, PAGE_WIDGETS.LOGO.code).open().openDetails());
        cy.validateUrlPathname(`/widget/detail/${PAGE_WIDGETS.LOGO.code}`);
      });
    });


    describe('Page Widgets - Logo - Extended', () => {
      const WIDGET_FRAME_1 = {
        frameName: 'Frame 2',
        frameNum: 5
      };
      const CUSTOM_UI      = '<#assign wp=JspTaglibs["/aps-core"]>{enter}{enter}\
     <@wp.info key="systemParam" paramName="applicationBaseURL" var="appUrl" />{enter}\
     <img src="${{}appUrl{}}resources/static/img/Entando_light.svg" aria-label="Entando" alt="Logo" role="logo" />';

      const CURRENT_LOGO = 'Entando_light.svg';
      const CHANGE_LOGO  = 'entando-logo_badge.png';

      it('Add the Logo widget in page (config), edit the logo widget (in kebab actions) changing, in the Custom UI, the default logo\'s image with a new image (.svg/.png/.jpg)', function () {

        cy.wrap(this.pageToBeDeleted).then(demoPage => {
          cy.get('@currentPage')
            .then(page => page.getMenu().getPages().open().openDesigner())
            .then(page => page.getContent().clickSidebarTab(1))
            .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
            .then(page => page.getContent().clickSidebarTab(0))
            .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`).then(() => page))
            .then(page => page.getContent().toggleSidebarWidgetSection(2))
            .then(page => page.getContent().dragWidgetToGridOld(2, 1, 0, 0));
          cy.get('@currentPage')
            .then(page => page.getContent().publishPageDesign(demoPage.code))
            .then(page => page.getContent().getDesignerGridFrameKebabMenu(0, 0, PAGE_WIDGETS.LOGO.code).open().openEdit())
            .then(page => {
              page.getContent().getCustomUiInput().should('not.be.empty');
              page.getContent().getCustomUiInput().clear();
              page.getContent().getCustomUiInput().type(CUSTOM_UI.replace(CURRENT_LOGO, CHANGE_LOGO));
            });
          cy.get('@currentPage')
            .then(page => page.getContent().submitForm());
          cy.wait(2000);
          cy.visit(`/${demoPage.code}.page`, {portalUI: true});
          cy.get(`${htmlElements.img}[role="logo"]`).should('have.attr', 'src')
            .should('not.include', CURRENT_LOGO)
            .and('include', CHANGE_LOGO);

          cy.wrap(WIDGET_FRAME_1.frameNum).as('widgetToBeRemovedFromPage');
          cy.wrap({
            code: PAGE_WIDGETS.LOGO.code,
            customUi: CUSTOM_UI.replaceAll('{enter}', '\n').replaceAll('{}', '')
          }).as('widgetToBeReverted');
        });
      });
    });
  });

  describe('System Widgets - APIs and System Messages', () => {

    const WIDGET_FRAME_1 = {
      frameName: 'Frame 2',
      frameNum: 5
    };

    const WIDGET_FRAME_2 = {
      frameName: 'Frame 3',
      frameNum: 6
    };

    it('Basic add', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().toggleSidebarWidgetSection(4))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`).then(() => page))
          .then(page => page.getContent().dragWidgetToGridOld(4, 0, 2, 0))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`).then(() => page));
        cy.get('@currentPage')
          .then(page => page.getContent().dragWidgetToGridOld(4, 4, 3, 0));
        cy.get('@currentPage')
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
        cy.wrap([WIDGET_FRAME_1.frameNum, WIDGET_FRAME_2.frameNum]).as('widgetsToBeRemovedFromPage');
      });
    });

    it('Basic edit with APIs widget', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, SYSTEM_WIDGETS.APIS.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_1.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(2, 0, SYSTEM_WIDGETS.APIS.code).open().openEdit())
          .then(page => {
            cy.validateUrlPathname(`/widget/edit/${SYSTEM_WIDGETS.APIS.code}`);
            page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
          });
        cy.get('@currentPage')
          .then(page => {
            page.getContent().editFormFields({group: 'Administrator'});
            page.getContent().submitForm();
          })
          .then(() => {
            cy.wrap({code: SYSTEM_WIDGETS.APIS.code, group: 'free'}).as('widgetToBeReverted');
            cy.validateUrlPathname('/widget');
          });
      });
    });

    it('Basic edit with News Latest widget', function () {
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, SYSTEM_WIDGETS.SYS_MSGS.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_2.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => page.getContent().getDesignerGridFrameKebabMenu(3, 0, SYSTEM_WIDGETS.SYS_MSGS.code).open().openEdit())
          .then(page => {
            cy.validateUrlPathname(`/widget/edit/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
            page.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
          });
        cy.get('@currentPage')
          .then(page => {
            page.getContent().editFormFields({group: 'Administrator'});
            page.getContent().submitForm();
          })
          .then(() => {
            cy.wrap({code: SYSTEM_WIDGETS.SYS_MSGS.code, group: 'free'}).as('widgetToBeReverted');
            cy.validateUrlPathname('/widget');
          });
      });
    });

    it('Open Widget Details from the dropped APIs widget', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, SYSTEM_WIDGETS.APIS.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_1.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page =>
              page.getContent().getDesignerGridFrameKebabMenu(2, 0, SYSTEM_WIDGETS.APIS.code).open().openDetails());
        cy.validateUrlPathname(`/widget/detail/${SYSTEM_WIDGETS.APIS.code}`);
      });
    });

    it('Open Widget Details from the dropped System Messages widget', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.pageWidgetsController(demoPage.code)
          .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, SYSTEM_WIDGETS.SYS_MSGS.code))
          .then(() => cy.unshiftAlias('@widgetsToBeRemovedFromPage', WIDGET_FRAME_2.frameNum));
        cy.pagesController().then(controller => controller.setPageStatus(demoPage.code, 'published'));
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page =>
              page.getContent().getDesignerGridFrameKebabMenu(3, 0, SYSTEM_WIDGETS.SYS_MSGS.code).open().openDetails());
        cy.validateUrlPathname(`/widget/detail/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
      });
    });

  });

  describe('CMS Content Widget - Extended', () => {

    const WIDGET_FRAME = {
      frameName: 'Frame 3',
      frameNum: 6
    };

    const NEW_CONTENT_TYPE = {
      code: 'BNR',
      name: 'Banner'
    };

    // FIXME: when moving from admin console to app builder, the app tour starts again
    //        can't use API calls to clean the environment after the test
    xit('select a content and a content template that is unrelated or inconsistent with the content type, then implement in Content widget. Publish the page and view published page', () => {
      currentPage = currentPage.getMenu().getContent().open();
      currentPage = currentPage.openTemplates();

      currentPage = currentPage.getContent().clickAddButton();

      currentPage.getContent().editFormFields({
        id: '10079',
        descr: 'Demo Faux',
        contentType: 'Banner',
        contentShape: '<article>$content.toto.text</article>'
      });

      currentPage = currentPage.getContent().submitForm();

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesignerOld();

      //closes the app tour again
      currentPage.closeAppTour();

      selectPageFromSidebar();

      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 2, 3, 0, CMS_WIDGETS.CONTENT.code);
      cy.wait('@pageWidgetsLoaded');
      currentPage.getContent().clickAddContentButton();

      currentPage.getDialog().getBody()
                 .getCheckboxFromTitle('Sample Banner').click();
      currentPage.getDialog().getConfirmButton().click();

      currentPage.getContent().getModelIdSelect().select('Demo Faux');
      currentPage = currentPage.getContent().confirmConfig();
      cy.wait('@pageWidgetsLoaded');

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');

      currentPage.getContent().publishPageDesign();

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');

      cy.visit(`/${THE_PAGE.code}.page`, {portalUI: true});
      cy.get(`${htmlElements.div}.bar-content-edit-container`).should('contain', '$content.toto.text');

      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');
    });

    // FIXME: when moving from admin console to app builder, the app tour starts again
    //        can't use API calls to clean the environment after the test
    //        creating a new content from page designer doesn't automatically bring back to page designer like it used to
    xit('add a new no published content with a content type and content template, fill in all mandatory fields, save the content, then save the widget configuration', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesignerOld();
      selectPageFromSidebar();

      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 2, 3, 0, CMS_WIDGETS.CONTENT.code);
      cy.wait('@pageWidgetsLoaded');
      currentPage = currentPage.getContent().clickNewContentWith(NEW_CONTENT_TYPE.name);

      currentPage = currentPage.getContent().addContentFromContentWidgetConfig('Unpublish En Title', 'Unpublish It Title', 'Unpublish Sample Description', true);

      //go back to page designer
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesignerOld();

      //closes the app tour again
      currentPage.closeAppTour();

      selectPageFromSidebar();

      //drag the widget to the grid again
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 2, 3, 0, CMS_WIDGETS.CONTENT.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      currentPage.getContent().clickAddContentButton();
      cy.wait('@contentsLoaded');
      currentPage.getDialog().getBody().getCheckboxFromTitle('Unpublish Sample Description').click();
      currentPage.getDialog().getConfirmButton().click();
      cy.wait('@contentTypeLoaded');

      currentPage = currentPage.getContent().confirmConfig();
      currentPage.getToastList().should('be.visible').and('have.length', 1);
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');
    });

    // FIXME: when moving from admin console to app builder, the app tour starts again
    //        can't use API calls to clean the environment after the test
    //        creating a new content from page designer doesn't automatically bring back to page designer like it used to
    xit('add a new content with a content type and content template, fill in all mandatory fields, save and approve, then save the configuration', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesignerOld();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 2, 3, 0, CMS_WIDGETS.CONTENT.code);
      cy.wait('@pageWidgetsLoaded');
      currentPage = currentPage.getContent().clickNewContentWith(NEW_CONTENT_TYPE.name);

      currentPage = currentPage.getContent().addContentFromContentWidgetConfig('En Title', 'It Title', 'Sample Description', true);

      //go back to page designer
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesignerOld();

      //closes the app tour again
      currentPage.closeAppTour();

      selectPageFromSidebar();

      //drag the widget to the grid again
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 2, 3, 0, CMS_WIDGETS.CONTENT.code);
      cy.wait('@pageWidgetsLoaded');
      currentPage.getContent().clickAddContentButton();

      currentPage.getDialog().getBody()
                 .getCheckboxFromTitle('Sample Description').click();
      currentPage.getDialog().getConfirmButton().click();

      currentPage.getContent().getModelIdSelect().select('Banner - Text, Image, CTA');
      currentPage = currentPage.getContent().confirmConfig();
      cy.wait('@pageWidgetsLoaded');

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');
    });
  });

  describe('CMS Content List Widget - Extended', () => {

    const WIDGET_FRAME = {
      frameName: 'Frame 3',
      frameNum: 6
    };

    const WIDGET_FRAME_2 = {
      frameName: 'Frame 4',
      frameNum: 7
    };

    const CONTENT_TYPE = {
      name: 'Banner',
      code: 'BNR'
    };

    it('Add all existing published OOTB contents', function () {

      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`).then(() => page))
          .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage.code, 0, 4, 3, 0, CMS_WIDGETS.CONTENT_LIST.code))
          .then(page => cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${demoPage.code}/frame/${WIDGET_FRAME.frameNum}`).then(() => page));
        cy.wait(1000);
        cy.get('@currentPage')
          .then(page => page.getContent().getContentListTableBody().children(htmlElements.div).children(htmlElements.div).should('not.have.class', 'spinner'));
        cy.get('@currentPage')
          .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Sample - About Us'))
          .then(page => page.getContent().getModelIdDropdownByIndex(0).should('exist'));
        cy.get('@currentPage')
          .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Why You Need a Micro Frontend Platform for Kubernetes'))
          .then(page => page.getContent().getModelIdDropdownByIndex(1).should('exist'));
        cy.get('@currentPage')
          .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Entando and JHipster: How It Works'))
          .then(page => page.getContent().getModelIdDropdownByIndex(2).should('exist'));
        cy.get('@currentPage')
          .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Sample Banner'))
          .then(page => page.getContent().getModelIdDropdownByIndex(3).should('exist'));
        cy.get('@currentPage')
          .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('A Modern Platform for Modern UX'))
          .then(page => page.getContent().getModelIdDropdownByIndex(4).should('exist'));

        cy.get('@currentPage')
          .then(page => {
            page.getContent().getModelIdDropdownByIndex(0).then(select => page.getContent().select(select, '2-column-content'))
                .then(page => page.getContent().getModelIdDropdownByIndex(1).then(select => page.getContent().select(select, 'News - Detail')))
                .then(page => page.getContent().getModelIdDropdownByIndex(2).then(select => page.getContent().select(select, 'News - Detail')))
                .then(page => page.getContent().getModelIdDropdownByIndex(3).then(select => page.getContent().select(select, 'Banner - Text, Image, CTA')))
                .then(page => page.getContent().getModelIdDropdownByIndex(4).then(select => page.getContent().select(select, 'Banner - Text, Image, CTA')))
                .then(page => page.getContent().confirmConfig(demoPage.code));
          });

        cy.get('@currentPage')
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

    // FIXME: when moving from admin console to app builder, the app tour starts again
    //        can't use API calls to clean the environment after the test
    xit('Add new existing published contents', function() {

      cy.get('@currentPage')
        .then(page => page.getMenu().getContent().open().openManagement())
          .then(page => page.getContent().openAddContentPage(CONTENT_TYPE.name))
          .then(page => page.getContent().addContent('En Title', 'It Title', 'Sample Description', true))
          .then(page => page.getContent().openAddContentPage(CONTENT_TYPE.name))
          .then(page => page.getContent().addContent('En Title 2', 'It Title 2', 'Another Content so its more than 1', true))
      cy.wrap(this.pageToBeDeleted).then(demoPage => {
        cy.get('@currentPage')
          .then(page => page.getMenu().getPages().open().openDesigner())
          .then(page => page.getContent().clickSidebarTab(1))
          .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
          .then(page => page.getContent().clickSidebarTab(0))
          .then(page => cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`).then(() => page))
          .then(page => page.getContent().dragConfigurableWidgetToGrid(demoPage.code, 0, 4, 4, 0, CMS_WIDGETS.CONTENT_LIST.code))
          .then(page => cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${demoPage.code}/frame/${WIDGET_FRAME_2.frameNum}`).then(() => page));
        cy.wait(1000);
        cy.get('@currentPage')
          .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Another Content so its more than 1'))
          .then(page => page.getContent().getModelIdDropdownByIndex(0).then(select => page.getContent().select(select, 'Banner - Text, Image, CTA')))
          .then(page => page.getContent().clickAddButtonFromTableRowWithTitle('Sample Description'))
          .then(page => page.getContent().getModelIdDropdownByIndex(1).then(select => page.getContent().select(select, 'Banner - Text, Image, CTA')))
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
          });
        cy.wrap(WIDGET_FRAME_2.frameNum).as('widgetToBeRemovedFromPage');
      })

      /* //OLD version

      currentPage = currentPage.getContent().openAddContentPage(CONTENT_TYPE.name);
      currentPage = currentPage.getContent().addContent('En Title', 'It Title', 'Sample Description', true);
      currentPage = currentPage.getContent().openAddContentPage(CONTENT_TYPE.name);
      currentPage = currentPage.getContent().addContent('En Title 2', 'It Title 2', 'Another Content so its more than 1', true);

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesignerOld();

      //closes the app tour again
      currentPage.closeAppTour();

      selectPageFromSidebar();

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 4, 4, 0, CMS_WIDGETS.CONTENT_LIST.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME_2.frameNum}`);
      cy.wait(['@contentsLoaded', '@contentsLoaded', '@pageWidgetsLoaded']);

      currentPage.getContent().getAddButtonFromTableRowWithTitle('Another Content so its more than 1').click();
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample Description').click();
      currentPage.getContent().getModelIdDropdownByIndex(0).select('Banner - Text, Image, CTA');
      currentPage.getContent().getModelIdDropdownByIndex(1).select('Banner - Text, Image, CTA');

      currentPage = currentPage.getContent().confirmConfig();
      cy.wait('@pageWidgetsLoaded');

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
      cy.wrap(WIDGET_FRAME_2.frameNum).as('widgetToRemoveFromPage');*/
    });
  });

});
