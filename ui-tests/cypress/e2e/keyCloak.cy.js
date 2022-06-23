import LoginPage from '../support/pageObjects/keycloak/LoginPage.js';
import HomePage  from '../support/pageObjects/HomePage';

describe([Tag.SMOKE], 'Keycloack', () => {

  const authBaseUrl = Cypress.env('auth_base_url').split('/');
  const origin      = `${authBaseUrl[0]}//${authBaseUrl[2]}`;

  const realm    = Cypress.env('auth_realm');
  const pathName = `/${authBaseUrl[3]}/realms/${realm}/protocol/openid-connect/auth`;

  it('Login via API client_credentials', () => {
    cy.kcClientCredentialsLogin();
  });

  it('Login/Logout via API authorization_code', () => {
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
    cy.location().should((location) => {
      expect(location.origin).to.eq(Cypress.config('baseUrl'));
      expect(location.pathname).to.eq(Cypress.config('basePath') + '/dashboard');
    });

    cy.kcTokenLogout();

    cy.visit('/');
    cy.location().should((location) => {
      expect(location.origin).to.eq(origin);
      expect(location.pathname).to.eq(pathName);
    });
  });

  it('Login/Logout via UI', () => {
    cy.visit('/');
    cy.location().should((location) => {
      expect(location.origin).to.eq(origin);
      expect(location.pathname).to.eq(pathName);
    });

    cy.fixture(`users/login/admin`)
      .then(userData =>
          cy.wrap(new LoginPage())
            .then(page => page.login(userData)));
    cy.location().should((location) => {
      expect(location.origin).to.eq(Cypress.config('baseUrl'));
      expect(location.pathname).to.eq(Cypress.config('basePath') + '/dashboard');
    });

    cy.wrap(new HomePage())
        .then(page => {
          page.closeAppTour();
          page.getNavbar().openUserMenu().logout();
        });
    cy.location().should((location) => {
      expect(location.origin).to.eq(origin);
      expect(location.pathname).to.eq(pathName);
    });
  });

});
