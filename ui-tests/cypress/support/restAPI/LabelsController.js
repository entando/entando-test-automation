import AbstractController from './abstractController';

import {labelsAPIURL} from './controllersEndPoints';

Cypress.Commands.add('labelsController', () => {
  cy.get('@tokens').then(tokens => {
    return new LabelsController(labelsAPIURL, tokens.access_token);
  });
});

export default class LabelsController extends AbstractController {

  addLabel(key, titles) {
    return this.request({
      method: 'POST',
      body: {key, titles}
    });
  }

  removeLabel(code) {
    return this.request({
      url: `${this.apiURL}/${code}`,
      method: 'DELETE'
    });
  }

}
