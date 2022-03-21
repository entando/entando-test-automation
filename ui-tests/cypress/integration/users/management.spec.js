import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage';

describe([Tag.GTS], 'Users Management', () => {

  let currentPage;

  beforeEach(() => {
    cy.kcAPILogin();
    cy.usersController().then(controller => controller.intercept({method: 'GET'}, 'loadedList', '?page=1&pageSize=10'));
    cy.usersController().then(controller => controller.intercept({method: 'POST'}, 'addUserRequest'));
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.kcUILogout();
  });

  describe('UI', () => {

    const USERNAME_ADMIN = 'admin';

    beforeEach(() => {
      cy.usersController().then(controller => controller.intercept({method: 'GET'}, 'userDetails', `/${USERNAME_ADMIN}`));
    });

    it('Users management page', () => {
      currentPage = openManagementPage();

      cy.validateAppBuilderUrlPathname('/user');

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
      currentPage = openEdit(USERNAME_ADMIN);

      cy.validateAppBuilderUrlPathname(`/user/edit/${USERNAME_ADMIN}`);

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

      cy.validateAppBuilderUrlPathname(`/userprofile/${USERNAME_ADMIN}`);

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
      cy.wait('@userDetails');

      cy.validateAppBuilderUrlPathname(`/user/view/${USERNAME_ADMIN}`);

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

      cy.validateAppBuilderUrlPathname(`/authority/${USERNAME_ADMIN}`);

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

    it('Edit user profile page - save button to be disabled with invalid profile', () => {
      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);
      currentPage = currentPage.getContent().getKebabMenu(USERNAME_ADMIN).open().openEditProfile();

      cy.validateAppBuilderUrlPathname(`/userprofile/${USERNAME_ADMIN}`);

      currentPage.getContent().typeFullName('Test');
      currentPage.getContent().typeEmail('test@entando.com');

      currentPage.getContent().selectProfileType('');
      currentPage.getContent().getSaveButton()
                 .should('be.disabled');

      currentPage.getContent().selectProfileType('PFL');
      currentPage.getContent().getSaveButton()
                 .should('be.enabled');
    });

    it('Users management page - to not have "User without a profile" filter', () => {
      currentPage = openManagementPage();

      cy.validateAppBuilderUrlPathname(`/user`);

      currentPage.getContent().getSearchForm().contains('User without a profile')
                 .should('have.length', 0);
    });

  });

  describe('Actions', () => {

    const PROFILE_TYPE_CODE = 'PFL';

    let username;
    let password;

    beforeEach(() => {
      cy.wrap(null).as('userToBeDeleted');
      username = generateRandomId();
      password = generateRandomId();
      cy.usersController().then(controller => controller.intercept({method: 'GET'}, 'userDetails', `/${username}`));
    });

    afterEach(() => {
      cy.get('@userToBeDeleted').then(user => {
        if (user) cy.usersController().then(controller => controller.deleteUser(user));
      });
    });

    it('Add a new user', () => {
      currentPage = openManagementPage();

      currentPage = currentPage.getContent().openAddUserPage();
      currentPage = addUserUI(username, password, PROFILE_TYPE_CODE);
      cy.validateAppBuilderUrlPathname('/user');
      cy.wait('@loadedList');

      currentPage.getContent().getTableRow(username).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username]));
    });

    it('Add a user with existing user name is forbidden', () => {
      addUserAPI(username, password, PROFILE_TYPE_CODE);

      currentPage = openManagementPage();

      currentPage = currentPage.getContent().openAddUserPage();
      addUserUI(username, password, PROFILE_TYPE_CODE);

      cy.validateToast(currentPage, `The user '${username}' already exists`, false);
    });

    it('Update an existing user', () => {
      const PASSWORD_EDIT = generateRandomId();

      addUserAPI(username, password, PROFILE_TYPE_CODE);

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, username);

      currentPage = openEdit(username);

      currentPage = currentPage.getContent().editUser(PASSWORD_EDIT, true);
      cy.wait('@loadedList');

      currentPage.getContent().getTableRow(username).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username, null, null, null, '\u00a0Active']));
    });

    it('Update an existing user profile', () => {
      const FULL_NAME         = generateRandomId();
      const EMAIL             = `${generateRandomId()}@entando.com`;
      const PROFILE_TYPE_DESC = 'Default user profile';

      addUserAPI(username, password, PROFILE_TYPE_CODE);

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, username);

      currentPage = currentPage.getContent().getKebabMenu(username).open().openEditProfile();
      currentPage.getContent().getUsernameInput().should('have.value', username);

      currentPage = currentPage.getContent().editUser(null, FULL_NAME, EMAIL, null);

      cy.validateToast(currentPage, 'User profile has been updated');

      currentPage.getContent().getTableRow(username).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username, `${PROFILE_TYPE_DESC} ${PROFILE_TYPE_CODE}`, FULL_NAME, EMAIL, '\u00a0Not active']));
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

      addUserAPI(username, password, PROFILE_TYPE_CODE);

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
    });

    it('Search an existing user', () => {
      addUserAPI(username, password, PROFILE_TYPE_CODE);

      currentPage = openManagementPage();

      currentPage = currentPage.getContent().searchUser(username);
      currentPage.getContent().getTableRows()
                 .should('have.length', 1)
                 .children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username]));
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
      addUserAPI(username, password, PROFILE_TYPE_CODE);

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, username);

      currentPage.getContent().getKebabMenu(username).open().clickDelete();
      currentPage.getDialog().getBody().getStateInfo().should('contain', username);
      currentPage.getDialog().confirm();
      cy.wrap(null).as('userToBeDeleted');
      cy.wait('@loadedList');
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
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getUsers().open().openManagement();
    cy.wait('@loadedList');
    return currentPage;
  };

  const addUserUI = (username, password, code) => {
    currentPage = currentPage.getContent().addUser(username, password, code);
    cy.wait('@addUserRequest').then(res => {
      cy.get('@userToBeDeleted').then(user => {
        if (!user) cy.wrap(res.response.body.payload.username).as('userToBeDeleted');
      });
      if (res.response.statusCode == 200) cy.wait('@loadedList');
    });
    return currentPage;
  };

  const addUserAPI = (username, password, code) => {
    cy.usersController().then(controller => {
      controller.addUser({username: username, password: password, passwordConfirm: password, profileType: code})
                .then(res => cy.get('@userToBeDeleted')
                               .then(user => {
                                 if (!user) cy.wrap(res.body.payload.username).as('userToBeDeleted');
                               })
                );
    });
  };

  const openEdit = (username) => {
    currentPage = currentPage.getContent().getKebabMenu(username).open().openEdit();
    currentPage.getContent().getUsernameInput().should('have.value', username);
    cy.wait('@userDetails');
    return currentPage;
  };

});
