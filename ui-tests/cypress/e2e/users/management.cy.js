import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Users Management', () => {

  beforeEach(() => {
    cy.kcAPILogin();
    cy.kcUILogin('login/admin');
  });

  afterEach(() => {
    cy.kcUILogout();
  });

  const PROFILE_TYPE_CODE = 'PFL';
  const USERNAME_ADMIN    = 'admin';

  describe('UI', () => {

    it([Tag.GTS, 'ENG-2522'], 'Users management page', () => {
      openManagementPage()
        .then(page => {
          cy.validateUrlPathname('/user');
          page.getContent().getTitle()
              .should('be.visible')
              .and('have.text', 'Users');
          page.getContent().getBreadCrumb().should('be.visible');
          page.getContent().getBreadCrumb().children(htmlElements.li)
              .should('have.length', 2)
              .then(elements => cy.validateListTexts(elements, ['Users', 'Management']));
          page.getContent().getSearchForm()
              .should('be.visible')
              .within(() => {
                cy.get('h3').contains('Search').should('be.visible');
              });
          page.getContent().getSearchInput().should('be.visible');
          page.getContent().getUsersTable().should('be.visible');
          page.getContent().getTableHeaders().children(htmlElements.th)
              .should('have.length', 6)
              .then(elements => cy.validateListTexts(elements, ['Username', 'Profile Type', 'Full Name', 'Email', 'Status', 'Actions']));
          page.getContent().getAddButton()
              .should('be.visible')
              .and('have.text', 'Add');
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'Edit user page', () => {
      openManagementPage()
        .then(page => {
          page.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);
          openEdit(USERNAME_ADMIN);
        })
        .then(page => {
          cy.validateUrlPathname(`/user/edit/${USERNAME_ADMIN}`);
          page.getContent().getTitle()
              .should('be.visible')
              .and('have.text', 'Edit');
          page.getContent().getBreadCrumb().should('be.visible');
          page.getContent().getBreadCrumb().children(htmlElements.li)
              .should('have.length', 3)
              .then(elements => cy.validateListTexts(elements, ['Users', 'Management', 'Edit']));
          page.getContent().getUsernameInput()
              .should('be.visible')
              .and('have.value', USERNAME_ADMIN);
          page.getContent().getUsernameInput().parent().parent().parent().children(htmlElements.div).eq(0)
              .should('have.text', 'Username ');
          page.getContent().getPasswordInput()
              .should('be.visible');
          page.getContent().getPasswordInput().parent().parent().parent().children(htmlElements.div).eq(0)
              .should('have.text', 'Password ');
          page.getContent().getPasswordConfirmInput()
              .should('be.visible');
          page.getContent().getPasswordConfirmInput().parent().parent().parent().children(htmlElements.div).eq(0)
              .should('have.text', 'Confirm password ');
          page.getContent().getStatus()
              .should('be.visible');
          page.getContent().getCancelButton()
              .should('be.visible')
              .and('have.text', 'Cancel');
          page.getContent().getSaveButton()
              .should('be.visible')
              .and('have.text', 'Save');
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'Edit user profile page', () => {
      openManagementPage()
        .then(page => {
          page.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);
          page.getContent().getKebabMenu(USERNAME_ADMIN).open().openEditProfile(PROFILE_TYPE_CODE);
        })
        .then(page => {
          cy.validateUrlPathname(`/userprofile/${USERNAME_ADMIN}`);
          page.getContent().getTitle()
              .should('be.visible')
              .and('have.text', 'Edit');
          page.getContent().getBreadCrumb().should('be.visible');
          page.getContent().getBreadCrumb().children(htmlElements.li)
              .should('have.length', 3)
              .then(elements => cy.validateListTexts(elements, ['Users', 'Management', 'Edit user profile']));
          page.getContent().getProfileTypeSelect()
              .should('be.visible');
          page.getContent().getProfileTypeSelect().parent().parent().children(htmlElements.div).eq(0)
              .should('have.text', 'Profile Type ');
          page.getContent().getUsernameInput()
              .should('be.visible')
              .and('be.disabled');
          page.getContent().getUsernameInput().parent().parent().parent().children(htmlElements.div).eq(0)
              .should('have.text', 'Username ');
          page.getContent().getFullNameInput()
              .should('be.visible');
          page.getContent().getFullNameInput().parent().parent().parent().children(htmlElements.div).eq(0)
              .should('have.text', 'Full Name ');
          page.getContent().getEmailInput()
              .should('be.visible');
          page.getContent().getEmailInput().parent().parent().parent().children(htmlElements.div).eq(0)
              .should('have.text', 'Email ');
          page.getContent().getProfilePictureInput()
              .should('be.visible');
          page.getContent().getProfilePictureInput().parent().parent().parent().children(htmlElements.div).eq(0)
              .should('have.text', 'Profile Picture ');
          page.getContent().getSaveButton()
              .should('be.visible')
              .and('have.text', 'Save');
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'View user profile page', () => {
      openManagementPage()
        .then(page => {
          page.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);
          page.getContent().getKebabMenu(USERNAME_ADMIN).open().openViewProfile();
        })
        .then(page => {
          cy.validateUrlPathname(`/user/view/${USERNAME_ADMIN}`);
          page.getContent().getTitle()
              .should('be.visible')
              .and('have.text', 'Details');
          page.getContent().getBreadCrumb().should('be.visible');
          page.getContent().getBreadCrumb().children(htmlElements.li)
              .should('have.length', 3)
              .then(elements => cy.validateListTexts(elements, ['Users', 'Management', 'Details']));
          page.getContent().getDetailsTable()
              .should('be.visible')
              .within(() => {
                cy.get(htmlElements.th)
                  .should('have.length', 5)
                  .then(headings => cy.validateListTexts(headings, ['Username', 'profilepicture', 'Full Name', 'Email', 'Profile Type']));
                cy.get(htmlElements.td)
                  .should('have.length', 5)
                  .then(headings => cy.validateListTexts(headings, [USERNAME_ADMIN]));
              });
          page.getContent().getBackButton()
              .should('be.visible')
              .and('have.text', 'Back');
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'User authorizations page', () => {
      openManagementPage()
        .then(page => {
          page.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);
          page.getContent().getKebabMenu(USERNAME_ADMIN).open().openManageAuth();
        })
        .then(page => {
          cy.validateUrlPathname(`/authority/${USERNAME_ADMIN}`);
          page.getContent().getTitle()
              .should('be.visible')
              .and('have.text', `Authorizations for ${USERNAME_ADMIN}`);
          page.getContent().getBreadCrumb().should('be.visible');
          page.getContent().getBreadCrumb().children(htmlElements.li)
              .should('have.length', 3)
              .then(elements => cy.validateListTexts(elements, ['Users', 'Management', 'Authorizations']));
          page.getContent().getAuthorityTable().should('be.visible');
          page.getContent().getTableHeaders().children(htmlElements.th)
              .should('have.length', 3)
              .then(elements => cy.validateListTexts(elements, ['User Group', 'User Role', 'Actions']));
          page.getContent().getTableRows()
              .should('have.length', 1)
              .within(() => {
                cy.get(htmlElements.td).eq(0).should('have.text', 'Administrators');
                cy.get(htmlElements.td).eq(1).should('have.text', 'Administrator');
                cy.get(htmlElements.td).eq(2).should('have.descendants', htmlElements.button);
              });
          page.getContent().getAddButton()
              .should('be.visible')
              .and('have.text', 'Add new Authorization');
          page.getContent().getSaveButton()
              .should('be.visible')
              .and('have.text', 'Save');
          page.getContent().addAuthorization();
          page.getDialog().getTitle()
              .should('be.visible')
              .and('have.text', 'New authorizations');
          page.getDialog().getBody().getGroup().should('be.visible');
          page.getDialog().getBody().getRole().should('be.visible');
          page.getDialog().getCancelButton()
              .should('be.visible')
              .and('have.text', 'Cancel');
          page.getDialog().getConfirmButton()
              .should('be.visible')
              .and('have.text', 'Add');
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'Edit user profile page - save button to be disabled with invalid profile', () => {
      openManagementPage()
        .then(page => {
          page.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);
          page.getContent().getKebabMenu(USERNAME_ADMIN).open().openEditProfile(PROFILE_TYPE_CODE);
        })
        .then(page => {
          cy.validateUrlPathname(`/userprofile/${USERNAME_ADMIN}`);
          page.getContent().getFullNameInput().then(input => page.getContent().type(input, 'Test'));
          page.getContent().getEmailInput().then(input => page.getContent().type(input, 'test@entando.com'));
          page.getContent().getProfileTypeSelect().then(input => page.getContent().select(input, ''));
          page.getContent().getSaveButton()
              .should('be.disabled');
          page.getContent().selectProfileType(PROFILE_TYPE_CODE);
          page.getContent().getSaveButton()
              .should('be.enabled');
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'Users management page - to not have "User without a profile" filter', () => {
      openManagementPage()
        .then(page => {
          cy.validateUrlPathname(`/user`);
          page.getContent().getSearchForm().contains('User without a profile')
              .should('have.length', 0);
        });
    });

  });

  describe('Actions', () => {

    beforeEach(() => {
      cy.wrap(null).as('userToBeDeleted');
      cy.wrap(generateRandomId()).as('username');
      cy.wrap(generateRandomId()).as('password');
    });

    afterEach(() => {
      cy.get('@userToBeDeleted').then(user => {
        if (user) cy.usersController().then(controller => controller.deleteUser(user));
      });
    });

    it([Tag.GTS, 'ENG-2522'], 'Add a new user', function () {
      openManagementPage()
        .then(page => page.getContent().openAddUserPage())
        .then(() => addUserUI(this.username, this.password, PROFILE_TYPE_CODE))
        .then(page => {
          cy.validateUrlPathname('/user');
          page.getContent().getTableRow(this.username).children(htmlElements.td)
              .then(cells => cy.validateListTexts(cells, [this.username]));
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'Add a user with existing user name is forbidden', function () {
      addUserAPI(this.username, this.password, PROFILE_TYPE_CODE);

      openManagementPage()
        .then(page => page.getContent().openAddUserPage())
        .then(page => {
          page.getContent().fillForm(this.username, this.password, PROFILE_TYPE_CODE);
          page.getContent().getSaveButton().then(button => page.getContent().click(button));
          cy.validateToast(page, `The user '${this.username}' already exists`, false);
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'Update an existing user', function () {
      addUserAPI(this.username, this.password, PROFILE_TYPE_CODE);

      cy.wrap(generateRandomId()).then(updatedPassword => {
        openManagementPage()
          .then(page => {
            page.getContent().getTableRows().contains(htmlElements.td, this.username);
            openEdit(this.username);
          })
          .then(page => page.getContent().editUser(updatedPassword, true))
          .then(page => page.getContent().getTableRow(this.username).children(htmlElements.td)
                            .then(cells => cy.validateListTexts(cells, [this.username, null, null, null, '\u00a0Active'])));
      });
    });

    it([Tag.GTS, 'ENG-2522'], 'Update an existing user profile', function () {
      const PROFILE_TYPE_DESC = 'Default user profile';

      addUserAPI(this.username, this.password, PROFILE_TYPE_CODE);

      cy.wrap(generateRandomId()).then(fullName => {
        cy.wrap(`${generateRandomId()}@entando.com`).then(email => {
          openManagementPage()
            .then(page => {
              page.getContent().getTableRows().contains(htmlElements.td, this.username);
              page.getContent().getKebabMenu(this.username).open().openEditProfile(PROFILE_TYPE_CODE);
            })
            .then(page => {
              page.getContent().getUsernameInput().should('have.value', this.username);
              page.getContent().editUser(null, fullName, email, null);
            })
            .then(page => {
              cy.validateToast(page, 'User profile has been updated');
              page.getContent().getTableRow(this.username).children(htmlElements.td)
              .then(cells => cy.validateListTexts(cells, [this.username, `${PROFILE_TYPE_DESC} ${PROFILE_TYPE_CODE}`, fullName, email, '\u00a0Not active']));
            });
        });
      });
    });

    it([Tag.GTS, 'ENG-2522'], 'Update an existing user authorization', function () {
      const GROUP = {
        ID: 'free',
        DESCRIPTION: 'Free Access'
      };
      const ROLE  = {
        ID: 'admin',
        DESCRIPTION: 'Administrator'
      };

      addUserAPI(this.username, this.password, PROFILE_TYPE_CODE);

      openManagementPage()
        .then(page => {
          page.getContent().getTableRows().contains(htmlElements.td, this.username);
          page.getContent().getKebabMenu(this.username).open().openManageAuth();
        })
        .then(page => {
          page.getContent().getTitle().should('contain', this.username);
          page.getContent().addAuthorization();
          page.getDialog().getBody().getGroup().then(input => page.getContent().select(input, GROUP.ID));
          page.getDialog().getBody().getRole().then(input => page.getContent().select(input, ROLE.ID));
          page.getDialog().confirm();
          page.getContent().getTableRows().contains(htmlElements.td, GROUP.DESCRIPTION).parent().then(row => {
            cy.get(row).children(htmlElements.td).eq(0).should('have.text', GROUP.DESCRIPTION);
            cy.get(row).children(htmlElements.td).eq(1).should('have.text', ROLE.DESCRIPTION);
          })
          page.getContent().save();
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'Search an existing user', function () {
      addUserAPI(this.username, this.password, PROFILE_TYPE_CODE);

      openManagementPage()
        .then(page => {
          page.getContent().searchUser(this.username);
          page.getContent().getTableRows()
                           .should('have.length', 1)
                           .children(htmlElements.td)
                           .then(cells => cy.validateListTexts(cells, [this.username]));
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'Search a non-existing user', function () {
      openManagementPage()
        .then(page => {
          page.getContent().searchUser(this.username);
          page.getContent().get().should('not.have.descendants', page.getContent().table);
          page.getContent().getTableAlert()
              .should('be.visible')
              .and('have.text', 'There are no USERS available');
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'Delete a user', function () {
      addUserAPI(this.username, this.password, PROFILE_TYPE_CODE);

      openManagementPage()
        .then(page => {
          page.getContent().getTableRows().contains(htmlElements.td, this.username);
          page.getContent().getKebabMenu(this.username).open().clickDelete();
          page.getDialog().getBody().getStateInfo().should('contain', this.username);
          page.getDialog().confirm();
          page.getContent().getTableRows().should('not.contain', this.username);
          cy.wrap(null).as('userToBeDeleted');
        });
    });

    it([Tag.GTS, 'ENG-2522'], 'Deletion of admin is forbidden', () => {
      openManagementPage()
        .then(page => {
          page.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);
          page.getContent().getKebabMenu(USERNAME_ADMIN).open().clickDelete(false);
          page.getDialog().getBody().getStateInfo().should('contain', USERNAME_ADMIN);
          page.getDialog().confirm();
          cy.validateToast(page, 'Sorry. You can\'t delete the administrator user', false);
        });
    });

  });

  const openManagementPage = () => cy.get('@currentPage').then(page => page.getMenu().getUsers().open().openManagement());

  const addUserUI = (username, password, code) => {
    return cy.get('@currentPage')
             .then(page => page.getContent().addUser(username, password, code))
             .then(page => {
               cy.wrap(username).as('userToBeDeleted');
               cy.wrap(page).as('currentPage');
             });
  };

  const addUserAPI = (username, password, code) => {
    cy.usersController().then(controller => {
      controller.addUser({username: username, password: password, passwordConfirm: password, profileType: code})
                .then(res => cy.wrap(res.body.payload.username).as('userToBeDeleted'));
    });
  };

  const openEdit = (username) => {
    return cy.get('@currentPage')
             .then(page => page.getContent().getKebabMenu(username).open().openEdit())
             .then(page => {
               page.getContent().getUsernameInput().should('have.value', username);
               cy.wrap(page).as('currentPage');
             });
  };

});
