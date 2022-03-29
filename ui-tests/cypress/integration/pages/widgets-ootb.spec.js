import {generateRandomId} from '../../support/utils';
import HomePage           from '../../support/pageObjects/HomePage';
import DesignerPage       from '../../support/pageObjects/pages/designer/DesignerPage';
import {htmlElements}     from '../../support/pageObjects/WebElement';
import AppPage            from '../../support/pageObjects/app/AppPage';

const {CMS_WIDGETS, SYSTEM_WIDGETS, PAGE_WIDGETS} = DesignerPage;

const SAMPLE_DUPE_WIDGET_CODE = 'mio_widget';

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
  let currentPage;

  before(() => {
    cy.kcAPILogin();
    cy.seoPagesController()
      .then((controller) => controller.addNewPage(THE_PAGE));
    cy.pagesController()
      .then((controller) => controller.setPageStatus(THE_PAGE.code, 'published'));
  });

  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
    cy.contentsController()
      .then(controller => controller.intercept({method: 'POST'}, 'interceptedPOST'));
    cy.pagesController()
      .then((controller => controller.intercept({method: 'GET'}, 'sidebarLoaded', '/homepage/widgets?status=published')));
    cy.pagesController()
      .then((controller => controller.intercept({method: 'GET'}, 'pageWidgetsLoaded', `/${THE_PAGE.code}/widgets?status=published`)));
    cy.pagesController()
      .then((controller => controller.intercept({method: 'PUT'}, 'pageStatusChanged', `/${THE_PAGE.code}/status`)));
    cy.usersController()
      .then((controller => controller.intercept({method: 'GET'}, 'usersLoaded', '?page=1&pageSize=0')));
    cy.contentsController()
      .then((controller => controller.intercept({method: 'GET'}, 'contentsLoaded', '?sort=lastModified&direction=DESC&status=published&forLinkingWithOwnerGroup=administrators&mode=list&page=1&pageSize=**')));
    cy.wrap(null).as('widgetToRemoveFromPage');
    cy.wrap(null).as('widgetToDelete');
    cy.wrap(null).as('widgetToRevert');
    cy.wrap(null).as('contentsToBeDeleted');
    currentPage = new HomePage();
  });

  afterEach(() => {
    cy.get('@widgetToRemoveFromPage').then(widgetToRemoveFromPage => {
      if (widgetToRemoveFromPage !== null) {
        const deleteWidgetFromPage = (widgetCode) => {
          cy.pageWidgetsController(THE_PAGE.code)
            .then(controller => controller.deleteWidget(widgetCode));
        };
        if (Array.isArray(widgetToRemoveFromPage)) {
          widgetToRemoveFromPage.forEach((widgetCode) => {
            deleteWidgetFromPage(widgetCode);
          });
        } else {
          deleteWidgetFromPage(widgetToRemoveFromPage);
        }
        cy.pagesController()
          .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      }
    });
    cy.get('@widgetToDelete').then((widgetToDelete) => {
      if (widgetToDelete !== null) {
        cy.widgetsController()
          .then(controller => controller.deleteWidget(widgetToDelete));
      }
    });
    cy.get('@widgetToRevert').then((widgetToRevert) => {
      if (widgetToRevert !== null) {
        const revertWidget = (widget) => {
          cy.widgetsController(widget.code)
            .then(controller => controller.getWidget())
            .then(({controller, formData}) => controller.putWidget({...formData, ...widget}));
        };
        if (Array.isArray(widgetToRevert)) {
          widgetToRevert.forEach((widget) => {
            revertWidget(widget);
          });
        } else {
          revertWidget(widgetToRevert);
        }
      }
    });
    cy.get('@contentsToBeDeleted').then(contentIDs => {
      if (contentIDs) {
        contentIDs.forEach(contentId => {
          cy.contentsController().then(controller =>
            controller.updateStatus(contentId, 'draft')
              .then(() => controller.deleteContent(contentId)));
        })
      }
    });
    cy.kcUILogout();
  });

  after(() => {
    cy.kcAPILogin();
    cy.pagesController()
      .then(controller => {
        controller.setPageStatus(THE_PAGE.code, 'draft');
        controller.deletePage(THE_PAGE.code);
      });
  });

  const selectPageFromSidebar = (pageCode = THE_PAGE.code) => {
    const currentPageContent = currentPage.getContent();
    currentPageContent.clickSidebarTab(1);
    cy.wait('@sidebarLoaded');
    currentPageContent.designPageFromSidebarPageTreeTable(pageCode);
    cy.wait('@pageWidgetsLoaded');
    currentPageContent.clickSidebarTab(0);
    cy.get(`${htmlElements.div}#toolbar-tab-pane-0`).should('be.visible');
  };

  const confirmWidgetConfig = () => {
    const click = $el => $el.click();

    currentPage.getContent().getSaveButton().should('be.visible')
      .pipe(click)
      .should($el => {
        expect($el).to.not.exist
      });
    return new AppPage(DesignerPage);
  }

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

    const CONTENT_TYPE = {
      name: '2 columns',
      code: 'TCL'
    };

    beforeEach(() => {
      cy.contentTypesController()
        .then((controller => controller.intercept({method: 'GET'}, 'contentTypeLoaded', `/${CONTENT_TYPE.code}`)));
    });

    it('Basic add with widget settings', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();

      cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 2, 3, 0, CMS_WIDGETS.CONTENT.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      cy.wait('@pageWidgetsLoaded');
      currentPage.getContent().clickAddContentButton();
      cy.wait('@contentsLoaded');
      currentPage.getDialog().getBody().getTableRows().should('have.length', 5);
      currentPage.getDialog().getBody()
                 .getCheckboxFromTitle(WIDGET_CONFIG.contentDescription).click({force: true});
      currentPage.getDialog().getConfirmButton().click();
      cy.wait('@contentTypeLoaded');
      currentPage = confirmWidgetConfig();
      cy.wait('@pageWidgetsLoaded');

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      cy.wait('@pageStatusChanged');
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');
    });

    it('Basic edit with widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();

      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code)
                               .open()
                               .openEdit();

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.CONTENT.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wrap({code: CMS_WIDGETS.CONTENT.code, group: 'free'}).as('widgetToRevert');

      cy.validateUrlPathname('/widget');
    });

    it('Editing widget in Settings (widget config)', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code)
                               .open()
                               .openSettings();

      currentPage.getContent().clickChangeContentButton();

      currentPage.getDialog().getBody()
                 .getCheckboxFromTitle('Sample Banner').click({force: true});
      currentPage.getDialog().getConfirmButton().click();

      currentPage = currentPage.getContent().confirmConfig();
      cy.wait('@pageWidgetsLoaded');

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Open Widget Details from the widget dropped', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code)
                                .open()
                                .openDetails();
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.CONTENT.code}`);
    });

    it('Save As Widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();

      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code)
                               .open()
                               .openSaveAs();

      cy.validateUrlPathname(`/page/${THE_PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT.code}/viewerConfig`);
      currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
      currentPage.getContent().getConfigTabConfiguration().should('exist');
      currentPage.getContent().getConfigTabConfiguration().click();

      currentPage.getContent().getFormBody().contains('Change content').should('exist');
      currentPage = currentPage.getContent().submitCloneWidget();
      cy.wrap(SAMPLE_DUPE_WIDGET_CODE).as('widgetToDelete');

      cy.validateUrlPathname(`/page/configuration/${THE_PAGE.code}`);

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
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

    it('Basic add with widget settings', () => {
      cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();

      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 4, 4, 0, CMS_WIDGETS.CONTENT_LIST.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      cy.wait(['@pageWidgetsLoaded', '@contentsLoaded', '@contentsLoaded']);
      currentPage.getContent().getContentListTableRowWithTitle('Sample - About Us').should('exist');
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample - About Us').click();
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample Banner').click();

      currentPage.getContent().getModelIdDropdownByIndex(0).select('2-column-content');
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
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');
    });

    it('Basic edit with widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_LIST.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code)
                               .open()
                               .openEdit();

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.CONTENT_LIST.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wrap({code: CMS_WIDGETS.CONTENT_LIST.code, group: 'free'}).as('widgetToRevert');

      cy.validateUrlPathname('/widget');
    });

    it('Editing widget in Settings (widget config)', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_LIST.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code)
                               .open()
                               .openSettings();
      cy.wait(['@contentsLoaded', '@contentsLoaded']);

      currentPage.getContent().getAddButtonFromTableRowWithTitle('A Modern Platform for Modern UX').click();
      currentPage.getContent().getModelIdDropdownByIndex(0).select('TCL - Search Results');
      currentPage = currentPage.getContent().confirmConfig();

      cy.wait('@pageWidgetsLoaded');
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Open Widget Details from the widget dropped', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_LIST.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code)
                               .open()
                               .openDetails();
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.CONTENT_LIST.code}`);
    });

    it('Save As Widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_LIST.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code)
                               .open()
                               .openSaveAs();

      cy.validateUrlPathname(`/page/${THE_PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_LIST.code}/rowListViewerConfig`);
      currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
      currentPage.getContent().getConfigTabConfiguration().should('exist');
      currentPage.getContent().getConfigTabConfiguration().click();
      currentPage.getContent().getFormBody().contains('Content list').should('exist');
      currentPage = currentPage.getContent().submitCloneWidget();
      cy.wrap(SAMPLE_DUPE_WIDGET_CODE).as('widgetToDelete');

      cy.validateUrlPathname(`/page/configuration/${THE_PAGE.code}`);

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
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

    // TODO: not working until the cms structure is updated
    it('select a content and a content template that is unrelated or inconsistent with the content type, then implement in Content widget. Publish the page and click on Preview/View published page', () => {
     currentPage = currentPage.getMenu().getContent().open();
     currentPage = currentPage.openTemplates();
     cy.wait(500);

     currentPage = currentPage.getContent().clickAddButton();
     cy.wait(500);

     currentPage.getContent().editFormFields({
     id: '10079',
     descr: 'Demo Faux',
     contentType: 'Banner',
     contentShape: '<article>$content.toto.text</article>',
     });

     currentPage = currentPage.getContent().submitForm();
     cy.wait(500);

     currentPage = currentPage.getMenu().getPages().open();
     currentPage = currentPage.openDesigner();

     cy.initWindowOpenChecker();

     selectPageFromSidebar();
     cy.wait(500);

     currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT, WIDGET_FRAME.frameName);

     currentPage.getContent().clickAddContentButton();
     cy.wait(4500);

     currentPage.getDialog().getBody()
     .getCheckboxFromTitle('Sample Banner').click();
     currentPage.getDialog().getConfirmButton().click();
     cy.wait(500);

     currentPage.getContent().getModelIdSelect().select('Demo Faux');
     currentPage = currentPage.getContent().confirmConfig();
     cy.wait(500);

     currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
     currentPage.getContent().publishPageDesign();
     currentPage.getContent().getPageStatus().should('match', /^Published$/);

     const viewPage = currentPage.getContent().viewPublished();
     cy.get('@windowOpen').should('be.called');
     viewPage.parent.get().should('contain', '$content.toto.text');
     });

    // TODO: not working until the cms structure is updated
    it('add a new no published content with a content type and content template, fill in all mandatory fields, save the content, then save the widget configuration', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();

      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 2, 3, 0, CMS_WIDGETS.CONTENT.code);
      cy.wait('@pageWidgetsLoaded');

      currentPage = currentPage.getContent().clickNewContentWith(NEW_CONTENT_TYPE.name);
      cy.validateUrlPathname(`/cms/content/add/${NEW_CONTENT_TYPE.code}`);

      currentPage = currentPage.getContent().addContentFromContentWidgetConfig('Unpublish En Title', 'Unpublish It Title', 'Unpublish Sample Description');
      cy.wait('@interceptedPOST').then(interception => cy.wrap([interception.response.body.payload[0].id]).as('contentsToBeDeleted'));

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      cy.wait('@pageWidgetsLoaded');

      currentPage = currentPage.getContent().confirmConfig();
      currentPage.getToastList().should('have.length', 1);
    });

    // TODO: not working until the cms structure is updated
    it('add a new content with a content type and content template, fill in all mandatory fields, save and approve, then save the configuration', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 2, 3, 0, CMS_WIDGETS.CONTENT.code);
      cy.wait('@pageWidgetsLoaded');

      currentPage = currentPage.getContent().clickNewContentWith(NEW_CONTENT_TYPE.name);
      cy.validateUrlPathname(`/cms/content/add/${NEW_CONTENT_TYPE.code}`);

      currentPage = currentPage.getContent().addContentFromContentWidgetConfig('En Title', 'It Title', 'Sample Description', true);
      cy.wait('@interceptedPOST').then(interception => cy.wrap([interception.response.body.payload[0].id]).as('contentsToBeDeleted'));

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);

      currentPage.getContent().getModelIdSelect().select('Banner - Text, Image, CTA');
      cy.wait('@pageWidgetsLoaded');
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

    it('Add all existing published OOTB contents', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();

      cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 4, 3, 0, CMS_WIDGETS.CONTENT_LIST.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      cy.wait('@pageWidgetsLoaded');
      cy.wait(['@contentsLoaded', '@contentsLoaded']);

      currentPage.getContent().getContentListTableBody().children(htmlElements.div).children(htmlElements.div).should('not.have.class', 'spinner');
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample - About Us')
                 .then(button => cy.wrap(button).click());
      currentPage.getContent().getModelIdDropdownByIndex(0).should('exist');
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Why You Need a Micro Frontend Platform for Kubernetes')
                 .then(button => cy.wrap(button).click());
      currentPage.getContent().getModelIdDropdownByIndex(1).should('exist');
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Entando and JHipster: How It Works')
                 .then(button => cy.wrap(button).click());
      currentPage.getContent().getModelIdDropdownByIndex(2).should('exist');
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample Banner')
                 .then(button => cy.wrap(button).click());
      currentPage.getContent().getModelIdDropdownByIndex(3).should('exist');
      currentPage.getContent().getAddButtonFromTableRowWithTitle('A Modern Platform for Modern UX')
                 .then(button => cy.wrap(button).click());
      currentPage.getContent().getModelIdDropdownByIndex(4).should('exist');
      currentPage.getContent().getModelIdDropdownByIndex(0).select('2-column-content');
      currentPage.getContent().getModelIdDropdownByIndex(1).select('News - Detail');
      currentPage.getContent().getModelIdDropdownByIndex(2).select('News - Detail');
      currentPage.getContent().getModelIdDropdownByIndex(3).select('Banner - Text, Image, CTA');
      currentPage.getContent().getModelIdDropdownByIndex(4).select('Banner - Text, Image, CTA');

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

    // TODO: not working until the cms structure is updated
    it('Add new existing published contents', () => {

      currentPage = currentPage.getMenu().getContent().open();
      currentPage = currentPage.openManagement();
      cy.wait('@usersLoaded');

      currentPage = currentPage.getContent().openAddContentPage(CONTENT_TYPE.name);
      currentPage = currentPage.getContent().addContent('En Title', 'It Title', 'Sample Description', true);
      cy.wait('@interceptedPOST').then(interception => cy.wrap([interception.response.body.payload[0].id]).as('contentsToBeDeleted'));
      cy.wait('@usersLoaded');
      currentPage = currentPage.getContent().openAddContentPage(CONTENT_TYPE.name);
      currentPage = currentPage.getContent().addContent('En Title 2', 'It Title 2', 'Another Content so its more than 1', true);
      cy.wait('@interceptedPOST').then(interception => {
        cy.get('@contentsToBeDeleted').then(contentID => {
          cy.wrap([contentID[0], interception.response.body.payload[0].id]).as('contentsToBeDeleted');
        })
      });
      cy.wait('@usersLoaded');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();

      selectPageFromSidebar();

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 4, 4, 0, CMS_WIDGETS.CONTENT_LIST.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME_2.frameNum}`);
      cy.wait('@pageWidgetsLoaded');
      cy.wait(['@contentsLoaded', '@contentsLoaded']);
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
      cy.wrap(WIDGET_FRAME_2.frameNum).as('widgetToRemoveFromPage');
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

    it('Basic add with widget settings', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();

      cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 3, 3, 0, CMS_WIDGETS.CONTENT_QUERY.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_QUERY.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      cy.wait('@pageWidgetsLoaded');
      currentPage.getContent().getContentTypeField().select('Banner');
      currentPage.getContent().getPublishSettingsAccordButton().click();
      currentPage.getContent().getMaxElemForItemDropdown().select('10');
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

    it('Basic edit with widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_QUERY.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code)
                               .open()
                               .openEdit();

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.CONTENT_QUERY.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wrap({code: CMS_WIDGETS.CONTENT_QUERY.code, group: 'free'}).as('widgetToRevert');

      cy.validateUrlPathname('/widget');
    });

    it('Editing widget in Settings (widget config)', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_QUERY.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code)
                               .open()
                               .openSettings();

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_QUERY.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      currentPage.getContent().getPublishSettingsAccordButton().click();
      currentPage.getContent().getMaxElemForItemDropdown().select('6');
      currentPage.getContent().getMaxTotalElemDropdown().select('10');
      currentPage = currentPage.getContent().confirmConfig();
      cy.wait('@pageWidgetsLoaded');

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Open Widget Details from the widget dropped', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_QUERY.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code)
                               .open()
                               .openDetails();
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.CONTENT_QUERY.code}`);
    });

    it('Save As Widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME.frameNum, CMS_WIDGETS.CONTENT_QUERY.code, WIDGET_CONFIG));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code)
                               .open()
                               .openSaveAs();

      cy.validateUrlPathname(`/page/${THE_PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_QUERY.code}/listViewerConfig`);
      currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
      currentPage.getContent().getConfigTabConfiguration().should('exist');
      currentPage.getContent().getConfigTabConfiguration().click();
      currentPage.getContent().getFormBody().contains(/^Publishing settings$/i).should('exist');
      currentPage = currentPage.getContent().submitCloneWidget();
      cy.wrap(SAMPLE_DUPE_WIDGET_CODE).as('widgetToDelete');

      cy.validateUrlPathname(`/page/configuration/${THE_PAGE.code}`);

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
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

    it('Basic add', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
      currentPage.getContent().dragWidgetToGrid(0, 5, 2, 0);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
      currentPage.getContent().dragWidgetToGrid(0, 6, 3, 0);

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
      cy.wrap([WIDGET_FRAME_1.frameNum, WIDGET_FRAME_2.frameNum]).as('widgetToRemoveFromPage');
    });

    it('Basic edit with CMS Search Form widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, CMS_WIDGETS.SEARCH_FORM.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_1.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.SEARCH_FORM.code)
                               .open()
                               .openEdit();

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.SEARCH_FORM.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wrap({code: CMS_WIDGETS.SEARCH_FORM.code, group: 'free'}).as('widgetToRevert');

      cy.validateUrlPathname('/widget');
    });

    it('Basic edit with CMS Search Result widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, CMS_WIDGETS.SEARCH_RESULT.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_2.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.SEARCH_RESULT.code)
                               .open()
                               .openEdit();

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.SEARCH_RESULT.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wrap({code: CMS_WIDGETS.SEARCH_RESULT.code, group: 'free'}).as('widgetToRevert');

      cy.validateUrlPathname('/widget');
    });

    it('Open Widget Details from the dropped CMS Search Form widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, CMS_WIDGETS.SEARCH_FORM.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_1.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.SEARCH_FORM.code)
                               .open()
                               .openDetails();
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.SEARCH_FORM.code}`);
    });

    it('Open Widget Details from the dropped CMS Search Results widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, CMS_WIDGETS.SEARCH_RESULT.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_2.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.SEARCH_RESULT.code)
                               .open()
                               .openDetails();
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.SEARCH_RESULT.code}`);
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

    it('Basic add', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
      currentPage.getContent().dragWidgetToGrid(0, 0, 2, 0);
      cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
      currentPage.getContent().dragWidgetToGrid(0, 1, 3, 0);

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
      cy.wrap([WIDGET_FRAME_1.frameNum, WIDGET_FRAME_2.frameNum]).as('widgetToRemoveFromPage');
    });

    it('Basic edit with News Archive widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, CMS_WIDGETS.NEWS_ARCHIVE.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_1.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.NEWS_ARCHIVE.code)
                               .open()
                               .openEdit();

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wrap({code: CMS_WIDGETS.NEWS_ARCHIVE.code, group: 'free'}).as('widgetToRevert');

      cy.validateUrlPathname('/widget');
    });

    it('Basic edit with News Latest widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, CMS_WIDGETS.NEWS_LATEST.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_2.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.NEWS_LATEST.code)
                               .open()
                               .openEdit();

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.NEWS_LATEST.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wrap({code: CMS_WIDGETS.NEWS_LATEST.code, group: 'free'}).as('widgetToRevert');

      cy.validateUrlPathname('/widget');
    });

    it('Open Widget Details from the dropped CMS News Archive widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, CMS_WIDGETS.NEWS_ARCHIVE.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_1.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.NEWS_ARCHIVE.code)
                               .open()
                               .openDetails();
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
    });

    it('Open Widget Details from the dropped CMS News Latest widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, CMS_WIDGETS.NEWS_LATEST.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_2.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.NEWS_LATEST.code)
                               .open()
                               .openDetails();
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.NEWS_LATEST.code}`);
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

    it('Basic add', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();

      currentPage.getContent().toggleSidebarWidgetSection(2);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
      currentPage.getContent().dragWidgetToGrid(2, 0, 2, 0);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
      currentPage.getContent().dragWidgetToGrid(2, 1, 3, 0);

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
      cy.wrap([WIDGET_FRAME_1.frameNum, WIDGET_FRAME_2.frameNum]).as('widgetToRemoveFromPage');
    });

    it('Basic edit with Language widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, PAGE_WIDGETS.LANGUAGE.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_1.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, PAGE_WIDGETS.LANGUAGE.code)
                               .open()
                               .openEdit();

      cy.validateUrlPathname(`/widget/edit/${PAGE_WIDGETS.LANGUAGE.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wrap({code: PAGE_WIDGETS.LANGUAGE.code, group: 'free'}).as('widgetToRevert');

      cy.validateUrlPathname('/widget');
    });

    it('Basic edit with Logo widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, PAGE_WIDGETS.LOGO.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_2.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, PAGE_WIDGETS.LOGO.code)
                               .open()
                               .openEdit();

      cy.validateUrlPathname(`/widget/edit/${PAGE_WIDGETS.LOGO.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wrap({code: PAGE_WIDGETS.LOGO.code, group: 'free'}).as('widgetToRevert');

      cy.validateUrlPathname('/widget');
    });

    it('Open Widget Details from the dropped Language widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, PAGE_WIDGETS.LANGUAGE.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_1.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, PAGE_WIDGETS.LANGUAGE.code)
                               .open()
                               .openDetails();
      cy.validateUrlPathname(`/widget/detail/${PAGE_WIDGETS.LANGUAGE.code}`);
    });

    it('Open Widget Details from the dropped Logo widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, PAGE_WIDGETS.LOGO.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_2.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, PAGE_WIDGETS.LOGO.code)
                               .open()
                               .openDetails();
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

    it('Add the Logo widget in page (config), edit the logo widget (in kebab actions) changing, in the Custom UI, the default logo\'s image with a new image (.svg/.png/.jpg)', () => {
      cy.widgetsController()
        .then((controller => controller.intercept({method: 'PUT'}, 'editedLogoWidget', `/${PAGE_WIDGETS.LOGO.code}`)));
      
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
      currentPage.getContent().toggleSidebarWidgetSection(2);
      currentPage.getContent().dragWidgetToGrid(2, 1, 2, 0);

      currentPage.getContent().publishPageDesign();

      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, PAGE_WIDGETS.LOGO.code)
                               .open()
                               .openEdit();

      currentPage.getContent().getCustomUiInput().should('not.be.empty');
      currentPage.getContent().getCustomUiInput().clear();
      currentPage.getContent().getCustomUiInput().type(CUSTOM_UI.replace(CURRENT_LOGO, CHANGE_LOGO));

      currentPage = currentPage.getContent().submitForm();

      cy.wait('@editedLogoWidget');

      cy.visit(`/${THE_PAGE.code}.page`, {portalUI: true});
      cy.get(`${htmlElements.img}[role=logo]`).should('have.attr', 'src')
                                              .should('not.include', CURRENT_LOGO)
                                              .and('include', CHANGE_LOGO);

      cy.wrap(WIDGET_FRAME_1.frameNum).as('widgetToRemoveFromPage');
      cy.wrap({code: PAGE_WIDGETS.LOGO.code, customUi: CUSTOM_UI.replaceAll('{enter}', '\n').replaceAll('{}', '')}).as('widgetToRevert');
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

    it('Basic add', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage.getContent().toggleSidebarWidgetSection(4);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
      currentPage.getContent().dragWidgetToGrid(4, 0, 2, 0);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
      currentPage.getContent().dragWidgetToGrid(4, 4, 3, 0);

      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
      cy.wrap([WIDGET_FRAME_1.frameNum, WIDGET_FRAME_2.frameNum]).as('widgetToRemoveFromPage');
    });

    it('Basic edit with APIs widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, SYSTEM_WIDGETS.APIS.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_1.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, SYSTEM_WIDGETS.APIS.code)
                               .open()
                               .openEdit();

      cy.validateUrlPathname(`/widget/edit/${SYSTEM_WIDGETS.APIS.code}`);
      currentPage.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wrap({code: SYSTEM_WIDGETS.APIS.code, group: 'free'}).as('widgetToRevert');

      cy.validateUrlPathname('/widget');
    });

    it('Basic edit with News Latest widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, SYSTEM_WIDGETS.SYS_MSGS.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_2.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, SYSTEM_WIDGETS.SYS_MSGS.code)
                               .open()
                               .openEdit();

      cy.validateUrlPathname(`/widget/edit/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
      currentPage.getContent().getGroupDropdown().find(htmlElements.input).should('have.value', 'Free Access');
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wrap({code: SYSTEM_WIDGETS.SYS_MSGS.code, group: 'free'}).as('widgetToRevert');

      cy.validateUrlPathname('/widget');
    });

    it('Open Widget Details from the dropped APIs widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_1.frameNum, SYSTEM_WIDGETS.APIS.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_1.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, SYSTEM_WIDGETS.APIS.code)
                               .open()
                               .openDetails();
      cy.validateUrlPathname(`/widget/detail/${SYSTEM_WIDGETS.APIS.code}`);
    });

    it('Open Widget Details from the dropped System Messages widget', () => {
      cy.pageWidgetsController(THE_PAGE.code)
        .then(controller => controller.addWidget(WIDGET_FRAME_2.frameNum, SYSTEM_WIDGETS.SYS_MSGS.code));
      cy.pagesController()
        .then(controller => controller.setPageStatus(THE_PAGE.code, 'published'));
      cy.wrap(WIDGET_FRAME_2.frameNum).as('widgetToRemoveFromPage');

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, SYSTEM_WIDGETS.SYS_MSGS.code)
                               .open()
                               .openDetails();
      cy.validateUrlPathname(`/widget/detail/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
    });

  });

});
