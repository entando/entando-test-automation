import HomePage       from '../../support/pageObjects/HomePage';
import MFEWidgetsPage from '../../support/pageObjects/components/mfeWidgets/MFEWidgetsPage';

const {WIDGET_ACTIONS} = MFEWidgetsPage;

const SAMPLE_BASIC_WIDGET_ID  = 'my_widget';

const SAMPLE_WIDGET_NAMES = ['My Widget', 'Your Widget', 'Our Widget'];

const SAMPLE_BASIC_WIDGET = {
  code: SAMPLE_BASIC_WIDGET_ID,
  titles: {
    en: SAMPLE_WIDGET_NAMES[0],
    it: SAMPLE_WIDGET_NAMES[0],
  },
  group: 'administrators',
  configUi: null,
  icon: 'font-awesome:fa-arrow-right',
  customUi: '<h1>Just a basic widget</h1>',
};

const FRAMENUM = 5;

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

  before(() => {
    cy.kcLogin('admin').as('tokens');
    cy.pagesController()
      .then(controller => {
        controller.addPage(DEMOPAGE.code, DEMOPAGE.title, 'administrators', '1-column', 'homepage');
        controller.setPageStatus(DEMOPAGE.code, 'published');
      });
    cy.kcLogout();
  });

  beforeEach(() => {
    cy.wrap(null).as('widgetToRemoveFromPage');
    cy.wrap(null).as('widgetToDelete');
    cy.kcLogin('admin').as('tokens');
    cy.visit('/');
    currentPage = new HomePage();
  });

  afterEach(() => {
    cy.get('@widgetToRemoveFromPage').then(widgetToRemoveFromPage => {
      if (widgetToRemoveFromPage !== null) {
        const deleteWidgetFromPage = (widgetCode) => {
          cy.widgetInstanceController(DEMOPAGE.code)
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
          .then(controller => controller.setPageStatus(DEMOPAGE.code, 'published'));
      }
    });
    cy.get('@widgetToDelete').then((widgetToDelete) => {
      if (widgetToDelete !== null) {
        cy.widgetsController()
          .then(controller => controller.deleteWidget(widgetToDelete));
      }
    });
    cy.kcLogout();
  });

  after(() => {
    cy.kcLogin('admin').as('tokens');
    cy.pagesController()
      .then(controller => {
        controller.setPageStatus(DEMOPAGE.code, 'draft');
        controller.deletePage(DEMOPAGE.code);
      });
    cy.kcLogout();
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
      cy.wrap(SAMPLE_BASIC_WIDGET_ID).as('widgetToDelete');
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

  describe('Edit widget', () => {
    beforeEach(() => {
      cy.widgetsController()
            .then(controller => controller.addWidget(SAMPLE_BASIC_WIDGET));
      cy.wrap(SAMPLE_BASIC_WIDGET_ID).as('widgetToDelete');
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
      cy.widgetsController()
            .then(controller => controller.addWidget(SAMPLE_BASIC_WIDGET));
      cy.wrap(SAMPLE_BASIC_WIDGET_ID).as('widgetToDelete');
      cy.widgetInstanceController(DEMOPAGE.code)
            .then(controller => controller.addWidget(FRAMENUM, SAMPLE_BASIC_WIDGET_ID));
      cy.wrap(FRAMENUM).as('widgetToRemoveFromPage');
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
        name: SAMPLE_WIDGET_NAMES[1],
        group: 'Free Access',
        iconChoose
      });
      currentPage = currentPage.getContent().submitForm();
      cy.wait(3000);
      cy.validateUrlPathname('/widget');
      currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[1]);
    });
  });

  describe('Delete widget with reference', () => {
    it('Attempt to delete the widget with reference to a published page', () => {
      cy.widgetsController()
            .then(controller => controller.addWidget(SAMPLE_BASIC_WIDGET));
      cy.wrap(SAMPLE_BASIC_WIDGET_ID).as('widgetToDelete');
      cy.widgetInstanceController(DEMOPAGE.code)
            .then(controller => controller.addWidget(FRAMENUM, SAMPLE_BASIC_WIDGET_ID));
      cy.pagesController()
            .then(controller => controller.setPageStatus(DEMOPAGE.code, 'published'));
      cy.wrap(FRAMENUM).as('widgetToRemoveFromPage');
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);
      currentPage.getDialog().getConfirmButton().click();
      currentPage.getToastList().should('contain', `The Widget ${SAMPLE_BASIC_WIDGET_ID} cannot be deleted because it is used into pages`);
    });

    it('Attempt to delete the widget with reference to an unpublished page', () => {
      cy.log('set the page to unpublished first');
      cy.widgetsController()
            .then(controller => controller.addWidget(SAMPLE_BASIC_WIDGET));
      cy.wrap(SAMPLE_BASIC_WIDGET_ID).as('widgetToDelete');
      cy.widgetInstanceController(DEMOPAGE.code)
            .then(controller => controller.addWidget(FRAMENUM, SAMPLE_BASIC_WIDGET_ID));
      cy.wrap(FRAMENUM).as('widgetToRemoveFromPage');
      cy.wait(500);
  
      cy.log('now attempt to delete the widget');  
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);
  
      currentPage.getDialog().getConfirmButton().click();
      currentPage.getToastList().should('contain', `The Widget ${SAMPLE_BASIC_WIDGET_ID} cannot be deleted because it is used into pages`);
    });

    it('Delete a user widget', () => {
      cy.widgetsController()
            .then(controller => controller.addWidget(SAMPLE_BASIC_WIDGET));  
      currentPage = currentPage.getMenu().getComponents().open();
      currentPage = currentPage.openMFE_Widgets();
      currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);
  
      currentPage.getDialog().getConfirmButton().click();
      currentPage.getContent().getListArea().should('not.contain', SAMPLE_BASIC_WIDGET_ID);
    });
  });
});
