import AbstractController from './abstractController';

import {languagesAPIURL} from './controllersEndPoints';

Cypress.Commands.add('languagesController', () => {
  cy.get('@tokens').then(tokens => {
    return new LanguagesController(languagesAPIURL, tokens.access_token);
  });
});

export default class LanguagesController extends AbstractController {

  putLanguage(code, description, isActive, isDefault = false) {
    return this.request({
      url: `${this.apiURL}/${code}`,
      method: 'PUT',
      body: {code, description, isActive, isDefault}
    });
  }

}
