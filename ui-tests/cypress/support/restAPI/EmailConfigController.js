import {SMTPServerAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('emailConfigController', () => {
  cy.get('@tokens').then(tokens => {
    return new EmailConfigController(tokens.access_token);
  });
});

const smtpDefaultSettings = {
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

export default class EmailConfigController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  defaultSettings() {
    cy.request({
      url: controller,
      method: 'PUT',
      body: {
        ...smtpDefaultSettings
      },
      auth: {
        bearer: this.access_token
      }
    });
  }

}