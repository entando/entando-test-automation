import {profileTypesAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('profileTypesController', () => {
  cy.get('@tokens').then(tokens => {
    return new ProfileTypesController(tokens.access_token);
  });
});

export default class ProfileTypesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addProfileType(code, name) {
    cy.request({
      url: controller,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: {
        code,
        name
      }
    });
  }

  deleteProfileType(code) {
    cy.request({
      url: `${controller}/${code}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
