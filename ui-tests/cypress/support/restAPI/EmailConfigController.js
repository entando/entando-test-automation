import AbstractController from './abstractController';

import {SMTPServerAPIURL} from './controllersEndPoints';

Cypress.Commands.add('emailConfigController', () => {
  cy.get('@tokens').then(tokens => {
    return new EmailConfigController(SMTPServerAPIURL, tokens.access_token);
  });
});

export default class EmailConfigController extends AbstractController {

  smtpDefaultSettings = {
    active: false,
    checkServerIdentity: true,
    debugMode: false,
    host: 'localhost',
    password: '',
    port: 25000,
    protocol: 'STD',
    timeout: null,
    username: ''
  };

  defaultSettings() {
    return this.request({
      method: 'PUT',
      body: this.smtpDefaultSettings
    });
  }

}
