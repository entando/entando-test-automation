import HomePage           from '../../support/pageObjects/HomePage';
import MFEWidgetsPage     from '../../support/pageObjects/components/mfeWidgets/MFEWidgetsPage';
import {generateRandomId} from '../../support/utils';
import {htmlElements}     from '../../support/pageObjects/WebElement';

describe([Tag.GTS], 'Microfrontends and Widgets', () => {

  let currentPage;

  describe('Main functionalities', () => {

    before(() => {
      cy.kcAPILogin();
      cy.seoPagesController()
        .then(controller => controller.addNewPage(DEMOPAGE));
      cy.pagesController()
        .then(controller => controller.setPageStatus(DEMOPAGE.code, 'published'));
    });

    beforeEach(() => {
      cy.wrap(null).as('widgetsToBeRemovedFromPage');
      cy.wrap(null).as('widgetToBeDelete');
      cy.kcAPILogin();
      cy.kcUILogin('login/admin');
      currentPage = new HomePage();
    });

    afterEach(() => {
      cy.get('@widgetsToBeRemovedFromPage').then(widgets => {
        if (widgets !== null) {
          const deleteWidgetFromPage = (widgetCode) => {
            cy.pageWidgetsController(DEMOPAGE.code).then(controller => controller.deleteWidget(widgetCode));
          };
          if (Array.isArray(widgets)) {
            widgets.forEach(widgetCode => deleteWidgetFromPage(widgetCode));
          } else {
            deleteWidgetFromPage(widgets);
          }
          cy.pagesController()
            .then(controller => controller.setPageStatus(DEMOPAGE.code, 'published'));
        }
      });
      cy.get('@widgetToBeDelete').then(widget => {
        if (widget !== null) {
          cy.widgetsController().then(controller => controller.deleteWidget(widget));
        }
      });
      cy.kcUILogout();
    });

    after(() => {
      cy.kcAPILogin();
      cy.pagesController()
        .then(controller => {
          controller.setPageStatus(DEMOPAGE.code, 'draft');
          controller.deletePage(DEMOPAGE.code);
        });
    });

    describe('Create New Widget', () => {

      beforeEach(() => {
        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
        currentPage = currentPage.getContent().openAddWidgetForm();
      });

      it('Adding a basic widget with icon', () => {
        cy.validateUrlPathname('/widget/add');
        currentPage.getContent().fillWidgetForm(SAMPLE_WIDGET_NAMES[0], SAMPLE_BASIC_WIDGET_ID);
        currentPage = currentPage.getContent().submitForm();
        cy.validateUrlPathname('/widget');
        currentPage.getContent().getListArea().should('contain', SAMPLE_BASIC_WIDGET_ID);
        cy.wrap(SAMPLE_BASIC_WIDGET_ID).as('widgetToBeDelete');
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
        currentPage.getContent().getCodeInput().parent().next().invoke('attr', 'class').should('contain', 'help-block');
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
        cy.widgetsController().then(controller => controller.addWidget(SAMPLE_BASIC_WIDGET));
        cy.wrap(SAMPLE_BASIC_WIDGET_ID).as('widgetToBeDelete');
        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
      });

      it('Editing widget by modifying all mandatory fields', () => {
        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.EDIT);
        cy.validateUrlPathname(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
        currentPage.getContent().getTitleInput().should('have.value', SAMPLE_BASIC_WIDGET.titles.en);
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
        currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[1]);
      });

      it('Editing a used widget via widget list modifying all mandatory fields', () => {
        currentPage = currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.EDIT);
        cy.validateUrlPathname(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
        currentPage.getContent().getTitleInput().should('have.value', SAMPLE_BASIC_WIDGET.titles.en);
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

      beforeEach(() => {
        cy.pagesController()
          .then((controller => controller.intercept({method: 'GET'}, 'sidebarLoaded', '/homepage/widgets?status=published')));
        cy.pagesController()
          .then((controller => controller.intercept({method: 'GET'}, 'pageWidgetsLoaded', `/${DEMOPAGE.code}/widgets?status=published`)));
      });

      it('Editing a used widget via page designer modifying all mandatory fields', () => {
        cy.widgetsController().then(controller => controller.addWidget(SAMPLE_BASIC_WIDGET));
        cy.wrap(SAMPLE_BASIC_WIDGET_ID).as('widgetToBeDelete');
        cy.pageWidgetsController(DEMOPAGE.code).then(controller => controller.addWidget(FRAMENUM, SAMPLE_BASIC_WIDGET_ID));
        cy.wrap(FRAMENUM).as('widgetsToBeRemovedFromPage');
        currentPage = currentPage.getMenu().getPages().open();
        currentPage = currentPage.openDesigner();
        selectPageFromSidebar(DEMOPAGE.code);
        currentPage = currentPage.getContent().getDesignerGridFrameKebabMenu(2, 0, SAMPLE_BASIC_WIDGET_ID)
                                 .open()
                                 .openEdit();
        cy.validateUrlPathname(`/widget/edit/${SAMPLE_BASIC_WIDGET_ID}`);
        currentPage.getContent().getTitleInput().should('have.value', SAMPLE_BASIC_WIDGET.titles.en);
        currentPage.getContent().editFormFields({
          name: SAMPLE_WIDGET_NAMES[1],
          group: 'Free Access',
          iconChoose
        });
        currentPage = currentPage.getContent().submitForm();
        cy.validateUrlPathname('/widget');
        currentPage.getContent().getListArea().should('contain', SAMPLE_WIDGET_NAMES[1]);
      });

    });

    describe('Delete widget with reference', () => {

      it('Attempt to delete the widget with reference to a published page', () => {
        cy.widgetsController().then(controller => controller.addWidget(SAMPLE_BASIC_WIDGET));
        cy.wrap(SAMPLE_BASIC_WIDGET_ID).as('widgetToBeDelete');
        cy.pageWidgetsController(DEMOPAGE.code).then(controller => controller.addWidget(FRAMENUM, SAMPLE_BASIC_WIDGET_ID));
        cy.pagesController().then(controller => controller.setPageStatus(DEMOPAGE.code, 'published'));
        cy.wrap(FRAMENUM).as('widgetsToBeRemovedFromPage');
        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
        currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);
        currentPage.getDialog().getConfirmButton().click();
        currentPage.getToastList().should('contain', `The Widget ${SAMPLE_BASIC_WIDGET_ID} cannot be deleted because it is used into pages`);
      });

      it('Attempt to delete the widget with reference to an unpublished page', () => {
        cy.log('set the page to unpublished first');
        cy.widgetsController().then(controller => controller.addWidget(SAMPLE_BASIC_WIDGET));
        cy.wrap(SAMPLE_BASIC_WIDGET_ID).as('widgetToBeDelete');
        cy.pageWidgetsController(DEMOPAGE.code).then(controller => controller.addWidget(FRAMENUM, SAMPLE_BASIC_WIDGET_ID));
        cy.wrap(FRAMENUM).as('widgetsToBeRemovedFromPage');

        cy.log('now attempt to delete the widget');
        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
        currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);

        currentPage.getDialog().getConfirmButton().click();
        currentPage.getToastList().should('contain', `The Widget ${SAMPLE_BASIC_WIDGET_ID} cannot be deleted because it is used into pages`);
      });

      it('Delete a user widget', () => {
        cy.widgetsController().then(controller => controller.addWidget(SAMPLE_BASIC_WIDGET));
        currentPage = currentPage.getMenu().getComponents().open();
        currentPage = currentPage.openMFE_Widgets();
        currentPage.getContent().openKebabMenuByWidgetCode(SAMPLE_BASIC_WIDGET_ID, WIDGET_ACTIONS.DELETE);

        currentPage.getDialog().getConfirmButton().click();
        currentPage.getContent().getListArea().should('not.contain', SAMPLE_BASIC_WIDGET_ID);
      });

    });

    const selectPageFromSidebar = (pageCode) => {
      const currentPageContent = currentPage.getContent();
      currentPageContent.clickSidebarTab(1);
      cy.wait('@sidebarLoaded');
      currentPageContent.designPageFromSidebarPageTreeTable(pageCode);
      cy.wait('@pageWidgetsLoaded');
      currentPageContent.clickSidebarTab(0);
      cy.get(`${htmlElements.div}#toolbar-tab-pane-0`).should('be.visible');
    };

  });

  describe('Role access', () => {

    beforeEach(() => {
      cy.wrap(null).as('userToBeDeleted');
      cy.wrap(null).as('roleToBeDeleted');

      role.code = generateRandomId();
      role.name = generateRandomId();

      cy.kcAPILogin();
      cy.kcUILogin('login/admin');
    });

    afterEach(() => {
      cy.get('@userToBeDeleted').then(userToBeDeleted => {
        if (userToBeDeleted !== null) {
          cy.usersController().then(controller => controller.deleteUser(userToBeDeleted.username));
        }
      });

      cy.get('@roleToBeDeleted').then(roleToBeDeleted => {
        if (roleToBeDeleted !== null) {
          cy.rolesController().then(controller => controller.deleteRole(roleToBeDeleted.code));
        }
      });

      cy.kcUILogout();
    });

    it('Widgets page should not be accessible without superuser role', () => {
      cy.rolesController()
        .then(controller => controller.addRole(role))
        .then(() => cy.wrap(role).as('roleToBeDeleted'));

      cy.fixture(`users/details/user`).then(userJSON => {
        cy.usersController()
          .then(controller => controller.addUser(userJSON))
          .then(() => cy.wrap(userJSON).as('userToBeDeleted'));
        cy.usersController().then(controller => {
          controller.updateUser(userJSON);
          controller.addAuthorities(userJSON.username, 'administrators', role.code);
        });
      });

      cy.kcUILogout();
      cy.kcUILogin('login/user');

      currentPage = new HomePage();
      currentPage.closeAppTour();
      currentPage.getMenu().get().should('not.contain', 'Components');

      cy.visit('/widget');
      cy.root().should('contain', '403');
    });

    const role = {
      permissions: {
        managePages: true,
        enterBackend: true,
        superuser: false
      }
    };

  });

  const {WIDGET_ACTIONS} = MFEWidgetsPage;

  const SAMPLE_BASIC_WIDGET_ID = 'my_widget';

  const SAMPLE_WIDGET_NAMES = ['My Widget', 'Your Widget', 'Our Widget'];

  const SAMPLE_BASIC_WIDGET = {
    code: SAMPLE_BASIC_WIDGET_ID,
    titles: {
      en: SAMPLE_WIDGET_NAMES[0],
      it: SAMPLE_WIDGET_NAMES[0]
    },
    group: 'administrators',
    configUi: null,
    icon: 'font-awesome:fa-arrow-right',
    customUi: '<h1>Just a basic widget</h1>'
  };

  const FRAMENUM = 5;

  const DEMOPAGE = {
    code: 'demopage',
    charset: 'utf-8',
    contentType: 'text/html',
    displayedInMenu: true,
    joinGroups: null,
    seo: false,
    titles: {
      en: 'Demo page'
    },
    ownerGroup: 'administrators',
    pageModel: '1-column',
    parentCode: 'homepage'
  };

  const iconChoose = 'fa-android';
  const iconUpload = 'cypress/fixtures/icon/Entando.svg';

});
