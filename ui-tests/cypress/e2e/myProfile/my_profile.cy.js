import {generateRandomId} from '../../support/utils';

describe('My Profile', () => {

  beforeEach(() => cy.kcClientCredentialsLogin());

  afterEach(() => cy.kcTokenLogout());

  describe('UI', () => {

    beforeEach(() => {
      cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
      cy.get('@currentPage')
        .then(page => page.getNavbar().openUserMenu().openProfile())
        .then(page => {
          cy.validateUrlPathname('/myProfile');
          page.getContent().getTitle()
              .should('be.visible')
              .and('have.text', 'My profile');
        });
    });

    it([Tag.GTS, 'ENG-2026'], 'Account', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().selectTab('account'))
        .then(page =>
            page.getContent().getLegend()
                .should('be.visible')
                .and('have.text', 'Edit my account')
        );
    });

    it([Tag.GTS, 'ENG-2026'], 'Profile', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().selectTab('profile'))
        .then(page => {
          page.getContent().getProfileEditButton().should('be.visible');
          page.getContent().getLegend()
              .first()
              .should('be.visible')
              .and('have.text', 'Upload your image profile');
          page.getContent().getLegend().eq(1)
              .should('be.visible')
              .and('have.text', 'Edit my profile');
        });
    });

    it([Tag.GTS, 'ENG-2026'], 'Preferences', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().selectTab('preferences'))
        .then(page => {
          page.getContent().getSettingsSaveBtn().should('be.visible');
          page.getContent().getLegend()
              .first()
              .should('be.visible')
              .and('have.text', 'Preferences');
        });
    });

  });

  describe('Actions', () => {

    beforeEach(() => {
      cy.fixture(`users/details/user`).then(user => {
        cy.usersController().then(controller => {
          controller.addUser(user).then(() => cy.wrap(user).as('userToBeDeleted'));
          controller.updateUser(user);
          controller.addAuthorities(user.username, 'administrators', 'admin');
        });
      });
      cy.kcAuthorizationCodeLoginAndOpenDashboard('login/user');
      cy.get('@currentPage').then(page => page.getNavbar().openUserMenu().openProfile());
    });

    afterEach(() => {
      cy.get('@userToBeDeleted').then(userToBeDeleted => {
        //FIXME deleted user, when re-created, retain user preferences
        cy.userPreferencesController().then(controller => controller.resetUserPreferences(userToBeDeleted.username));
        cy.usersController().then(controller => controller.deleteUser(userToBeDeleted.username))
      });
    });

    it([Tag.GTS, 'ENG-2026'], 'My Account - Change Password', () => {
      cy.get('@userToBeDeleted').then(user =>
          cy.wrap(generateRandomId()).then(editedPassword =>
              cy.get('@currentPage')
                .then(page => page.getContent().clickChangePasswordButton())
                .then(page => page.getContent().typeCurrentPassword(user.password))
                .then(page => page.getContent().typeNewPassword(editedPassword))
                .then(page => page.getContent().typeConfirmNewPassword(editedPassword))
                .then(page => page.getContent().clickChangePasswordSaveButton())
                .then(page => cy.validateToast(page))));
    });

    it([Tag.GTS, 'ENG-2026'], 'Profile - Edit profile with image', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().selectTab('profile'))
        .then(page => page.getContent().clickProfileEditButton())
        .then(page => page.getContent().typeFullNameInput('Test name'))
        .then(page => page.getContent().typeEmailInput('email@test.com'))
        .then(page => page.getContent().uploadProfileImage('cypress/fixtures/upload/entando_400x400.png'))
        .then(page => {
          cy.validateToast(page);
          page.getContent().clickProfileSaveButton();
        })
        .then(page => {
          cy.validateToast(page);
          page.getContent().getProfileImage()
              .invoke('attr', 'src')
              .should('match', /entando_400x400/);
        });
    });

    //TODO this test should first set an image for the user, possibly via API call
    it([Tag.GTS, 'ENG-2026'], 'Profile - Remove profile image', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().selectTab('profile'))
        .then(page => page.getContent().clickProfileEditButton())
        .then(page => page.getContent().typeFullNameInput('Test name'))
        .then(page => page.getContent().typeEmailInput('email@test.com'))
        .then(page => page.getContent().clickUploadImageButton())
        .then(page => {
          page.getContent().getProfileDropdown().find('li a').last().click();
          page.getContent().clickProfileSaveButton();
        })
        .then(page => {
          cy.validateToast(page);
          page.getContent().getProfileImage()
              .invoke('attr', 'src')
              .should('match', /user-icon/);
        });
    });

    it([Tag.GTS, 'ENG-2026'], 'Preferences - set preferences', () => {
      cy.get('@currentPage')
        .then(page => page.getContent().selectTab('preferences'))
        .then(page => page.getContent().toggleWelcomeWizard())
        .then(page => page.getContent().toggleLoadOnPageSelectSwitch())
        .then(page => page.getContent().selectDefaultPageOwner('Administrators'))
        .then(page => page.getContent().selectDefaultPageJoinGroups('Free Access'))
        .then(page => page.getContent().selectDefaultContentOwnerGroup('Administrators'))
        .then(page => page.getContent().selectDefaultContentJoinGroups('Free Access'))
        .then(page => page.getContent().selectWidgetOwnerGroup('Administrators'))
        .then(page => page.getContent().clickSettingsSaveBtn())
        .then(page => cy.validateToast(page));
    });

  });

});
