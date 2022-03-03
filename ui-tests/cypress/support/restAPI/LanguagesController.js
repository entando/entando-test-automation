import {languagesAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('languagesController', () => {
  cy.get('@tokens').then(tokens => {
    return new LanguagesController(tokens.access_token);
  });
});

export default class LanguagesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  putLanguage(code, description, isActive, isDefault = false) {
    cy.request({
      url: `${controller}/${code}`,
      method: 'PUT',
      body: {code, description, isActive, isDefault},
      auth: {
        bearer: this.access_token
      }
    });
  }

}
