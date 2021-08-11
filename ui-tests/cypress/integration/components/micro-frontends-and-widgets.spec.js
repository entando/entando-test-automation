import HomePage       from '../../support/pageObjects/HomePage';
import DesignerPage   from '../../support/pageObjects/pages/designer/DesignerPage';
import MFEWidgetsPage from '../../support/pageObjects/components/mfeWidgets/MFEWidgetsPage';

const {CMS_WIDGETS, SYSTEM_WIDGETS, PAGE_WIDGETS} = DesignerPage;
const {WIDGET_ACTIONS}                            = MFEWidgetsPage;

const SAMPLE_BASIC_WIDGET_ID  = 'my_widget';
const SAMPLE_DUPE_WIDGET_CODE = 'mio_widget';

const SAMPLE_WIDGET_NAMES = ['My Widget', 'Your Widget', 'Our Widget'];

const HOMEPAGE = {
  title: 'My Homepage',
  code: 'my_homepage'
};

const SITEMAP = {
  title: 'Sitemap',
  code: 'sitemap'
};

const DEMOPAGE = {
  title: 'Demo page',
  code: 'demopage'
};

const iconChoose = 'fa-android';
const iconUpload = 'icon/Entando.svg';

describe('Microfrontends and Widgets', () => {
  let currentPage;

  afterEach(() => {
    cy.kcLogout();
  });

  const selectPageFromSidebar = (pageOpen = HOMEPAGE) => {
    const currentPageContent = currentPage.getContent();
    currentPageContent.clickSidebarTab(1);
    cy.wait(3000);
    currentPageContent.getPageTreeItem(pageOpen.title).click();
    currentPageContent.clickSidebarTab(0);
  };

  describe('Widgets CRUD', () => {
    const WIDGET_FRAME = 'Frame 3';
    beforeEach(() => {
      cy.kcLogin('admin').as('tokens');

      cy.visit('/');
      currentPage = new HomePage();
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
    });

    it('Adding a basic widget with icon', () => {
      currentPage = currentPage.getContent().openAddWidgetForm();
      cy.validateUrlChanged('/widget/add');
      cy.wait(500);
      currentPage.getContent().fillWidgetForm(SAMPLE_WIDGET_NAMES[0], SAMPLE_BASIC_WIDGET_ID);
      currentPage = currentPage.getContent().submitForm();
      cy.validateUrlChanged('/widget');
      currentPage.getContent().getListArea().should('contain', SAMPLE_BASIC_WIDGET_ID);
    });

    it('Add a widget with existing code widget', () => {
      currentPage = currentPage.getContent().openAddWidgetForm();
      cy.validateUrlChanged('/widget/add');
      cy.wait(500);
      currentPage.getContent().fillWidgetForm(SAMPLE_WIDGET_NAMES[0], 'content_viewer');
      currentPage.getContent().submitForm();
      cy.location('pathname').should('not.eq', '/widget');
      currentPage.getToastList().should('contain', 'The Widget content_viewer already exists');
    });

    it('Add a widget with invalid code', () => {
      currentPage = currentPage.getContent().openAddWidgetForm();
      cy.validateUrlChanged('/widget/add');
      cy.wait(500);
      currentPage.getContent().editFormFields({
        code: 'momaco@',
        customUi: 'a'
      });
      currentPage.getContent().getCodeInput().closest('div.form-group').invoke('attr', 'class').should('contain', 'has-error');
      currentPage.getContent().getCodeInput().next().invoke('attr', 'class').should('contain', 'help-block');
    });

    it('Add a widget without choosing group and title', () => {
      currentPage = currentPage.getContent().openAddWidgetForm();
      cy.validateUrlChanged('/widget/add');
      cy.wait(500);
      currentPage.getContent().editFormFields({
        code: 'momaco',
        iconUpload,
        customUi: '<h2>memecode</h2>'
      });
      currentPage.getContent().getSaveDropdownButton().click();
      currentPage.getContent().getRegularSaveButton().closest('li').invoke('attr', 'class').should('contain', 'disabled');
    });

    it('Editing the widget modifying all mandatory fields', () => {
      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.EDIT);
      cy.wait(500);
      cy.validateUrlChanged(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      currentPage.getContent().editFormFields({
        name: SAMPLE_WIDGET_NAMES[1],
        group: 'Free Access',
        iconChoose
      });
      currentPage.getContent().submitContinueForm();
      cy.location('pathname').should('not.eq', '/widget');
      cy.validateUrlChanged(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      cy.wait(500);
      currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[1]);
    });

    it('Prerequisite - widget setup for the new user widget', () => {
      cy.log('Widget setup - create sample page');
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openManagement();
      cy.wait(500);
      currentPage = currentPage.getContent().openAddPagePage();
      currentPage.getContent().fillRequiredData(
          DEMOPAGE.title,
          DEMOPAGE.title,
          DEMOPAGE.code,
          0,
          '1-2-column'
      );
      currentPage = currentPage.getContent().clickSaveButton();
      cy.wait(1000);

      cy.log('Widget setup - add new widget to page');
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar(DEMOPAGE);
      cy.wait(500);

      currentPage.getContent().dragWidgetToFrame({
        code: SAMPLE_BASIC_WIDGET_ID,
        name: SAMPLE_WIDGET_NAMES[1]
      }, WIDGET_FRAME);
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--draft')
                 .and('have.attr', 'title').should('eq', 'Published, with pending changes');
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                 .should('have.class', 'PageStatusIcon--published')
                 .and('have.attr', 'title').should('eq', 'Published');
    });

    it('Editing a used widget via widget list modifying all mandatory fields', () => {
      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.EDIT);
      cy.wait(500);
      cy.validateUrlChanged(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      currentPage.getContent().editFormFields({
        iconUpload,
        name: SAMPLE_WIDGET_NAMES[2],
        group: 'Administrators'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.validateUrlChanged('/widget');
      currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[2]);
    });

    it('Editing a used widget via page designer modifying all mandatory fields', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar(DEMOPAGE);
      cy.wait(500);
      currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME);
      currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, {
        code: SAMPLE_BASIC_WIDGET_ID,
        name: SAMPLE_WIDGET_NAMES[2]
      });
      cy.wait(500);
      cy.validateUrlChanged(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      currentPage.getContent().editFormFields({
        name: SAMPLE_WIDGET_NAMES[0],
        group: 'Free Access',
        iconChoose
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wait(3000);
      cy.validateUrlChanged('/widget');
      currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[0]);
    });

    it('Attempt to delete the widget with reference to a published page', () => {
      currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);

      currentPage.getDialog().getConfirmButton().click();
      currentPage.getToastList().should('contain', `The Widget ${SAMPLE_BASIC_WIDGET_ID} cannot be deleted because it is used into pages`);
    });

    it('Attempt to delete the widget with reference to an unpublished page', () => {
      cy.log('set the page to unpublished first');
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openManagement();
      currentPage.getContent().getKebabMenu(DEMOPAGE.code).open().clickPublish();
      currentPage.getDialog().getConfirmButton().click();

      cy.log('now attempt to delete the widget');
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();

      currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);

      currentPage.getDialog().getConfirmButton().click();
      currentPage.getToastList().should('contain', `The Widget ${SAMPLE_BASIC_WIDGET_ID} cannot be deleted because it is used into pages`);
    });

    it('Delete a user widget', () => {
      cy.log('delete the page');
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openManagement();
      currentPage.getContent().getKebabMenu(DEMOPAGE.code).open().clickDelete();
      currentPage.getDialog().getConfirmButton().click();

      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();

      currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);

      currentPage.getDialog().getConfirmButton().click();
      currentPage.getContent().getListArea().should('not.contain', SAMPLE_BASIC_WIDGET_ID);
    });
  });

  describe('Widget Usages', () => {

    beforeEach(() => {
      cy.kcLogin('admin').as('tokens');

      cy.visit('/');
      currentPage = new HomePage();
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
    });

    describe('CMS Content Widget', () => {
      const WIDGET_FRAME = {
        frameName: 'Frame 3',
        frameNum: 6
      };

      it('Basic add with widget settings', () => {
        selectPageFromSidebar();
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT, WIDGET_FRAME.frameName);

        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${HOMEPAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
        currentPage.getContent().clickAddContentButton();
        cy.wait(3000);

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
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.CONTENT);
        cy.wait(500);

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Editing widget in Settings (widget config)', () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.SETTINGS, CMS_WIDGETS.CONTENT);
        cy.wait(500);

        currentPage.getContent().clickChangeContentButton();

        cy.wait(4500);
        currentPage.getDialog().getBody()
                   .getCheckboxFromTitle('Sample Banner').click({force: true});
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

      it('Open Widget Details from the widget dropped', () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.CONTENT);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.CONTENT.code}`);
      });

      it('Save As Widget', () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.SAVE_AS, CMS_WIDGETS.CONTENT);

        cy.validateUrlChanged(`/page/${HOMEPAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT.code}/viewerConfig`);
        currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
        currentPage.getContent().getConfigTabConfiguration().should('exist');
        currentPage.getContent().getConfigTabConfiguration().click();
        cy.wait(500);
        currentPage.getContent().getFormBody().contains('Change content').should('exist');
        currentPage = currentPage.getContent().submitCloneWidget();

        cy.wait(4500);
        cy.validateUrlChanged(`/page/configuration/${HOMEPAGE.code}`);

        currentPage.getContent().getPageStatusIcon()
                   .should('have.class', 'PageStatusIcon--draft')
                   .and('have.attr', 'title').should('eq', 'Published, with pending changes');
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatusIcon()
                   .should('have.class', 'PageStatusIcon--published')
                   .and('have.attr', 'title').should('eq', 'Published');
      });

      it('Test widget cleanup', () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.CONTENT);
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

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
            CMS_WIDGETS.CONTENT.code,
            MFEWidgetsPage.WIDGET_ACTIONS.EDIT
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(2500);
      });
    });

    describe('CMS Content List Widget', () => {
      const WIDGET_FRAME = {
        frameName: 'Frame 4',
        frameNum: 7
      };

      it('Basic add with widget settings', () => {
        selectPageFromSidebar();
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT_LIST, WIDGET_FRAME.frameName);

        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${HOMEPAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
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
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.CONTENT_LIST);
        cy.wait(500);

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT_LIST.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Editing widget in Settings (widget config)', () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.SETTINGS, CMS_WIDGETS.CONTENT_LIST);
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
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.CONTENT_LIST);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.CONTENT_LIST.code}`);
      });

      it('Save As Widget', () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.SAVE_AS, CMS_WIDGETS.CONTENT_LIST);

        cy.validateUrlChanged(`/page/${HOMEPAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_LIST.code}/rowListViewerConfig`);
        currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
        currentPage.getContent().getConfigTabConfiguration().should('exist');
        currentPage.getContent().getConfigTabConfiguration().click();
        cy.wait(500);
        currentPage.getContent().getFormBody().contains('Content list').should('exist');
        currentPage = currentPage.getContent().submitCloneWidget();

        cy.wait(4500);
        cy.validateUrlChanged(`/page/configuration/${HOMEPAGE.code}`);

        currentPage.getContent().getPageStatusIcon()
                   .should('have.class', 'PageStatusIcon--draft')
                   .and('have.attr', 'title').should('eq', 'Published, with pending changes');
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatusIcon()
                   .should('have.class', 'PageStatusIcon--published')
                   .and('have.attr', 'title').should('eq', 'Published');
      });

      it('Test widget cleanup', () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.CONTENT_LIST);
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

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
            CMS_WIDGETS.CONTENT_LIST.code,
            MFEWidgetsPage.WIDGET_ACTIONS.EDIT
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT_LIST.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(2500);
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
        selectPageFromSidebar();
        cy.wait(500);

        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT, WIDGET_FRAME.frameName);
        cy.wait(500);

        currentPage = currentPage.getContent().clickNewContentWith(NEW_CONTENT_TYPE.name);
        cy.validateUrlChanged(`/cms/content/add/${NEW_CONTENT_TYPE.code}`);

        currentPage = currentPage.getContent().addContentFromContentWidgetConfig('Unpublish En Title', 'Unpublish It Title', 'Unpublish Sample Description');
        cy.wait(500);
        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${HOMEPAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
        cy.wait(4500);

        currentPage = currentPage.getContent().confirmConfig();
        cy.wait(500);
        currentPage.getToastList().should('have.length', 1);
      });

      it('add a new content with a content type and content template, fill in all mandatory fields, save and approve, then save the configuration', () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT, WIDGET_FRAME.frameName);
        cy.wait(500);

        currentPage = currentPage.getContent().clickNewContentWith(NEW_CONTENT_TYPE.name);
        cy.validateUrlChanged(`/cms/content/add/${NEW_CONTENT_TYPE.code}`);

        currentPage = currentPage.getContent().addContentFromContentWidgetConfig('En Title', 'It Title', 'Sample Description', true);
        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${HOMEPAGE.code}/frame/${WIDGET_FRAME.frameNum}`);

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
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.CONTENT);
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
        selectPageFromSidebar();
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT_LIST, WIDGET_FRAME.frameName);

        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${HOMEPAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
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
        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT_LIST, WIDGET_FRAME_2.frameName);

        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${HOMEPAGE.code}/frame/${WIDGET_FRAME_2.frameNum}`);
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
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.CONTENT_LIST);
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.CONTENT_LIST);
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

      it('Basic add with widget settings', () => {
        selectPageFromSidebar();
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT_QUERY, WIDGET_FRAME.frameName);

        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT_QUERY.code}/page/${HOMEPAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
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
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.CONTENT_QUERY);
        cy.wait(500);

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT_QUERY.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Editing widget in Settings (widget config)', () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.SETTINGS, CMS_WIDGETS.CONTENT_QUERY);

        cy.wait(2500);
        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT_QUERY.code}/page/${HOMEPAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
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
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.CONTENT_QUERY);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.CONTENT_QUERY.code}`);
      });

      it('Save As Widget', () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.SAVE_AS, CMS_WIDGETS.CONTENT_QUERY);

        cy.validateUrlChanged(`/page/${HOMEPAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_QUERY.code}/listViewerConfig`);
        currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
        currentPage.getContent().getConfigTabConfiguration().should('exist');
        currentPage.getContent().getConfigTabConfiguration().click();
        cy.wait(500);
        currentPage.getContent().getFormBody().contains(/^Publishing settings$/i).should('exist');
        currentPage = currentPage.getContent().submitCloneWidget();

        cy.wait(4500);
        cy.validateUrlChanged(`/page/configuration/${HOMEPAGE.code}`);

        currentPage.getContent().getPageStatusIcon()
                   .should('have.class', 'PageStatusIcon--draft')
                   .and('have.attr', 'title').should('eq', 'Published, with pending changes');
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatusIcon()
                   .should('have.class', 'PageStatusIcon--published')
                   .and('have.attr', 'title').should('eq', 'Published');
      });

      it('Test widget cleanup', () => {
        selectPageFromSidebar();
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.CONTENT_QUERY);
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


        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
            CMS_WIDGETS.CONTENT_QUERY.code,
            MFEWidgetsPage.WIDGET_ACTIONS.EDIT
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT_QUERY.code}`);
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

      it('Basic add', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.SEARCH_FORM, WIDGET_FRAME_1.frameName);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.SEARCH_RESULT, WIDGET_FRAME_2.frameName);
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
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.SEARCH_FORM);
        cy.wait(500);

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.SEARCH_FORM.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Basic edit with CMS Search Result widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.SEARCH_RESULT);
        cy.wait(500);

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.SEARCH_RESULT.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Open Widget Details from the dropped CMS Search Form widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.SEARCH_FORM);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.SEARCH_FORM.code}`);
      });

      it('Open Widget Details from the dropped CMS Search Results widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.SEARCH_RESULT);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.SEARCH_RESULT.code}`);
      });

      it('Test widget cleanup', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.SEARCH_FORM);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.SEARCH_RESULT);

        currentPage.getContent().publishPageDesign();
        cy.wait(1000);

        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
        cy.wait(500);

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
            CMS_WIDGETS.SEARCH_FORM.code,
            MFEWidgetsPage.WIDGET_ACTIONS.EDIT
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.SEARCH_FORM.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(1500);

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
            CMS_WIDGETS.SEARCH_RESULT.code,
            MFEWidgetsPage.WIDGET_ACTIONS.EDIT
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.SEARCH_RESULT.code}`);
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

      it('Basic add', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.NEWS_ARCHIVE, WIDGET_FRAME_1.frameName);
        cy.wait(500);
        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.NEWS_LATEST, WIDGET_FRAME_2.frameName);
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
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.NEWS_ARCHIVE);
        cy.wait(500);

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Basic edit with News Latest widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.NEWS_LATEST);
        cy.wait(500);

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.NEWS_LATEST.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Open Widget Details from the dropped CMS News Archive widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.NEWS_ARCHIVE);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
      });

      it('Open Widget Details from the dropped CMS News Latest widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.NEWS_LATEST);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.NEWS_LATEST.code}`);
      });

      it('Test widget cleanup', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.NEWS_ARCHIVE);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, CMS_WIDGETS.NEWS_LATEST);

        currentPage.getContent().publishPageDesign();
        cy.wait(1000);

        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
        cy.wait(500);

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
            CMS_WIDGETS.NEWS_ARCHIVE.code,
            MFEWidgetsPage.WIDGET_ACTIONS.EDIT
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(1500);

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
            CMS_WIDGETS.NEWS_LATEST.code,
            MFEWidgetsPage.WIDGET_ACTIONS.EDIT
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.NEWS_LATEST.code}`);
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

      it('Basic add', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(PAGE_WIDGETS.LANGUAGE, WIDGET_FRAME_1.frameName);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(PAGE_WIDGETS.LOGO, WIDGET_FRAME_2.frameName);
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
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, PAGE_WIDGETS.LANGUAGE);
        cy.wait(500);

        cy.validateUrlChanged(`/widget/edit/${PAGE_WIDGETS.LANGUAGE.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Basic edit with Logo widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, PAGE_WIDGETS.LOGO);
        cy.wait(500);

        cy.validateUrlChanged(`/widget/edit/${PAGE_WIDGETS.LOGO.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Open Widget Details from the dropped Language widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, PAGE_WIDGETS.LANGUAGE);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${PAGE_WIDGETS.LANGUAGE.code}`);
      });

      it('Open Widget Details from the dropped Logo widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, PAGE_WIDGETS.LOGO);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${PAGE_WIDGETS.LOGO.code}`);
      });

      it('Test widget cleanup', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, PAGE_WIDGETS.LANGUAGE);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, PAGE_WIDGETS.LOGO);

        currentPage.getContent().publishPageDesign();
        cy.wait(1000);

        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
        cy.wait(500);

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
            PAGE_WIDGETS.LANGUAGE.code,
            MFEWidgetsPage.WIDGET_ACTIONS.EDIT
        );

        cy.validateUrlChanged(`/widget/edit/${PAGE_WIDGETS.LANGUAGE.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(1500);

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
            PAGE_WIDGETS.LOGO.code,
            MFEWidgetsPage.WIDGET_ACTIONS.EDIT
        );

        cy.validateUrlChanged(`/widget/edit/${PAGE_WIDGETS.LOGO.code}`);
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

      it('Add the Logo widget in page (config), edit the logo widget (in kebab actions) changing, in the Custom UI, the default logo\'s image with a new image (.svg/.png/.jpg)', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

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
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

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

      it('Basic add', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(SYSTEM_WIDGETS.APIS, WIDGET_FRAME_1.frameName);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(SYSTEM_WIDGETS.SYS_MSGS, WIDGET_FRAME_2.frameName);
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
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, SYSTEM_WIDGETS.APIS);
        cy.wait(500);

        cy.validateUrlChanged(`/widget/edit/${SYSTEM_WIDGETS.APIS.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Basic edit with News Latest widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, SYSTEM_WIDGETS.SYS_MSGS);
        cy.wait(500);

        cy.validateUrlChanged(`/widget/edit/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Open Widget Details from the dropped APIs widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, SYSTEM_WIDGETS.APIS);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${SYSTEM_WIDGETS.APIS.code}`);
      });

      it('Open Widget Details from the dropped System Messages widget', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, SYSTEM_WIDGETS.SYS_MSGS);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
      });

      it('Test widget cleanup', () => {
        selectPageFromSidebar(SITEMAP);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, SYSTEM_WIDGETS.APIS);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, SYSTEM_WIDGETS.SYS_MSGS);

        currentPage.getContent().publishPageDesign();
        cy.wait(1000);

        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
        cy.wait(500);

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
            SYSTEM_WIDGETS.APIS.code,
            MFEWidgetsPage.WIDGET_ACTIONS.EDIT
        );

        cy.validateUrlChanged(`/widget/edit/${SYSTEM_WIDGETS.APIS.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(1500);

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
            SYSTEM_WIDGETS.SYS_MSGS.code,
            MFEWidgetsPage.WIDGET_ACTIONS.EDIT
        );

        cy.validateUrlChanged(`/widget/edit/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access'
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(1500);
      });
    });
  });
});
