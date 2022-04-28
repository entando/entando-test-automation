import AbstractController from '../abstractController';

import {SMTPServerAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('smtpServerController', () => {
  cy.get('@tokens').then(tokens => {
    return new SMTPServerController(SMTPServerAPIURL, tokens.access_token);
  });
});

export default class SMTPServerController extends AbstractController {

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
