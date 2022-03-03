import {fragmentsAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('fragmentsController', () => {
  cy.get('@tokens').then(tokens => {
    return new FragmentsController(tokens.access_token);
  });
});

export default class FragmentsController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addFragment(fragment) {
    cy.request({
      url: controller,
      method: 'POST',
      body: fragment,
      auth: {
        bearer: this.access_token
      }
    });
  }

  deleteFragment(code) {
    cy.request({
      url: `${controller}/${code}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}