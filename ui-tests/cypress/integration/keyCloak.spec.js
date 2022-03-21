import LoginPage from '../support/pageObjects/keycloak/LoginPage.js';
import HomePage  from '../support/pageObjects/HomePage';

describe([Tag.SMOKE], 'Keycloack', () => {

  const authBaseUrl = Cypress.env('auth_base_url').split('/');
  const origin      = `${authBaseUrl[0]}//${authBaseUrl[2]}`;

  const realm    = Cypress.env('auth_realm');
  const pathName = `/${authBaseUrl[3]}/realms/${realm}/protocol/openid-connect/auth`;

  it('Login/Logout via UI', () => {
    let currentPage;
    cy.visit('/');

    cy.location().should((location) => {
      expect(location.origin).to.eq(origin);
      expect(location.pathname).to.eq(pathName);
    });

    cy.fixture(`users/login/admin`)
      .then((userData) => {
        currentPage = new LoginPage();
        currentPage.login(userData);
      });

    cy.location().should((location) => {
      expect(location.origin).to.eq(Cypress.config('baseUrl'));
      expect(location.pathname).to.eq(Cypress.config('basePath') + '/dashboard');
    });

    currentPage = new HomePage();
    currentPage.getNavbar().openUserMenu().logout();

    cy.location().should((location) => {
      expect(location.origin).to.eq(origin);
      expect(location.pathname).to.eq(pathName);
    });
  });

  it('Login/Logout via API', () => {
    cy.kcUILogin('login/admin');

    cy.location().should((location) => {
      expect(location.origin).to.eq(Cypress.config('baseUrl'));
      expect(location.pathname).to.eq(Cypress.config('basePath') + '/dashboard');
    });

    cy.kcUILogout();

    cy.location().should((location) => {
      expect(location.origin).to.eq(origin);
      expect(location.pathname).to.eq(pathName);
    });
  });

});
