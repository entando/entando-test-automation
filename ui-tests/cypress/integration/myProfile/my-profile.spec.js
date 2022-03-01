import HomePage from '../../support/pageObjects/HomePage';

describe([Tag.GTS], 'My Profile', () => {

  let currentPage;
  const username = "admin";

  beforeEach(() => {
    cy.kcLogin('login/admin').as('tokens');
  });

  afterEach(() => {
    cy.kcLogout();
  });

  describe('UI', () => {
    it('Account', () => {
      currentPage = openMyProfile();

      cy.validateAppBuilderUrlPathname('/myProfile');

      currentPage.getContent().getTitle()
      .should('be.visible')
      .and('have.text', 'My profile');

      currentPage.getContent().selectTab('account');
      cy.wait(1000);
      currentPage.getContent().getLegend().should('be.visible')
      .and('have.text', 'Edit my account');
    });

    it('Profile', () => {
      currentPage = openMyProfile();

      cy.validateAppBuilderUrlPathname('/myProfile');

      currentPage.getContent().getTitle()
      .should('be.visible')
      .and('have.text', 'My profile');

      currentPage.getContent().selectTab('profile');
      cy.wait(1000);
      currentPage.getContent().getLegend()
      .first()
      .should('be.visible')
      .and('have.text', 'Upload your image profile');

      currentPage.getContent().getLegend()
      .eq(1)
      .should('be.visible')
      .and('have.text', 'Edit my profile');
    });

    it('Preferences', () => {
      currentPage = openMyProfile();

      cy.validateAppBuilderUrlPathname('/myProfile');

      currentPage.getContent().getTitle()
      .should('be.visible')
      .and('have.text', 'My profile');

      currentPage.getContent().selectTab('preferences');
      cy.wait(1000);
      currentPage.getContent().getLegend()
      .first()
      .should('be.visible')
      .and('have.text', 'Preferences');
    });

  });

  describe('Actions', () => {
    it('My Account - Change Password', () => {
      const newPassword = 'test123456';
      currentPage = openMyProfile();

      currentPage.getContent().selectTab('account');
      currentPage.getContent().clickChangePasswordButton();
      cy.wait(1000);

      cy.fixture(`users/login/admin`)
        .then((userData) => {
          currentPage.getContent().typeCurrentPassword(userData.password);
          currentPage.getContent().typeNewPassword(newPassword);
          currentPage.getContent().typeConfirmNewPassword(newPassword);
          currentPage.getContent().clickChangePasswordSaveButton();

          cy.validateToast(currentPage);

          cy.usersController().then(controller => controller.changePassword(username, {
            oldPassword: newPassword,
            newPassword: userData.password,
            newPasswordConfirm: userData.password,
            username
          }));
        });
    });

    it('Profile - Edit profile with image', () => {
      currentPage = openMyProfile();

      currentPage.getContent().selectTab('profile');
      cy.wait(1000);

      currentPage.getContent().clickProfileEditButton();

      currentPage.getContent().uploadProfileImage('cypress/fixtures/upload/entando_400x400.png');
      cy.wait(2000);
      cy.validateToast(currentPage);
      currentPage.getContent().typeFullNameInput('Test name');
      currentPage.getContent().typeEmailInput('email@test.com');

      currentPage.getContent().clickProfileSaveButton();
      cy.validateToast(currentPage);
      currentPage.getContent().getProfileImage()
      .invoke('attr', 'src')
      .should('match', /entando_400x400/);

    });

    it('Profile - Remove profile image', () => {
      currentPage = openMyProfile();

      currentPage.getContent().selectTab('profile');
      cy.wait(1000);

      currentPage.getContent().clickProfileEditButton();
      currentPage.getContent().clickUploadImageButton();
      currentPage.getContent().getProfileDropdown().find('li a').last().click();
      currentPage.getContent().clickProfileSaveButton();

      cy.validateToast(currentPage);
      currentPage.getContent().getProfileImage()
      .invoke('attr', 'src')
      .should('match', /user-icon/);

    });

    it('Preferences - set preferences', () => {
      currentPage = openMyProfile();

      currentPage.getContent().selectTab('preferences');
      cy.wait(1000);

      currentPage.getContent().toggleWelcomeWizard();
      currentPage.getContent().toggleMissingTranslationWizard();
      currentPage.getContent().toggleLoadOnPageSelectSwitch();
      currentPage.getContent().selectDefaultPageOwner('Administrators');
      currentPage.getContent().selectDefaultPageJoinGroups('Free Access');
      currentPage.getContent().selectDefaultContentOwnerGroup('Administrators');
      currentPage.getContent().selectDefaultContentJoinGroups('Free Access');
      currentPage.getContent().selectWidgetOwnerGroup('Administrators');

      currentPage.getContent().clickSettingsSaveBtn();
      cy.validateToast(currentPage);

      cy.userPreferencesController().then(controller => controller.resetUserPreferences(username));
    })
  });

  const openMyProfile = () => {
    cy.visit('/');
    currentPage = new HomePage();
    return currentPage.getNavbar().openUserMenu().openProfile();
  };

});
