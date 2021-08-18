import HomePage       from '../../support/pageObjects/HomePage';
import MFEWidgetsPage from '../../support/pageObjects/components/mfeWidgets/MFEWidgetsPage';

const {WIDGET_ACTIONS} = MFEWidgetsPage;

const SAMPLE_BASIC_WIDGET_ID  = 'my_widget';

const SAMPLE_WIDGET_NAMES = ['My Widget', 'Your Widget', 'Our Widget'];

const HOMEPAGE = {
  title: 'My Homepage',
  code: 'my_homepage'
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

  beforeEach(() => {
    cy.kcLogin('admin').as('tokens');
    cy.visit('/');
    currentPage = new HomePage();
  });

  const selectPageFromSidebar = (pageOpen = HOMEPAGE) => {
    const currentPageContent = currentPage.getContent();
    currentPageContent.clickSidebarTab(1);
    cy.wait(3000);
    currentPageContent.selectPageFromSidebarPageTreeTable(pageOpen.code);
    currentPageContent.clickSidebarTab(0);
  };

  describe('Create New Widget', () => {
    beforeEach(() => {
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      currentPage = currentPage.getContent().openAddWidgetForm();
      cy.wait(500);
    })

    it('Adding a basic widget with icon', () => {
      cy.validateUrlPathname('/widget/add');
      currentPage.getContent().fillWidgetForm(SAMPLE_WIDGET_NAMES[0], SAMPLE_BASIC_WIDGET_ID);
      currentPage = currentPage.getContent().submitForm();
      cy.validateUrlPathname('/widget');
      currentPage.getContent().getListArea().should('contain', SAMPLE_BASIC_WIDGET_ID);
    });

    it('Add a widget with existing code widget', () => {
      currentPage.getContent().fillWidgetForm(SAMPLE_WIDGET_NAMES[0], 'content_viewer');
      currentPage.getContent().submitForm();
      cy.location('pathname').should('not.eq', '/widget');
      currentPage.getToastList().should('contain', 'The Widget content_viewer already exists');
    });

    it('Add a widget with invalid code', () => {
      currentPage.getContent().editFormFields({
        code: 'momaco@',
        customUi: 'a'
      });
      currentPage.getContent().getCodeInput().closest('div.form-group').invoke('attr', 'class').should('contain', 'has-error');
      currentPage.getContent().getCodeInput().next().invoke('attr', 'class').should('contain', 'help-block');
    });

    it('Add a widget without choosing group and title', () => {
      currentPage.getContent().editFormFields({
        code: 'momaco',
        iconUpload,
        customUi: '<h2>memecode</h2>'
      });
      currentPage.getContent().getSaveDropdownButton().click();
      currentPage.getContent().getRegularSaveButton().closest('li').invoke('attr', 'class').should('contain', 'disabled');
    });
  });

  describe('Prerequisite for edit widget', () => {
    it('Widget setup for the new user widget', () => {
      cy.log('Widget setup - create sample page');
      cy.pagesController()
        .then(controller => controller.addPage(DEMOPAGE.code, DEMOPAGE.title, 'administrators', '1-2-column', 'homepage'));
      cy.wait(500);

      cy.log('Widget setup - add new widget to page');
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar(DEMOPAGE);
      cy.wait(500);

      currentPage.getContent().toggleSidebarWidgetSection(5);
      currentPage.getContent().dragWidgetToGrid(5, 0, 2, 0);
      currentPage.getContent().getPageStatusIcon()
      currentPage.getContent().publishPageDesign();
      currentPage.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
    });
  });

  describe('Edit widget', () => {
    beforeEach(() => {
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
    })

    it('Editing widget by modifying all mandatory fields', () => {
      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.EDIT);
      cy.wait(500);
      cy.validateUrlPathname(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      currentPage.getContent().editFormFields({
        name: SAMPLE_WIDGET_NAMES[1],
        group: 'Free Access',
        iconChoose
      });
      currentPage.getContent().submitContinueForm();
      cy.location('pathname').should('not.eq', '/widget');
      cy.validateUrlPathname(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      cy.wait(500);
      currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[1]);
    });

    it('Editing a used widget via widget list modifying all mandatory fields', () => {
      currentPage = currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.EDIT);
      cy.wait(500);
      cy.validateUrlPathname(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      currentPage.getContent().editFormFields({
        iconUpload,
        name: SAMPLE_WIDGET_NAMES[2],
        group: 'Administrators'
      });
      currentPage = currentPage.getContent().submitForm();
      cy.validateUrlPathname('/widget');
      currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[2]);
    });
  });

  describe('Editing via different section', () => {
    it('Editing a used widget via page designer modifying all mandatory fields', () => {
      currentPage = currentPage.getMenu().getPages().open();
      currentPage = currentPage.openDesigner();
      selectPageFromSidebar(DEMOPAGE);
      cy.wait(500);
      currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, SAMPLE_BASIC_WIDGET_ID)
                                .open()
                                .openEdit();
      cy.wait(500);
      cy.validateUrlPathname(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
      currentPage.getContent().editFormFields({
        name: SAMPLE_WIDGET_NAMES[0],
        group: 'Free Access',
        iconChoose
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wait(3000);
      cy.validateUrlPathname('/widget');
      currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[0]);
    });
  });

  describe('Delete widget with reference', () => {
    beforeEach(() => {
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
    });

    it('Attempt to delete the widget with reference to a published page', () => {
      currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);
      currentPage.getDialog().getConfirmButton().click();
      currentPage.getToastList().should('contain', `The Widget ${SAMPLE_BASIC_WIDGET_ID} cannot be deleted because it is used into pages`);
    });

    it('Attempt to delete the widget with reference to an unpublished page', () => {
      cy.log('set the page to unpublished first');
      cy.pagesController().then(controller => {
        controller.setPageStatus(DEMOPAGE.code, 'draft');
      });
      cy.wait(500);
  
      cy.log('now attempt to delete the widget');  
      currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);
  
      currentPage.getDialog().getConfirmButton().click();
      currentPage.getToastList().should('contain', `The Widget ${SAMPLE_BASIC_WIDGET_ID} cannot be deleted because it is used into pages`);
    });

    it('Delete a user widget', () => {
      cy.log('delete the page');
      cy.pagesController().then(controller => {
        controller.deletePage(DEMOPAGE.code);
      });
      cy.wait(500);
  
      currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);
  
      currentPage.getDialog().getConfirmButton().click();
      currentPage.getContent().getListArea().should('not.contain', SAMPLE_BASIC_WIDGET_ID);
    });
  });
});
