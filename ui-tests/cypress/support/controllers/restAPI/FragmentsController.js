import AbstractController from '../abstractController';

import {fragmentsAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('fragmentsController', () => {
  cy.get('@tokens').then(tokens => {
    return new FragmentsController(fragmentsAPIURL, tokens.access_token);
  });
});

export default class FragmentsController extends AbstractController {

  addFragment(fragment) {
    return this.request({
      method: 'POST',
      body: fragment
    });
  }

  deleteFragment(code) {
    return this.request({
      url: `${this.apiURL}/${code}`,
      method: 'DELETE'
    });
  }

}
