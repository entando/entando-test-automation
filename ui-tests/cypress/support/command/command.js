require('cy-verify-downloads').addCustomCommand();

import addContext from 'mochawesome/addContext';

import HomePage from '../pageObjects/HomePage';

Cypress.Commands.overwrite('visit', (originalFn, url, options = {portalUI: false}) => {
  url = options.portalUI ? Cypress.config('portalUIPath') + url : Cypress.config('basePath') + url;
  return originalFn(url, options);
});

Cypress.Commands.add('pushAlias', (alias, value) => {
  cy.get(alias).then(values => {
    values.push(value);
    return cy.then(() => value);
  });
});

Cypress.Commands.add('unshiftAlias', (alias, value) => {
  cy.get(alias).then(values => {
    values.unshift(value);
    return cy.then(() => value);
  });
});

Cypress.Commands.add('deleteAlias', (alias, value = null) => {
  if (value) {
    cy.get(alias).then(values => {
      values.indexOf(value) !== -1 && values.splice(values.indexOf(value), 1);
      return cy.then(() => value);
    });
  } else {
    cy.wrap([]).as(alias);
    return null;
  }
});

Cypress.Commands.add('initWindowOpenChecker', () => {
  cy.window().then((win) => {
    cy.stub(win, 'open').as('windowOpen').callsFake(url => {
      cy.visit(url);
    });
  });
});

Cypress.Commands.add('addToReport', (context) => {
  cy.once('test:after:run', (test, runnable) => addContext({test}, context(test, runnable)));
});

Cypress.Commands.add('kcAPILogin', () => {
  Cypress.log({name: 'Login via client credentials'});
  const authBaseUrl   = Cypress.env('auth_base_url');
  const realm         = Cypress.env('auth_realm');
  const client_id     = Cypress.env('api_client_id');
  const client_secret = Cypress.env('api_client_secret');
  cy.request({
    method: 'post',
    url: authBaseUrl + '/realms/' + realm + '/protocol/openid-connect/token',
    body: {
      client_id: client_id,
      client_secret: client_secret,
      grant_type: 'client_credentials'
    },
    form: true,
    followRedirect: false
  }).its('body').as('tokens');
});

Cypress.Commands.add('kcUILogin', user => {
  performAuthorizationCodeLogin(user).its('body').as('UITokens');
  cy.visit('/');
  cy.wrap(new HomePage())
    .then(page => {
      page.closeAppTour();
      return cy.then(() => page);
    }).as('currentPage');
});

const performAuthorizationCodeLogin = (user) => {
  Cypress.log({name: 'Login via user authorization code'});
  return cy.fixture('users/' + user).then(userData => {
    const authBaseUrl = Cypress.env('auth_base_url');
    const realm       = Cypress.env('auth_realm');
    const client_id   = Cypress.env('auth_client_id');
    return cy.request({
               url: authBaseUrl + '/realms/' + realm + '/protocol/openid-connect/auth',
               method: 'GET',
               qs: {
                 scope: 'openid',
                 response_type: 'code',
                 approval_prompt: 'auto',
                 redirect_uri: Cypress.config('baseUrl'),
                 client_id: client_id
               },
               followRedirect: false,
               failOnStatusCode: false
             })
             .then(response => {
               const html     = document.createElement('html');
               html.innerHTML = response.body;
               const form     = html.getElementsByTagName('form')[0];
               const url      = form.action;
               return cy.request({
                 url: url,
                 method: 'POST',
                 body: {
                   username: userData.username,
                   password: userData.password
                 },
                 form: true,
                 followRedirect: false,
                 failOnStatusCode: false
               });
             })
             .then(response => {
               const url  = new URL(response.headers['location']);
               const code = url.searchParams.get('code');
               return cy.request({
                 url: authBaseUrl + '/realms/' + realm + '/protocol/openid-connect/token',
                 method: 'POST',
                 body: {
                   client_id: client_id,
                   redirect_uri: Cypress.config('baseUrl'),
                   code: code,
                   grant_type: 'authorization_code'
                 },
                 form: true,
                 followRedirect: false,
                 failOnStatusCode: false
               });
             })
             .then(response => {
               if (response.status !== 200) {
                 cy.log('Not logged in, retrying');
                 cy.kcLogout();
                 return performAuthorizationCodeLogin(user);
               }
               return cy.then(() => response);
             });
  });
};

Cypress.Commands.add('kcLogout', () => {
  Cypress.log({name: 'Logout'});
  const authBaseUrl = Cypress.env('auth_base_url');
  const realm       = Cypress.env('auth_realm');
  return cy.request({
    url: authBaseUrl + '/realms/' + realm + '/protocol/openid-connect/logout',
    method: 'GET'
  });
});

Cypress.Commands.add('kcUILogout', () => {
  Cypress.log({name: 'Logout'});
  const authBaseUrl = Cypress.env('auth_base_url');
  const realm       = Cypress.env('auth_realm');
  const client_id   = Cypress.env('auth_client_id');
  return cy.get('@UITokens').then(tokens => {
    return cy.request({
      url: authBaseUrl + '/realms/' + realm + '/protocol/openid-connect/logout',
      method: 'POST',
      body: {
        client_id: client_id,
        refresh_token: tokens.refresh_token
      },
      form: true
    });
  });
});
