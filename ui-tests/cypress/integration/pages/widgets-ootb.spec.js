import {generateRandomId} from '../../support/utils';
import HomePage       from '../../support/pageObjects/HomePage';
import DesignerPage   from '../../support/pageObjects/pages/designer/DesignerPage';
import MFEWidgetsPage from '../../support/pageObjects/components/mfeWidgets/MFEWidgetsPage';

const {CMS_WIDGETS, SYSTEM_WIDGETS, PAGE_WIDGETS} = DesignerPage;

const SAMPLE_DUPE_WIDGET_CODE = 'mio_widget';

const THE_PAGE = {
  code: generateRandomId(),
  title: generateRandomId(),
  parentCode: 'homepage',
  ownerGroup: 'administrators',
  template: '1-column'
};

describe('Widgets Out-Of-The-Box Testing', () => {
  let currentPage;

  before(() => {
    cy.kcLogin('admin').as('tokens');
    cy.pagesController()
      .then((controller) => {
        controller.addPage(THE_PAGE.code, THE_PAGE.title, THE_PAGE.ownerGroup, THE_PAGE.template, THE_PAGE.parentCode);
        controller.setPageStatus(THE_PAGE.code, 'published');
      });
    cy.kcLogout();
  });

  beforeEach(() => {
    cy.wrap(null).as('pageToDelete');
    cy.wrap(null).as('widgetToRemoveFromPage');
    cy.wrap(null).as('widgetToDelete');
    cy.kcLogin('admin').as('tokens');
    cy.visit('/');
    currentPage = new HomePage();
  });

  afterEach(() => {
    cy.kcLogout();
  });

  after(() => {
    cy.kcLogin('admin').as('tokens');
    cy.pagesController()
      .then(controller => {
        controller.setPageStatus(THE_PAGE.code, 'draft');
        controller.deletePage(THE_PAGE.code);
      });
    cy.kcLogout();
  });

  const selectPageFromSidebar = (pageOpen = THE_PAGE) => {
    const currentPageContent = currentPage.getContent();
    currentPageContent.clickSidebarTab(1);
    cy.wait(3000);
    currentPageContent.selectPageFromSidebarPageTreeTable(pageOpen.code);
    currentPageContent.clickSidebarTab(0);
  };

  describe('CMS Content Widget', () => {

    const WIDGET_FRAME = {
      frameName: 'Frame 3',
      frameNum: 6
    };

    beforeEach(() => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);
    });

    it('Basic add with widget settings', () => {
      cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 2, 3, 0, CMS_WIDGETS.CONTENT.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      currentPage.getContent().clickAddContentButton();
      cy.wait(4500);

      currentPage.getDialog().getBody()
                  .getCheckboxFromTitle('Sample - About Us').click({force: true});
      currentPage.getDialog().getConfirmButton().click();
      cy.wait(500);

      currentPage = currentPage.getContent().confirmConfig();
      cy.wait(500);

      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Basic edit with widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code)
                                .open()
                                .openEdit();
      cy.wait(500);

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.CONTENT.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(4500);
      cy.validateUrlPathname('/widget');
    });

    it('Editing widget in Settings (widget config)', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code)
                                .open()
                                .openSettings();
      cy.wait(1000);

      currentPage.getContent().clickChangeContentButton();

      cy.wait(4500);
      currentPage.getDialog().getBody()
                  .getCheckboxFromTitle('Sample Banner').click({force: true});
      currentPage.getDialog().getConfirmButton().click();
      cy.wait(500);

      currentPage = currentPage.getContent().confirmConfig();
      cy.wait(1000);

      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Open Widget Details from the widget dropped', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code)
                                .open()
                                .openDetails();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.CONTENT.code}`);
    });

    it('Save As Widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code)
                                .open()
                                .openSaveAs();

      cy.validateUrlPathname(`/page/${THE_PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT.code}/viewerConfig`);
      currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
      currentPage.getContent().getConfigTabConfiguration().should('exist');
      currentPage.getContent().getConfigTabConfiguration().click();
      cy.wait(500);
      currentPage.getContent().getFormBody().contains('Change content').should('exist');
      currentPage = currentPage.getContent().submitCloneWidget();

      cy.wait(4500);
      cy.validateUrlPathname(`/page/configuration/${THE_PAGE.code}`);

      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Remove widget', () => {
      currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code)
                  .open()
                  .clickDelete();
      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

      cy.widgetsController()
        .then(controller => controller.deleteWidget(SAMPLE_DUPE_WIDGET_CODE));
      cy.wait(500);

      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      cy.wait(500);

      currentPage.getContent().getListArea().should('not.contain', SAMPLE_DUPE_WIDGET_CODE);

      cy.validateUrlPathname('/widget');

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          CMS_WIDGETS.CONTENT.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );
      currentPage.getContent().editFormFields({
        group: 'Free Access'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(500);
    });

  });

  describe('CMS Content List Widget', () => {

    const WIDGET_FRAME = {
      frameName: 'Frame 4',
      frameNum: 7
    };

    beforeEach(() => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);
    });

    it('Basic add with widget settings', () => {
      cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);

      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 4, 4, 0, CMS_WIDGETS.CONTENT_LIST.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      cy.wait(5000);
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample - About Us').click();
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample Banner').click();
      cy.wait(500);
      currentPage.getContent().getModelIdDropdownByIndex(0).select('2-column-content');
      currentPage.getContent().getModelIdDropdownByIndex(1).select('Banner - Text, Image, CTA');
      currentPage = currentPage.getContent().confirmConfig();

      cy.wait(500);
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Basic edit with widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code)
                                .open()
                                .openEdit();
      cy.wait(500);

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.CONTENT_LIST.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(4500);
      cy.validateUrlPathname('/widget');
    });

    it('Editing widget in Settings (widget config)', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code)
                                .open()
                                .openSettings();
      cy.wait(5000);

      currentPage.getContent().getAddButtonFromTableRowWithTitle('A Modern Platform for Modern UX').click();
      cy.wait(500);
      currentPage.getContent().getModelIdDropdownByIndex(0).select('TCL - Search Results');
      currentPage = currentPage.getContent().confirmConfig();

      cy.wait(500);
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Open Widget Details from the widget dropped', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code)
                                .open()
                                .openDetails();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.CONTENT_LIST.code}`);
    });

    it('Save As Widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code)
                                .open()
                                .openSaveAs();

      cy.validateUrlPathname(`/page/${THE_PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_LIST.code}/rowListViewerConfig`);
      currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
      currentPage.getContent().getConfigTabConfiguration().should('exist');
      currentPage.getContent().getConfigTabConfiguration().click();
      cy.wait(500);
      currentPage.getContent().getFormBody().contains('Content list').should('exist');
      currentPage = currentPage.getContent().submitCloneWidget();

      cy.wait(4500);
      cy.validateUrlPathname(`/page/configuration/${THE_PAGE.code}`);

      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Delete widget', () => {
      currentPage.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code)
                  .open()
                  .clickDelete();
      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

      cy.widgetsController()
        .then(controller => controller.deleteWidget(SAMPLE_DUPE_WIDGET_CODE));
      cy.wait(500);

      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      cy.wait(500);

      currentPage.getContent().getListArea().should('not.contain', SAMPLE_DUPE_WIDGET_CODE);

      cy.validateUrlPathname('/widget');

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          CMS_WIDGETS.CONTENT_LIST.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.CONTENT_LIST.code}`);
      currentPage.getContent().editFormFields({
        group: 'Free Access'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(500);
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

    beforeEach(() => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);
    });

    // TODO: solve on how to make cypress access sites using `cy.visit` with different ports
    // currently, Cypress is unable to access local PortalUI domain due to its web security restrictions

    /* it('select a content and a content template that is unrelated or inconsistent with the content type, then implement in Content widget. Publish the page and click on Preview/View published page', () => {
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
      }); */

    it('add a new no published content with a content type and content template, fill in all mandatory fields, save the content, then save the widget configuration', () => {
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 2, 3, 0, CMS_WIDGETS.CONTENT.code);
      cy.wait(500);

      currentPage = currentPage.getContent().clickNewContentWith(NEW_CONTENT_TYPE.name);
      cy.validateUrlPathname(`/cms/content/add/${NEW_CONTENT_TYPE.code}`);

      currentPage = currentPage.getContent().addContentFromContentWidgetConfig('Unpublish En Title', 'Unpublish It Title', 'Unpublish Sample Description');
      cy.wait(500);
      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      cy.wait(4500);

      currentPage = currentPage.getContent().confirmConfig();
      cy.wait(500);
      currentPage.getToastList().should('have.length', 1);
    });

    it('add a new content with a content type and content template, fill in all mandatory fields, save and approve, then save the configuration', () => {
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 2, 3, 0, CMS_WIDGETS.CONTENT.code);
      cy.wait(500);

      currentPage = currentPage.getContent().clickNewContentWith(NEW_CONTENT_TYPE.name);
      cy.validateUrlPathname(`/cms/content/add/${NEW_CONTENT_TYPE.code}`);

      currentPage = currentPage.getContent().addContentFromContentWidgetConfig('En Title', 'It Title', 'Sample Description', true);
      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);

      currentPage.getContent().getModelIdSelect().select('Banner - Text, Image, CTA');
      currentPage = currentPage.getContent().confirmConfig();
      cy.wait(500);

      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('cleanup test contents', () => {
      currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT.code)
                  .open()
                  .clickDelete();
      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

      currentPage = currentPage.getMenu().getContent().open();
      currentPage = currentPage.openManagement();
      cy.wait(500);
      currentPage = currentPage.getContent().unpublishLastAddedContent();
      currentPage = currentPage.getContent().deleteLastAddedContent();
      currentPage = currentPage.getContent().deleteLastAddedContent();
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

    it('Add all existing published OOTB contents', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 4, 3, 0, CMS_WIDGETS.CONTENT_LIST.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      cy.wait(5000);
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample - About Us').click();
      cy.wait(500);
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Why You Need a Micro Frontend Platform for Kubernetes').click();
      cy.wait(500);
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Entando and JHipster: How It Works').click();
      cy.wait(500);
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample Banner').click();
      cy.wait(500);
      currentPage.getContent().getAddButtonFromTableRowWithTitle('A Modern Platform for Modern UX').click();
      cy.wait(500);
      currentPage.getContent().getModelIdDropdownByIndex(0).select('2-column-content');
      currentPage.getContent().getModelIdDropdownByIndex(1).select('News - Detail');
      currentPage.getContent().getModelIdDropdownByIndex(2).select('News - Detail');
      currentPage.getContent().getModelIdDropdownByIndex(3).select('Banner - Text, Image, CTA');
      currentPage.getContent().getModelIdDropdownByIndex(4).select('Banner - Text, Image, CTA');

      currentPage = currentPage.getContent().confirmConfig();

      cy.wait(500);
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Add new existing published contents', () => {

      currentPage = currentPage.getMenu().getContent().open();
      currentPage = currentPage.openManagement();

      currentPage = currentPage.getContent().openAddContentPage();
      currentPage = currentPage.getContent().addContent('En Title', 'It Title', 'Sample Description', true);

      currentPage = currentPage.getContent().openAddContentPage();
      currentPage = currentPage.getContent().addContent('En Title 2', 'It Title 2', 'Another Content so its more than 1', true);

      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();

      selectPageFromSidebar();
      cy.wait(500);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 4, 4, 0, CMS_WIDGETS.CONTENT_LIST.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME_2.frameNum}`);
      cy.wait(5000);
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Another Content so its more than 1').click();
      cy.wait(500);
      currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample Description').click();
      cy.wait(500);
      currentPage.getContent().getModelIdDropdownByIndex(0).select('Banner - Text, Image, CTA');
      currentPage.getContent().getModelIdDropdownByIndex(1).select('Banner - Text, Image, CTA');

      currentPage = currentPage.getContent().confirmConfig();

      cy.wait(500);
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Test widget cleanup', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);

      currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_LIST.code)
                  .open()
                  .clickDelete();
      currentPage.getContent().getDesignerGridFrameKebabMenu(4, 0, CMS_WIDGETS.CONTENT_LIST.code)
                  .open()
                  .clickDelete();
      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

      currentPage = currentPage.getMenu().getContent().open();
      currentPage = currentPage.openManagement();
      cy.wait(500);

      currentPage = currentPage.getContent().unpublishLastAddedContent();
      currentPage = currentPage.getContent().deleteLastAddedContent();
      currentPage = currentPage.getContent().unpublishLastAddedContent();
      currentPage = currentPage.getContent().deleteLastAddedContent();
    });

  });

  describe('CMS Content Search Query Widget', () => {

    const WIDGET_FRAME = {
      frameName: 'Frame 3',
      frameNum: 6
    };

    beforeEach(() => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);
    });

    it('Basic add with widget settings', () => {
      cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
      currentPage = currentPage.getContent().dragConfigurableWidgetToGrid(0, 3, 3, 0, CMS_WIDGETS.CONTENT_QUERY.code);

      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_QUERY.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      currentPage.getContent().getContentTypeField().select('Banner');
      cy.wait(2500);
      currentPage.getContent().getPublishSettingsAccordButton().click();
      cy.wait(500);
      currentPage.getContent().getMaxElemForItemDropdown().select('10');
      currentPage = currentPage.getContent().confirmConfig();

      cy.wait(500);
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Basic edit with widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code)
                                .open()
                                .openEdit();
      cy.wait(500);

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.CONTENT_QUERY.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(4500);
      cy.validateUrlPathname('/widget');
    });

    it('Editing widget in Settings (widget config)', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code)
                                .open()
                                .openSettings();

      cy.wait(2500);
      cy.validateUrlPathname(`/widget/config/${CMS_WIDGETS.CONTENT_QUERY.code}/page/${THE_PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
      currentPage.getContent().getPublishSettingsAccordButton().click();
      cy.wait(500);
      currentPage.getContent().getMaxElemForItemDropdown().select('6');
      currentPage.getContent().getMaxTotalElemDropdown().select('10');
      currentPage = currentPage.getContent().confirmConfig();

      cy.wait(500);
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Open Widget Details from the widget dropped', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code)
                                .open()
                                .openDetails();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.CONTENT_QUERY.code}`);
    });

    it('Save As Widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code)
                                .open()
                                .openSaveAs();

      cy.validateUrlPathname(`/page/${THE_PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_QUERY.code}/listViewerConfig`);
      currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
      currentPage.getContent().getConfigTabConfiguration().should('exist');
      currentPage.getContent().getConfigTabConfiguration().click();
      cy.wait(500);
      currentPage.getContent().getFormBody().contains(/^Publishing settings$/i).should('exist');
      currentPage = currentPage.getContent().submitCloneWidget();

      cy.wait(4500);
      cy.validateUrlPathname(`/page/configuration/${THE_PAGE.code}`);

      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Test widget cleanup', () => {
      currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.CONTENT_QUERY.code)
                  .open()
                  .clickDelete();
      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      cy.wait(500);

      currentPage.getContent().openKebabMenuByWidgetCode(
          SAMPLE_DUPE_WIDGET_CODE,
          MFEWidgetsPage.WIDGET_ACTIONS.DELETE
      );
      currentPage.getDialog().getConfirmButton().click();
      currentPage.getContent().getListArea().should('not.contain', SAMPLE_DUPE_WIDGET_CODE);


      cy.validateUrlPathname('/widget');

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          CMS_WIDGETS.CONTENT_QUERY.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.CONTENT_QUERY.code}`);
      currentPage.getContent().editFormFields({
        group: 'Free Access'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(2500);
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

    beforeEach(() => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);
    });

    it('Basic add', () => {
      cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
      currentPage.getContent().dragWidgetToGrid(0, 5, 2, 0);
      cy.wait(500);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
      currentPage.getContent().dragWidgetToGrid(0, 6, 3, 0);
      cy.wait(500);

      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Basic edit with CMS Search Form widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.SEARCH_FORM.code)
                                .open()
                                .openEdit();
      cy.wait(500);

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.SEARCH_FORM.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(4500);
      cy.validateUrlPathname('/widget');
    });

    it('Basic edit with CMS Search Result widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.SEARCH_RESULT.code)
                                .open()
                                .openEdit();
      cy.wait(500);

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.SEARCH_RESULT.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(4500);
      cy.validateUrlPathname('/widget');
    });

    it('Open Widget Details from the dropped CMS Search Form widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.SEARCH_FORM.code)
                                .open()
                                .openDetails();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.SEARCH_FORM.code}`);
    });

    it('Open Widget Details from the dropped CMS Search Results widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.SEARCH_RESULT.code)
                                .open()
                                .openDetails();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.SEARCH_RESULT.code}`);
    });

    it('Test widget cleanup', () => {
      currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.SEARCH_FORM.code)
                  .open()
                  .clickDelete();
      currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.SEARCH_RESULT.code)
                  .open()
                  .clickDelete();

      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      cy.wait(500);

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          CMS_WIDGETS.SEARCH_FORM.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.SEARCH_FORM.code}`);
      currentPage.getContent().editFormFields({
        group: 'Free Access'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(1500);

      cy.validateUrlPathname('/widget');

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          CMS_WIDGETS.SEARCH_RESULT.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.SEARCH_RESULT.code}`);
      currentPage.getContent().editFormFields({
        group: 'Free Access'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(1500);
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

    beforeEach(() => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);
    });

    it('Basic add', () => {
      cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
      currentPage.getContent().dragWidgetToGrid(0, 0, 2, 0);
      cy.wait(500);
      cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
      currentPage.getContent().dragWidgetToGrid(0, 1, 3, 0);
      cy.wait(500);

      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Basic edit with News Archive widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.NEWS_ARCHIVE.code)
                                .open()
                                .openEdit();
      cy.wait(500);

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(4500);
      cy.validateUrlPathname('/widget');
    });

    it('Basic edit with News Latest widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.NEWS_LATEST.code)
                                .open()
                                .openEdit();
      cy.wait(500);

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.NEWS_LATEST.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(4500);
      cy.validateUrlPathname('/widget');
    });

    it('Open Widget Details from the dropped CMS News Archive widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.NEWS_ARCHIVE.code)
                                .open()
                                .openDetails();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
    });

    it('Open Widget Details from the dropped CMS News Latest widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.NEWS_LATEST.code)
                                .open()
                                .openDetails();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/detail/${CMS_WIDGETS.NEWS_LATEST.code}`);
    });

    it('Test widget cleanup', () => {
      currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, CMS_WIDGETS.NEWS_ARCHIVE.code)
                  .open()
                  .clickDelete();
      currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, CMS_WIDGETS.NEWS_LATEST.code)
                  .open()
                  .clickDelete();

      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      cy.wait(500);

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          CMS_WIDGETS.NEWS_ARCHIVE.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
      currentPage.getContent().editFormFields({
        group: 'Free Access'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(1500);

      cy.validateUrlPathname('/widget');

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          CMS_WIDGETS.NEWS_LATEST.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );

      cy.validateUrlPathname(`/widget/edit/${CMS_WIDGETS.NEWS_LATEST.code}`);
      currentPage.getContent().editFormFields({
        group: 'Free Access'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(1500);
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

    beforeEach(() => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);
    });

    it('Basic add', () => {
      currentPage.getContent().toggleSidebarWidgetSection(2);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
      currentPage.getContent().dragWidgetToGrid(2, 0, 2, 0);
      cy.wait(500);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
      currentPage.getContent().dragWidgetToGrid(2, 1, 3, 0);
      cy.wait(500);

      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Basic edit with Language widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, PAGE_WIDGETS.LANGUAGE.code)
                                .open()
                                .openEdit();
      cy.wait(500);

      cy.validateUrlPathname(`/widget/edit/${PAGE_WIDGETS.LANGUAGE.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(4500);
      cy.validateUrlPathname('/widget');
    });

    it('Basic edit with Logo widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, PAGE_WIDGETS.LOGO.code)
                                .open()
                                .openEdit();
      cy.wait(500);

      cy.validateUrlPathname(`/widget/edit/${PAGE_WIDGETS.LOGO.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(4500);
      cy.validateUrlPathname('/widget');
    });

    it('Open Widget Details from the dropped Language widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, PAGE_WIDGETS.LANGUAGE.code)
                                .open()
                                .openDetails();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/detail/${PAGE_WIDGETS.LANGUAGE.code}`);
    });

    it('Open Widget Details from the dropped Logo widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, PAGE_WIDGETS.LOGO.code)
                                .open()
                                .openDetails();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/detail/${PAGE_WIDGETS.LOGO.code}`);
    });

    it('Test widget cleanup', () => {
      currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, PAGE_WIDGETS.LANGUAGE.code)
                  .open()
                  .clickDelete();
      currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, PAGE_WIDGETS.LOGO.code)
                  .open()
                  .clickDelete();

      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      cy.wait(500);

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          PAGE_WIDGETS.LANGUAGE.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );

      cy.validateUrlPathname(`/widget/edit/${PAGE_WIDGETS.LANGUAGE.code}`);
      currentPage.getContent().editFormFields({
        group: 'Free Access'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(1500);

      cy.validateUrlPathname('/widget');

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          PAGE_WIDGETS.LOGO.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );

      cy.validateUrlPathname(`/widget/edit/${PAGE_WIDGETS.LOGO.code}`);
      currentPage.getContent().editFormFields({
        group: 'Free Access'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(1500);
    });

  });

  describe('Page Widgets - Logo - Extended', () => {
    const WIDGET_FRAME_1 = {
      frameName: 'Frame 2',
      frameNum: 5
    };
    const CUSTOM_UI = '<#assign wp=JspTaglibs["/aps-core"]>{enter}{enter}\
<@wp.info key="systemParam" paramName="applicationBaseURL" var="appUrl" />{enter}\
<img src="${{}appUrl{}}resources/static/img/Entando_light.svg" aria-label="Entando" alt="Logo" role="logo" />';
    
    const CURRENT_LOGO = 'Entando_light.svg';
    const CHANGE_LOGO = 'entando-logo_badge.png';

    beforeEach(() => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);
    });

    it('Add the Logo widget in page (config), edit the logo widget (in kebab actions) changing, in the Custom UI, the default logo\'s image with a new image (.svg/.png/.jpg)', () => {
      cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
      currentPage.getContent().dragWidgetToFrame(PAGE_WIDGETS.LOGO, WIDGET_FRAME_1.frameName);
      cy.wait(500);

      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

      currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
      currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, PAGE_WIDGETS.LOGO);
      cy.wait(500);

      currentPage.getContent().getCustomUiInput().clear();
      currentPage.getContent().getCustomUiInput().type(CUSTOM_UI.replace(CURRENT_LOGO, CHANGE_LOGO));
      cy.wait(500);

      currentPage = currentPage.getContent().submitForm();
      cy.wait(1000);

      // TODO - add view published scenario to check the change of logo
    });

    it('Revert', () => {
      currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
      currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, PAGE_WIDGETS.LOGO);
      
      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      cy.wait(500);

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          PAGE_WIDGETS.LOGO.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );
      cy.wait(500);

      currentPage.getContent().getCustomUiInput().clear();
      currentPage.getContent().getCustomUiInput().type(CUSTOM_UI);
      cy.wait(500);

      currentPage = currentPage.getContent().submitForm();
      cy.wait(1500);
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

    beforeEach(() => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);
    });

    it('Basic add', () => {
      currentPage.getContent().toggleSidebarWidgetSection(4);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
      currentPage.getContent().dragWidgetToGrid(4, 0, 2, 0);
      cy.wait(500);

      cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
      currentPage.getContent().dragWidgetToGrid(4, 4, 3, 0);
      cy.wait(500);

      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Basic edit with APIs widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, SYSTEM_WIDGETS.APIS.code)
                                .open()
                                .openEdit();
      cy.wait(500);

      cy.validateUrlPathname(`/widget/edit/${SYSTEM_WIDGETS.APIS.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(4500);
      cy.validateUrlPathname('/widget');
    });

    it('Basic edit with News Latest widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, SYSTEM_WIDGETS.SYS_MSGS.code)
                                .open()
                                .openEdit();
      cy.wait(500);

      cy.validateUrlPathname(`/widget/edit/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
      currentPage.getContent().editFormFields({
        group: 'Administrator'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(4500);
      cy.validateUrlPathname('/widget');
    });

    it('Open Widget Details from the dropped APIs widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, SYSTEM_WIDGETS.APIS.code)
                                .open()
                                .openDetails();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/detail/${SYSTEM_WIDGETS.APIS.code}`);
    });

    it('Open Widget Details from the dropped System Messages widget', () => {
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, SYSTEM_WIDGETS.SYS_MSGS.code)
                                .open()
                                .openDetails();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/detail/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
    });

    it('Test widget cleanup', () => {
      currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, SYSTEM_WIDGETS.APIS.code)
                  .open()
                  .clickDelete();
      currentPage.getContent().getDesignerGridFrameKebabMenu(3, 0, SYSTEM_WIDGETS.SYS_MSGS.code)
                  .open()
                  .clickDelete();

      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      cy.wait(500);

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          SYSTEM_WIDGETS.APIS.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );

      cy.validateUrlPathname(`/widget/edit/${SYSTEM_WIDGETS.APIS.code}`);
      currentPage.getContent().editFormFields({
        group: 'Free Access'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(1500);

      cy.validateUrlPathname('/widget');

      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          SYSTEM_WIDGETS.SYS_MSGS.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT
      );

      cy.validateUrlPathname(`/widget/edit/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
      currentPage.getContent().editFormFields({
        group: 'Free Access'
      });
      currentPage = currentPage.getContent().submitForm();

      cy.wait(1500);
    });

  });

});
