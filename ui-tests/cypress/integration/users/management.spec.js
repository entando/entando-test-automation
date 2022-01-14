import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage';

describe('Users Management', () => {

  let currentPage;

  beforeEach(() => {
    cy.kcLogin('admin').as('tokens');
  });

  afterEach(() => {
    cy.kcLogout();
  });

  describe('UI', () => {

    const USERNAME_ADMIN = 'admin';

    it('Users management page', () => {
      currentPage = openManagementPage();

      cy.validateUrlPathname('/app-builder/user');

      currentPage.getContent().getTitle()
                 .should('be.visible')
                 .and('have.text', 'Users');

      currentPage.getContent().getBreadCrumb().should('be.visible');
      currentPage.getContent().getBreadCrumb().children(htmlElements.li)
                 .should('have.length', 2)
                 .then(elements => cy.validateListTexts(elements, ['Users', 'Management']));

      currentPage.getContent().getSearchForm()
                 .should('be.visible')
                 .within(() => {
                   cy.get('h3').contains('Search').should('be.visible');
                 });

      currentPage.getContent().getSearchInput().should('be.visible');

      currentPage.getContent().getUsersTable().should('be.visible');
      currentPage.getContent().getTableHeaders().children(htmlElements.th)
                 .should('have.length', 6)
                 .then(elements => cy.validateListTexts(elements, ['Username', 'Profile Type', 'Full Name', 'Email', 'Status', 'Actions']));

      currentPage.getContent().getAddButton()
                 .should('be.visible')
                 .and('have.text', 'Add');
    });

    it('Edit user page', () => {
      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);
      currentPage = currentPage.getContent().getKebabMenu(USERNAME_ADMIN).open().openEdit();

      cy.validateUrlPathname(`/app-builder/user/edit/${USERNAME_ADMIN}`);

      currentPage.getContent().getTitle()
                 .should('be.visible')
                 .and('have.text', 'Edit');

      currentPage.getContent().getBreadCrumb().should('be.visible');
      currentPage.getContent().getBreadCrumb().children(htmlElements.li)
                 .should('have.length', 3)
                 .then(elements => cy.validateListTexts(elements, ['Users', 'Management', 'Edit']));

      currentPage.getContent().getUsernameInput()
                 .should('be.visible')
                 .and('have.value', USERNAME_ADMIN);
      currentPage.getContent().getUsernameInput().parent().parent().parent().children(htmlElements.div).eq(0)
                 .should('have.text', 'Username ');
      currentPage.getContent().getPasswordInput()
                 .should('be.visible');
      currentPage.getContent().getPasswordInput().parent().parent().parent().children(htmlElements.div).eq(0)
                 .should('have.text', 'Password ');
      currentPage.getContent().getPasswordConfirmInput()
                 .should('be.visible');
      currentPage.getContent().getPasswordConfirmInput().parent().parent().parent().children(htmlElements.div).eq(0)
                 .should('have.text', 'Confirm password ');
      currentPage.getContent().getStatus()
                 .should('be.visible');

      currentPage.getContent().getCancelButton()
                 .should('be.visible')
                 .and('have.text', 'Cancel');
      currentPage.getContent().getSaveButton()
                 .should('be.visible')
                 .and('have.text', 'Save');
    });

    it('Edit user profile page', () => {
      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);
      currentPage = currentPage.getContent().getKebabMenu(USERNAME_ADMIN).open().openEditProfile();

      cy.validateUrlPathname(`/app-builder/userprofile/${USERNAME_ADMIN}`);

      currentPage.getContent().getTitle()
                 .should('be.visible')
                 .and('have.text', 'Edit');

      currentPage.getContent().getBreadCrumb().should('be.visible');
      currentPage.getContent().getBreadCrumb().children(htmlElements.li)
                 .should('have.length', 3)
                 .then(elements => cy.validateListTexts(elements, ['Users', 'Management', 'Edit user profile']));

      currentPage.getContent().getProfileTypeSelect()
                 .should('be.visible');
      currentPage.getContent().getProfileTypeSelect().parent().parent().children(htmlElements.div).eq(0)
                 .should('have.text', 'Profile Type ');
      currentPage.getContent().getUsernameInput()
                 .should('be.visible')
                 .and('be.disabled');
      currentPage.getContent().getUsernameInput().parent().parent().parent().children(htmlElements.div).eq(0)
                 .should('have.text', 'Username ');
      currentPage.getContent().getFullNameInput()
                 .should('be.visible');
      currentPage.getContent().getFullNameInput().parent().parent().parent().children(htmlElements.div).eq(0)
                 .should('have.text', 'Full Name ');
      currentPage.getContent().getEmailInput()
                 .should('be.visible');
      currentPage.getContent().getEmailInput().parent().parent().parent().children(htmlElements.div).eq(0)
                 .should('have.text', 'Email ');
      currentPage.getContent().getProfilePictureInput()
                 .should('be.visible');
      currentPage.getContent().getProfilePictureInput().parent().parent().parent().children(htmlElements.div).eq(0)
                 .should('have.text', 'Profile Picture ');

      currentPage.getContent().getSaveButton()
                 .should('be.visible')
                 .and('have.text', 'Save');
    });

    it('View user profile page', () => {
      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);
      currentPage = currentPage.getContent().getKebabMenu(USERNAME_ADMIN).open().openViewProfile();

      cy.validateUrlPathname(`/app-builder/user/view/${USERNAME_ADMIN}`);

      currentPage.getContent().getTitle()
                 .should('be.visible')
                 .and('have.text', 'Details');

      currentPage.getContent().getBreadCrumb().should('be.visible');
      currentPage.getContent().getBreadCrumb().children(htmlElements.li)
                 .should('have.length', 3)
                 .then(elements => cy.validateListTexts(elements, ['Users', 'Management', 'Details']));

      currentPage.getContent().getDetailsTable()
                 .should('be.visible')
                 .within(() => {
                   cy.get(htmlElements.th)
                     .should('have.length', 5)
                     .then(headings => cy.validateListTexts(headings, ['Username', 'profilepicture', 'Full Name', 'Email', 'Profile Type']));
                   cy.get(htmlElements.td)
                     .should('have.length', 5)
                     .then(headings => cy.validateListTexts(headings, [USERNAME_ADMIN]));
                 });

      currentPage.getContent().getBackButton()
                 .should('be.visible')
                 .and('have.text', 'Back');
    });

    it('User authorizations page', () => {
      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);
      currentPage = currentPage.getContent().getKebabMenu(USERNAME_ADMIN).open().openManageAuth();

      cy.validateUrlPathname(`/app-builder/authority/${USERNAME_ADMIN}`);

      currentPage.getContent().getTitle()
                 .should('be.visible')
                 .and('have.text', `Authorizations for ${USERNAME_ADMIN}`);

      currentPage.getContent().getBreadCrumb().should('be.visible');
      currentPage.getContent().getBreadCrumb().children(htmlElements.li)
                 .should('have.length', 3)
                 .then(elements => cy.validateListTexts(elements, ['Users', 'Management', 'Authorizations']));

      currentPage.getContent().getAuthorityTable().should('be.visible');
      currentPage.getContent().getTableHeaders().children(htmlElements.th)
                 .should('have.length', 3)
                 .then(elements => cy.validateListTexts(elements, ['User Group', 'User Role', 'Actions']));

      currentPage.getContent().getTableRows()
                 .should('have.length', 1)
                 .within(() => {
                   cy.get(htmlElements.td).eq(0).should('have.text', 'Administrators');
                   cy.get(htmlElements.td).eq(1).should('have.text', 'Administrator');
                   cy.get(htmlElements.td).eq(2).should('have.descendants', htmlElements.button);
                 });

      currentPage.getContent().getAddButton()
                 .should('be.visible')
                 .and('have.text', 'Add new Authorization');

      currentPage.getContent().getSaveButton()
                 .should('be.visible')
                 .and('have.text', 'Save');

      currentPage.getContent().addAuthorization();
      currentPage.getDialog().getTitle()
                 .should('be.visible')
                 .and('have.text', 'New authorizations');
      currentPage.getDialog().getBody().getGroup().should('be.visible');
      currentPage.getDialog().getBody().getRole().should('be.visible');
      currentPage.getDialog().getCancelButton()
                 .should('be.visible')
                 .and('have.text', 'Cancel');
      currentPage.getDialog().getConfirmButton()
                 .should('be.visible')
                 .and('have.text', 'Add');
    });

  });

  describe('Actions', () => {

    const PROFILE_TYPE_CODE = 'PFL';

    let username;
    let password;

    beforeEach(() => {
      username = generateRandomId();
      password = generateRandomId();
    });

    it('Add a new user', () => {
      currentPage = openManagementPage();

      currentPage = currentPage.getContent().openAddUserPage();
      currentPage = currentPage.getContent().addUser(username, password, PROFILE_TYPE_CODE);

      currentPage.getContent().getTableRow(username).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username]));

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it('Add a user with existing user name is forbidden', () => {
      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();

      currentPage = currentPage.getContent().openAddUserPage();
      currentPage.getContent().addUser(username, password, PROFILE_TYPE_CODE);

      cy.validateToast(currentPage, `The user '${username}' already exists`, false);

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it('Update an existing user', () => {
      const PASSWORD_EDIT = generateRandomId();

      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, username);

      currentPage = currentPage.getContent().getKebabMenu(username).open().openEdit();
      currentPage = currentPage.getContent().editUser(PASSWORD_EDIT, true);

      currentPage.getContent().getTableRow(username).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username, null, null, null, '\u00a0Active']));

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it('Update an existing user profile', () => {
      const FULL_NAME         = generateRandomId();
      const EMAIL             = `${generateRandomId()}@entando.com`;
      const PROFILE_TYPE_DESC = 'Default user profile';

      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, username);

      currentPage = currentPage.getContent().getKebabMenu(username).open().openEditProfile();
      currentPage.getContent().getUsernameInput().should('have.value', username);

      currentPage = currentPage.getContent().editUser(null, FULL_NAME, EMAIL, null);

      cy.validateToast(currentPage, 'User profile has been updated');

      currentPage.getContent().getTableRow(username).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username, `${PROFILE_TYPE_DESC} ${PROFILE_TYPE_CODE}`, FULL_NAME, EMAIL, '\u00a0Not active']));

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it('Update an existing user authorization', () => {
      const GROUP = {
        ID: 'free',
        DESCRIPTION: 'Free Access'
      };
      const ROLE  = {
        ID: 'admin',
        DESCRIPTION: 'Administrator'
      };

      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, username);

      currentPage = currentPage.getContent().getKebabMenu(username).open().openManageAuth();
      currentPage.getContent().getTitle().should('contain', username);

      currentPage.getContent().addAuthorization();
      currentPage.getDialog().getBody().selectGroup(GROUP.ID);
      currentPage.getDialog().getBody().selectRole(ROLE.ID);
      currentPage.getDialog().confirm();

      currentPage.getContent().getTableRows().contains(htmlElements.td, GROUP.DESCRIPTION).parent().then(row => {
        cy.get(row).children(htmlElements.td).eq(0).should('have.text', GROUP.DESCRIPTION);
        cy.get(row).children(htmlElements.td).eq(1).should('have.text', ROLE.DESCRIPTION);
      });

      currentPage.getContent().save();

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it('Search an existing user', () => {
      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();

      currentPage = currentPage.getContent().searchUser(username);
      currentPage.getContent().getTableRows()
                 .should('have.length', 1)
                 .children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username]));

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it('Search a non-existing user', () => {
      currentPage = openManagementPage();

      currentPage = currentPage.getContent().searchUser(username);
      currentPage.getContent().get().should('not.have.descendants', currentPage.getContent().table);
      currentPage.getContent().getTableAlert()
                 .should('be.visible')
                 .and('have.text', 'There are no USERS available');
    });

    it('Delete a user', () => {
      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, username);

      currentPage.getContent().getKebabMenu(username).open().clickDelete();
      currentPage.getDialog().getBody().getStateInfo().should('contain', username);
      currentPage.getDialog().confirm();
      cy.wait(1000);
      currentPage.getContent().getTableRows().should('not.contain', username);
    });

    it('Deletion of admin is forbidden', () => {
      const USERNAME_ADMIN = 'admin';

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);

      currentPage.getContent().getKebabMenu(USERNAME_ADMIN).open().clickDelete();
      currentPage.getDialog().getBody().getStateInfo().should('contain', USERNAME_ADMIN);
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage, 'Sorry. You can\'t delete the administrator user', false);
    });

  });

  const openManagementPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    return currentPage.getMenu().getUsers().open().openManagement();
  };

});
