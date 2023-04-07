import LoginPage      from '../support/pageObjects/keycloak/LoginPage.js';
import HomePage       from '../support/pageObjects/HomePage';
import {htmlElements} from '../support/pageObjects/WebElement';

describe('Keycloak', () => {

  const authBaseUrl = Cypress.env('auth_base_url');
  const origin      = Cypress.config('baseUrl');

  const realm              = Cypress.env('auth_realm');
  const pathName           = `${authBaseUrl}/realms/${realm}/protocol/openid-connect/auth`;
  const passwordUpdatePath = `${authBaseUrl}/realms/${realm}/login-actions/required-action`;

  beforeEach(() => {
    cy.wrap(null).as('userToBeDeleted');
  });

  afterEach(() => {
    cy.kcClientCredentialsLogin();
    cy.get('@userToBeDeleted').then(user => {
      if (user) cy.usersController().then(controller => controller.deleteUser(user));
    });
    cy.kcTokenLogout();
    cy.kcLogout();
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

  describe('GitHub integration', () => {

    it([Tag.WIP], 'Login with GitHub credentials', () => {
      const githubCredentials = {
        clientId: 'f9b7c11975299e373cf7',
        clientSecret: '1917a5786c4f91c5cdc5d521e9725d00cf738d63',
        username: 'entandogithublogin@gmail.com',
        password: 'githublogintest'
      };
      const keyCloakCredentials ={
        username: 'entando_keycloak_admin',
        password: 'Anp7JH9hgT4BOQ=='
      };
      cy.visit('/', {administrationConsole: true});
      checkLocation(origin, `${authBaseUrl}/`);
      cy.get(`${htmlElements.div}.welcome-primary-link`).find(htmlElements.a).click();
      checkLocation(origin, `${authBaseUrl}/realms/master/protocol/openid-connect/auth`);
      cy.wrap(new LoginPage())
        .then(page => page.login({username: keyCloakCredentials.username, password: keyCloakCredentials.password}));
      cy.waitForStableDOM();
      accessIdentityProviders();
      cy.get(`${htmlElements.select}.form-control[ng-model="provider"]`).eq(0).select('GitHub');
      cy.waitForStableDOM();
      cy.get(`${htmlElements.input}#clientId`).type(githubCredentials.clientId);
      cy.get(`${htmlElements.input}#clientSecret`).type(githubCredentials.clientSecret);
      cy.get(`${htmlElements.button}.btn-primary[type=submit]`).click();
      cy.waitForStableDOM();
      const socialLoginOptions = {
        username: githubCredentials.username,
        password: githubCredentials.password,
        loginSelector: '#zocial-github',
        loginUrl: Cypress.config('baseUrl') + Cypress.config('basePath') + '/dashboard',
        args: ['--no-sandbox'],
        postLoginSelector: '#root'
      };
      cy.task('GitHubSocialLogin', socialLoginOptions).then(results => {
        results['cookies'].forEach(cookie => {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure
          })
        });
        cy.window().then(window => Object.keys(results.lsd).forEach(key => window.localStorage.setItem(key, results.lsd[key])));
        cy.visit('/');
        cy.get(`${htmlElements.a}#zocial-github`).should('exist').and('be.visible').click();
        cy.wrap(true).as('githubAdded');
        cy.get(`${htmlElements.input}#login_field`).type(githubCredentials.username);
        cy.get(`${htmlElements.input}#password`).type(githubCredentials.password);
        cy.get(`${htmlElements.input}[type=submit]`).click();
        cy.waitForStableDOM();
        cy.getGithubCodeFromEmail().then(verificationCode => {
          if (verificationCode) cy.get('#otp').type(verificationCode)
        });
        checkLocation(Cypress.config('baseUrl'), Cypress.config('basePath') + '/dashboard');
        cy.wrap('dummylogintest').as('userToBeDeleted');
      });
    });

    beforeEach(() => cy.wrap(false).as('githubAdded'));

    afterEach(() => {
      cy.get('@githubAdded').then(added => {
        if (added) {
          cy.visit('/', {administrationConsole: true});
          checkLocation(origin, `${authBaseUrl}/`);
          cy.get(`${htmlElements.div}.welcome-primary-link`).find(htmlElements.a).click();
          cy.waitForStableDOM();
          accessIdentityProviders();
          cy.get(`${htmlElements.td}.kc-action-cell.ng-binding`).eq(1).click();
          cy.get(`${htmlElements.button}.ng-binding.btn.btn-danger`).click();
          cy.waitForStableDOM();
          cy.get(`${htmlElements.select}.form-control[ng-model="provider"]`).should('exist').and('be.visible');
        }
      })
    });

    const accessIdentityProviders = () => {
      checkLocation(origin, `${authBaseUrl}/admin/master/console/`);
      cy.get(`${htmlElements.div}.sidebar-pf-left`).find(`${htmlElements.div}.nav-category`).eq(0)
        .children(`${htmlElements.ul}.nav-stacked`)
        .children(`${htmlElements.li}[data-ng-show="access.viewIdentityProviders"]`)
        .children(`${htmlElements.a}`).click();
      cy.waitForStableDOM();
    }

  });

});
