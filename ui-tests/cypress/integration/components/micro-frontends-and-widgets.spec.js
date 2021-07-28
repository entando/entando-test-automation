import HomePage from '../../support/pageObjects/HomePage';
import DesignerPage   from '../../support/pageObjects/pages/designer/DesignerPage';
import MFEWidgetsPage from '../../support/pageObjects/components/mfeWidgets/MFEWidgetsPage';

const { CMS_WIDGETS, SYSTEM_WIDGETS, PAGE_WIDGETS } = DesignerPage;
const { WIDGET_ACTIONS } = MFEWidgetsPage;

const SAMPLE_BASIC_WIDGET_ID  = 'my_widget';
const SAMPLE_DUPE_WIDGET_CODE = 'mio_widget';

const SAMPLE_WIDGET_NAMES = ['My Widget', 'Your Widget', 'Our Widget'];

const PAGE = {
  title: 'My Homepage',
  code: 'my_homepage'
};

describe('Microfrontends and Widgets', () => {
  let currentPage;

  afterEach(() => {
    cy.kcLogout();
  });

  const selectPageFromSidebar = (pageOpen = PAGE) => {
    const currentPageContent = currentPage.getContent();
    currentPageContent.getSidebarTab('Page Tree').click();
    cy.wait(3000);
    currentPageContent.getPageTreeItem(pageOpen.title).click();
    currentPageContent.getSidebarTab('Widgets').click();
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
        customUi: 'a',
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
        iconUpload: 'icon/Entando.svg',
        customUi: '<h2>memecode</h2>',
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
        iconChoose: 'fa-android',
      });
      currentPage.getContent().submitContinueForm();
      cy.location('pathname').should('not.eq', '/widget');
      cy.validateUrlChanged(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      cy.wait(500);
      currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[1]);

      cy.log('Widget setup - add new widget to page');
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);

      currentPage.getContent().dragWidgetToFrame({
        code: SAMPLE_BASIC_WIDGET_ID,
        name: SAMPLE_WIDGET_NAMES[1],
      }, WIDGET_FRAME);
      currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatus().should('match', /^Published$/);
    });

    it('Editing a used widget via widget list modifying all mandatory fields', () => {
      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.EDIT);
      cy.wait(500);
      cy.validateUrlChanged(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      currentPage.getContent().editFormFields({
        iconUpload: 'icon/Entando.svg',
        name: SAMPLE_WIDGET_NAMES[2],
        group: 'Administrators',
      });
      currentPage = currentPage.getContent().submitForm();
      cy.validateUrlChanged('/widget');
      currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[2]);
    });

    it('Editing a used widget via page designer modifying all mandatory fields', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);
      currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME);
      currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, {
        code: SAMPLE_BASIC_WIDGET_ID,
        name: SAMPLE_WIDGET_NAMES[2],
      });
      cy.wait(500);
      cy.validateUrlChanged(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      currentPage.getContent().editFormFields({
        name: SAMPLE_WIDGET_NAMES[0],
        group: 'Free Access',
        iconChoose: 'fa-android',
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wait(3000);
      cy.validateUrlChanged('/widget');
      currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[0]);
    });

    it('Delete the widget we just made', () => {
      cy.log('Widget cleanup - temporary');
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar();
      cy.wait(500);

      currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME);
      currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DELETE, {
        code: SAMPLE_BASIC_WIDGET_ID,
        name: SAMPLE_WIDGET_NAMES[0],
      });
      currentPage.getContent().publishPageDesign();
      cy.wait(1000);

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
        frameNum: 6,
      };
    
      it('Basic add with widget settings', () => {
        selectPageFromSidebar();
        cy.wait(500);
    
        cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT, WIDGET_FRAME.frameName);
    
        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT.code}/page/${PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
        currentPage.getContent().clickAddContentButton();
        cy.wait(3000);
    
        currentPage.getDialog().getBody()
          .getCheckboxFromTitle('Sample - About Us').click({ force: true });
        currentPage.getDialog().getConfirmButton().click();
        cy.wait(500);
    
        currentPage = currentPage.getContent().confirmConfig();
        cy.wait(500);
    
        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
      });
    
      it('Basic edit with widget', () => {
        selectPageFromSidebar();
        cy.wait(500);
    
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.CONTENT);
        cy.wait(500);
        
        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator',
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
          .getCheckboxFromTitle('Sample Banner').click({ force: true });
        currentPage.getDialog().getConfirmButton().click();
        cy.wait(500);
        
        currentPage = currentPage.getContent().confirmConfig();
        cy.wait(500);
    
        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
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
    
        cy.validateUrlChanged(`/page/${PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT.code}/viewerConfig`);
        currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
        currentPage.getContent().getConfigTabConfiguration().should('exist');
        currentPage.getContent().getConfigTabConfiguration().click();
        cy.wait(500);
        currentPage.getContent().getFormBody().contains('Change content').should('exist');
        currentPage = currentPage.getContent().submitCloneWidget();
    
        cy.wait(4500);
        cy.validateUrlChanged(`/page/configuration/${PAGE.code}`);
    
        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
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
          MFEWidgetsPage.WIDGET_ACTIONS.DELETE,
        );
        currentPage.getDialog().getConfirmButton().click();
        currentPage.getContent().getListArea().should('not.contain', SAMPLE_DUPE_WIDGET_CODE);

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          CMS_WIDGETS.CONTENT.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT,
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access',
        });
        currentPage = currentPage.getContent().submitForm();
    
        cy.wait(2500);
      });
    });
    
    describe('CMS Content List Widget', () => {
      const WIDGET_FRAME = {
        frameName: 'Frame 4',
        frameNum: 7,
      };
    
      it('Basic add with widget settings', () => {
        selectPageFromSidebar();
        cy.wait(500);
    
        cy.log(`Add the widget to the page in ${WIDGET_FRAME.frameName}`);
        currentPage = currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.CONTENT_LIST, WIDGET_FRAME.frameName);
    
        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT_LIST.code}/page/${PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
        cy.wait(5000);
        currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample - About Us').click();
        currentPage.getContent().getAddButtonFromTableRowWithTitle('Sample Banner').click();
        cy.wait(500);
        currentPage.getContent().getModelIdDropdownByIndex(0).select('2-column-content');
        currentPage.getContent().getModelIdDropdownByIndex(1).select('Banner - Text, Image, CTA');
        currentPage = currentPage.getContent().confirmConfig();
    
        cy.wait(500);
        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
      });
    
      it('Basic edit with widget', () => {
        selectPageFromSidebar();
        cy.wait(500);
    
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.CONTENT_LIST);
        cy.wait(500);
        
        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT_LIST.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator',
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
        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
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
    
        cy.validateUrlChanged(`/page/${PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_LIST.code}/rowListViewerConfig`);
        currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
        currentPage.getContent().getConfigTabConfiguration().should('exist');
        currentPage.getContent().getConfigTabConfiguration().click();
        cy.wait(500);
        currentPage.getContent().getFormBody().contains('Content list').should('exist');
        currentPage = currentPage.getContent().submitCloneWidget();
    
        cy.wait(4500);
        cy.validateUrlChanged(`/page/configuration/${PAGE.code}`);
    
        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
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
          MFEWidgetsPage.WIDGET_ACTIONS.DELETE,
        );
        currentPage.getDialog().getConfirmButton().click();
        currentPage.getContent().getListArea().should('not.contain', SAMPLE_DUPE_WIDGET_CODE);

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          CMS_WIDGETS.CONTENT_LIST.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT,
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT_LIST.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access',
        });
        currentPage = currentPage.getContent().submitForm();
    
        cy.wait(2500);
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

        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT_QUERY.code}/page/${PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
        currentPage.getContent().getContentTypeField().select('Banner');
        cy.wait(2500);
        currentPage.getContent().getPublishSettingsAccordButton().click();
        cy.wait(500);
        currentPage.getContent().getMaxElemForItemDropdown().select('10');
        currentPage = currentPage.getContent().confirmConfig();

        cy.wait(500);
        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
      });

      it('Basic edit with widget', () => {
        selectPageFromSidebar();
        cy.wait(500);
    
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.CONTENT_QUERY);
        cy.wait(500);
        
        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT_QUERY.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator',
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
        cy.validateUrlChanged(`/widget/config/${CMS_WIDGETS.CONTENT_QUERY.code}/page/${PAGE.code}/frame/${WIDGET_FRAME.frameNum}`);
        currentPage.getContent().getPublishSettingsAccordButton().click();
        cy.wait(500);
        currentPage.getContent().getMaxElemForItemDropdown().select('6');
        currentPage.getContent().getMaxTotalElemDropdown().select('10');
        currentPage = currentPage.getContent().confirmConfig();

        cy.wait(500);
        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
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

        cy.validateUrlChanged(`/page/${PAGE.code}/clone/${WIDGET_FRAME.frameNum}/widget/${CMS_WIDGETS.CONTENT_QUERY.code}/listViewerConfig`);
        currentPage.getContent().fillWidgetForm('Mio Widget', SAMPLE_DUPE_WIDGET_CODE, '', 'Free Access');
        currentPage.getContent().getConfigTabConfiguration().should('exist');
        currentPage.getContent().getConfigTabConfiguration().click();
        cy.wait(500);
        currentPage.getContent().getFormBody().contains(/^Publishing settings$/i).should('exist');
        currentPage = currentPage.getContent().submitCloneWidget();

        cy.wait(4500);
        cy.validateUrlChanged(`/page/configuration/${PAGE.code}`);

        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
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
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT,
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.CONTENT_QUERY.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access',
        });
        currentPage = currentPage.getContent().submitForm();
    
        cy.wait(2500);
      });
    });

    describe('CMS Search Form and Search Results Widgets', () => {
      const THE_PAGE = {
        title: 'Sitemap',
        code: 'sitemap'
      };

      const WIDGET_FRAME_1 = {
        frameName: 'Frame 2',
        frameNum: 5
      };

      const WIDGET_FRAME_2 = {
        frameName: 'Frame 3',
        frameNum: 6
      };

      it('Basic add', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.SEARCH_FORM, WIDGET_FRAME_1.frameName);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.SEARCH_RESULT, WIDGET_FRAME_2.frameName);
        cy.wait(500);

        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
      });

      it('Basic edit with CMS Search Form widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);
    
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.SEARCH_FORM);
        cy.wait(500);
        
        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.SEARCH_FORM.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator',
        });
        currentPage = currentPage.getContent().submitForm();
    
        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });
    
      it('Basic edit with CMS Search Result widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);
    
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.SEARCH_RESULT);
        cy.wait(500);
        
        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.SEARCH_RESULT.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator',
        });
        currentPage = currentPage.getContent().submitForm();
    
        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Open Widget Details from the dropped CMS Search Form widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.SEARCH_FORM);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.SEARCH_FORM.code}`);
      });

      it('Open Widget Details from the dropped CMS Search Results widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.SEARCH_RESULT);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.SEARCH_RESULT.code}`);
      });

      it('Test widget cleanup', () => {
        selectPageFromSidebar(THE_PAGE);
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
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT,
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.SEARCH_FORM.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access',
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(1500);

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          CMS_WIDGETS.SEARCH_RESULT.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT,
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.SEARCH_RESULT.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access',
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(1500);
      });
    });

    describe('CMS News Archive and News Latest Widgets', () => {
      const THE_PAGE = {
        title: 'Sitemap',
        code: 'sitemap'
      };

      const WIDGET_FRAME_1 = {
        frameName: 'Frame 2',
        frameNum: 5
      };

      const WIDGET_FRAME_2 = {
        frameName: 'Frame 3',
        frameNum: 6
      };

      it('Basic add', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.NEWS_ARCHIVE, WIDGET_FRAME_1.frameName);
        cy.wait(500);
        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(CMS_WIDGETS.NEWS_LATEST, WIDGET_FRAME_2.frameName);
        cy.wait(500);

        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
      });

      it('Basic edit with News Archive widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);
    
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.NEWS_ARCHIVE);
        cy.wait(500);
        
        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator',
        });
        currentPage = currentPage.getContent().submitForm();
    
        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Basic edit with News Latest widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);
    
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, CMS_WIDGETS.NEWS_LATEST);
        cy.wait(500);
        
        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.NEWS_LATEST.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator',
        });
        currentPage = currentPage.getContent().submitForm();
    
        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Open Widget Details from the dropped CMS News Archive widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.NEWS_ARCHIVE);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
      });

      it('Open Widget Details from the dropped CMS News Latest widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, CMS_WIDGETS.NEWS_LATEST);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${CMS_WIDGETS.NEWS_LATEST.code}`);
      });

      it('Test widget cleanup', () => {
        selectPageFromSidebar(THE_PAGE);
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
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT,
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.NEWS_ARCHIVE.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access',
        });
        currentPage = currentPage.getContent().submitForm();
    
        cy.wait(1500);

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          CMS_WIDGETS.NEWS_LATEST.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT,
        );

        cy.validateUrlChanged(`/widget/edit/${CMS_WIDGETS.NEWS_LATEST.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access',
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(1500);
      });
    });

    describe('Page Widgets - Language and Logo', () => {
      const THE_PAGE = {
        title: 'Sitemap',
        code: 'sitemap'
      };

      const WIDGET_FRAME_1 = {
        frameName: 'Frame 2',
        frameNum: 5
      };

      const WIDGET_FRAME_2 = {
        frameName: 'Frame 3',
        frameNum: 6
      };

      it('Basic add', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(PAGE_WIDGETS.LANGUAGE, WIDGET_FRAME_1.frameName);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(PAGE_WIDGETS.LOGO, WIDGET_FRAME_2.frameName);
        cy.wait(500);

        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
      });

      it('Basic edit with Language widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);
    
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, PAGE_WIDGETS.LANGUAGE);
        cy.wait(500);
        
        cy.validateUrlChanged(`/widget/edit/${PAGE_WIDGETS.LANGUAGE.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator',
        });
        currentPage = currentPage.getContent().submitForm();
    
        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });
    
      it('Basic edit with Logo widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);
    
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, PAGE_WIDGETS.LOGO);
        cy.wait(500);
        
        cy.validateUrlChanged(`/widget/edit/${PAGE_WIDGETS.LOGO.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator',
        });
        currentPage = currentPage.getContent().submitForm();
    
        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Open Widget Details from the dropped Language widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, PAGE_WIDGETS.LANGUAGE);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${PAGE_WIDGETS.LANGUAGE.code}`);
      });

      it('Open Widget Details from the dropped Logo widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, PAGE_WIDGETS.LOGO);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${PAGE_WIDGETS.LOGO.code}`);
      });

      it('Test widget cleanup', () => {
        selectPageFromSidebar(THE_PAGE);
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
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT,
        );

        cy.validateUrlChanged(`/widget/edit/${PAGE_WIDGETS.LANGUAGE.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access',
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(1500);

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          PAGE_WIDGETS.LOGO.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT,
        );

        cy.validateUrlChanged(`/widget/edit/${PAGE_WIDGETS.LOGO.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access',
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(1500);
      });
    });

    describe('System Widgets - APIs and System Messages', () => {
      const THE_PAGE = {
        title: 'Sitemap',
        code: 'sitemap'
      };

      const WIDGET_FRAME_1 = {
        frameName: 'Frame 2',
        frameNum: 5
      };

      const WIDGET_FRAME_2 = {
        frameName: 'Frame 3',
        frameNum: 6
      };

      it('Basic add', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_1.frameName}`);
        currentPage.getContent().dragWidgetToFrame(SYSTEM_WIDGETS.APIS, WIDGET_FRAME_1.frameName);
        cy.wait(500);

        cy.log(`Add the widget to the page in ${WIDGET_FRAME_2.frameName}`);
        currentPage.getContent().dragWidgetToFrame(SYSTEM_WIDGETS.SYS_MSGS, WIDGET_FRAME_2.frameName);
        cy.wait(500);

        currentPage.getContent().getPageStatus().should('match', /^Published, with pending changes$/);
        currentPage.getContent().publishPageDesign();
        currentPage.getContent().getPageStatus().should('match', /^Published$/);
      });

      it('Basic edit with APIs widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);
      
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, SYSTEM_WIDGETS.APIS);
        cy.wait(500);
        
        cy.validateUrlChanged(`/widget/edit/${SYSTEM_WIDGETS.APIS.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator',
        });
        currentPage = currentPage.getContent().submitForm();
      
        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });
      
      it('Basic edit with News Latest widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);
      
        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage = currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.EDIT, SYSTEM_WIDGETS.SYS_MSGS);
        cy.wait(500);
        
        cy.validateUrlChanged(`/widget/edit/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
        currentPage.getContent().editFormFields({
          group: 'Administrator',
        });
        currentPage = currentPage.getContent().submitForm();
      
        cy.wait(4500);
        cy.validateUrlChanged('/widget');
      });

      it('Open Widget Details from the dropped APIs widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_1.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, SYSTEM_WIDGETS.APIS);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${SYSTEM_WIDGETS.APIS.code}`);
      });

      it('Open Widget Details from the dropped System Messages widget', () => {
        selectPageFromSidebar(THE_PAGE);
        cy.wait(500);

        currentPage.getContent().openKebabMenuByFrame(WIDGET_FRAME_2.frameName);
        currentPage.getContent().clickActionOnFrame(DesignerPage.FRAME_ACTIONS.DETAILS, SYSTEM_WIDGETS.SYS_MSGS);
        cy.wait(500);
        cy.validateUrlChanged(`/widget/detail/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
      });

      it('Test widget cleanup', () => {
        selectPageFromSidebar(THE_PAGE);
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
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT,
        );

        cy.validateUrlChanged(`/widget/edit/${SYSTEM_WIDGETS.APIS.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access',
        });
        currentPage = currentPage.getContent().submitForm();
    
        cy.wait(1500);

        cy.validateUrlChanged('/widget');

        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(
          SYSTEM_WIDGETS.SYS_MSGS.code,
          MFEWidgetsPage.WIDGET_ACTIONS.EDIT,
        );

        cy.validateUrlChanged(`/widget/edit/${SYSTEM_WIDGETS.SYS_MSGS.code}`);
        currentPage.getContent().editFormFields({
          group: 'Free Access',
        });
        currentPage = currentPage.getContent().submitForm();

        cy.wait(1500);
      });
    });
  });
});
