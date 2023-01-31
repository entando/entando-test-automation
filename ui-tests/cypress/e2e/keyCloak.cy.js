import LoginPage from '../support/pageObjects/keycloak/LoginPage.js';
import HomePage  from '../support/pageObjects/HomePage';

describe('Keycloak', () => {

  const authBaseUrl = Cypress.env('auth_base_url').split('/');
  const origin      = `${authBaseUrl[0]}//${authBaseUrl[2]}`;

  const realm              = Cypress.env('auth_realm');
  const pathName           = `/${authBaseUrl[3]}/realms/${realm}/protocol/openid-connect/auth`;
  const passwordUpdatePath = `/${authBaseUrl[3]}/realms/${realm}/login-actions/required-action`;

  beforeEach(() => {
    cy.wrap(null).as('userToBeDeleted');
  });

  afterEach(() => {
    cy.get('@userToBeDeleted').then(user => {
      if (user) cy.usersController().then(controller => controller.deleteUser(user));
    });
  });

  const checkLocation = (origin, pathname) => {
    cy.location().should((location) => {
      expect(location.origin).to.eq(origin);
      expect(location.pathname).to.eq(pathname);
    });
  };

  it([Tag.SMOKE], 'Login via API client_credentials', () => {
    cy.kcClientCredentialsLogin();
  });

  it([Tag.SMOKE], 'Login/Logout via API authorization_code', () => {
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
    checkLocation(Cypress.config('baseUrl'), Cypress.config('basePath') + '/dashboard');

    cy.kcTokenLogout();

    cy.visit('/');
    checkLocation(origin, pathName);
  });

  it([Tag.SMOKE], 'Login/Logout via UI', () => {
    cy.visit('/');
    checkLocation(origin, pathName);

    cy.fixture(`users/login/admin`)
      .then(userData =>
        cy.wrap(new LoginPage())
          .then(page => page.login(userData)));
    checkLocation(Cypress.config('baseUrl'), Cypress.config('basePath') + '/dashboard');

    cy.wrap(new HomePage())
      .then(page => {
        HomePage.openPage();
        page.getNavbar().openUserMenu().logout();
      });
    checkLocation(origin, pathName);
  });

  it([Tag.FEATURE, 'ENG-4525'], 'A new user should be required to update the password only on first login', () => {
    cy.kcClientCredentialsLogin();
    cy.fixture('users/details/user').then(user => {
      cy.usersController().then(controller => {
        controller.addUser(user).then(() => cy.wrap(user.username).as('userToBeDeleted'));
        controller.addAuthorities(user.username, 'administrators', 'admin');
      });
    });

    cy.visit('/');
    checkLocation(origin, pathName);

    cy.fixture(`users/login/user`)
      .then(userData => {
        cy.wrap(new LoginPage())
          .then(page => {
            page.login(userData);
            checkLocation(origin, passwordUpdatePath);
            page.confirmPassword(userData);
            checkLocation(Cypress.config('baseUrl'), Cypress.config('basePath') + '/dashboard');

            cy.kcLogout();

            cy.visit('/');
            checkLocation(origin, pathName);
            page.login(userData);
            checkLocation(Cypress.config('baseUrl'), Cypress.config('basePath') + '/dashboard');
          });
      });
  });

});
