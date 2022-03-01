import {labelsAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('labelsController', () => {
  cy.get('@tokens').then(tokens => {
    return new LabelsController(tokens.access_token);
  });
});

class LabelsController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addLabel(key, titles) {
    cy.request({
      url: controller,
      method: 'POST',
      body: {key, titles},
      auth: {
        bearer: this.access_token
      }
    });
  }

  removeLabel(code) {
    cy.request({
      url: `${controller}/${code}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
