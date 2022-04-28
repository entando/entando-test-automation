import AbstractController from '../abstractController';

import {profileTypesAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('profileTypesController', () => {
  cy.get('@tokens').then(tokens => {
    return new ProfileTypesController(profileTypesAPIURL, tokens.access_token);
  });
});

export default class ProfileTypesController extends AbstractController {

  addProfileType(code, name) {
    return this.request({
      method: 'POST',
      body: {
        code,
        name
      }
    });
  }

  deleteProfileType(code) {
    return this.request({
      url: `${this.apiURL}/${code}`,
      method: 'DELETE'
    });
  }

}
