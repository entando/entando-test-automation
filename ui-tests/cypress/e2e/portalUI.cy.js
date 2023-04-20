import {htmlElements} from '../support/pageObjects/WebElement';
import LoginPage      from '../support/pageObjects/keycloak/LoginPage';

describe('Portal UI', () => {

  it('ENG-4181', 'Non-existent URL MUST return 404 status code and Page not found page', () => {
    const baseURL = Cypress.config('portalUIPath');
    const pageURL = '/cypress.page';

    cy.request({
      url: baseURL + pageURL,
      followRedirect: false,
      failOnStatusCode: false
    }).then((resp) => {
      expect(resp.status).to.eq(404);
      expect(resp.redirectedToUrl).to.eq(undefined);
    });
    cy.visit('/cypress.page', {portalUI: true, failOnStatusCode: false});
    cy.location().should((location) => {
      expect(location.pathname).to.eq(`${baseURL}/cypress.page`);
    });
    cy.get('h1').should('have.text', 'Page not found');
  });

  describe('Protocol for Entando App', () => {

    const httpsUrl = `${Cypress.config('baseUrl').replace('http', 'https')}/*`;
    const keyCloakCredentials ={
      username: 'entando_keycloak_admin',
      password: 'Anp7JH9hgT4BOQ=='
    };

    beforeEach(() => {
      cy.wrap(null).as('addedRedirectURI');
      cy.visit('/', {administrationConsole: true});
      cy.get(`${htmlElements.div}.welcome-primary-link`).find(htmlElements.a).click();
      cy.waitForStableDOM();
      cy.wrap(new LoginPage())
        .then(page => page.login({username: keyCloakCredentials.username, password: keyCloakCredentials.password}));
      cy.waitForStableDOM();
      accessClientOnAdministrationConsole();
      cy.get(`${htmlElements.input}#newRedirectUri`).type(httpsUrl);
      cy.get(`${htmlElements.button}.btn-primary[type=submit]`).click();
      cy.waitForStableDOM();
      cy.get(`${htmlElements.div}.alert-success`).should('exist').and('be.visible');
      cy.wrap(true).as('addedRedirectURI');
    });

    afterEach(() => {
      cy.get('@addedRedirectURI').then(added => {
        if (added) {
          cy.visit('/', {administrationConsole: true});
          cy.get(`${htmlElements.div}.welcome-primary-link`).find(htmlElements.a).click();
          cy.waitForStableDOM();
          accessClientOnAdministrationConsole();
          cy.get(`${htmlElements.input}#newRedirectUri`).parent().parent().find(`${htmlElements.div}.input-group-btn`)
            .eq(0).find(`${htmlElements.button}[type=button]`).click();
          cy.get(`${htmlElements.button}.btn-primary[type=submit]`).click();
        }
      });
    });

    const accessClientOnAdministrationConsole = () => {
      cy.get(`${htmlElements.div}.sidebar-pf-left`).find(`${htmlElements.div}.nav-category`).eq(0)
        .children(`${htmlElements.ul}.nav-stacked`)
        .children(`${htmlElements.li}[data-ng-show="access.queryClients"]`)
        .children(`${htmlElements.a}`).click();
      cy.waitForStableDOM();
      cy.get(`${htmlElements.a}.ng-binding`).contains(Cypress.env('auth_client_id')).click();
      cy.waitForStableDOM();
    }

    it([Tag.FEATURE, 'ENG-4775'], 'The right protocol should be used depending on TLS', () => {
      cy.intercept({
        method: 'GET',
        pathname: '/entando-de-app/keycloak.json'
      }).as('keycloakIntercept')
      cy.visit('/my_homepage.page', {portalUI: true});
      cy.waitForStableDOM();
      cy.wait('@keycloakIntercept').then(interception => {
        cy.wrap(`${interception.response.url}`)
          .then(url => {
            const protocol = new URL(url).protocol;
            cy.addToReport(() => ({
              title: 'The protocol being tested is',
              value: protocol
            }));
            const hostName = new URL(url).hostname;
            const baseUrl = protocol + '//' + hostName;
            const portalUIUrl = baseUrl + '/entando-de-app/';
            cy.get('header-fragment').should('have.attr', 'app-url', `${portalUIUrl}`).as('headerFragment');
            cy.get('@headerFragment').children('.HeaderFragment')
              .children(htmlElements.a)
              .children(htmlElements.img).should('have.attr', 'src', `${portalUIUrl}resources/static/img/Entando_light.svg`);
            cy.get('@headerFragment').find(`${htmlElements.ul}[role="menubar"]`)
              .find(`${htmlElements.a}.bx--header__menu-item`)
              .eq(0).should('have.attr', 'href', `${portalUIUrl}en/my_homepage.page`).as('homePageButton');
            cy.get('@headerFragment').find(`${htmlElements.ul}[role="menubar"]`)
              .find(`${htmlElements.a}.bx--header__menu-item`)
              .eq(1).should('have.attr', 'href', `${portalUIUrl}en/about_us.page`).as('aboutUsButton');
            cy.get('search-bar-widget').should('have.attr', 'action-url', `${portalUIUrl}en/search_result.page`);
            cy.get('login-button-widget').should('have.attr', 'redirect-url', `${portalUIUrl}en/my_homepage.page`);
            cy.get('@aboutUsButton').click();
            cy.waitForStableDOM();
            cy.location().should(location => {
              expect(location.protocol).to.eq(protocol);
              expect(location.origin).to.eq(baseUrl);
              expect(location.pathname).to.eq('/entando-de-app/en/about_us.page');
            });
          });
      });
    });

  });

});
