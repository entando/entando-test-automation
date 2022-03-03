import AbstractController from './abstractController';

import {seoPagesAPIURL} from './controllersEndPoints';

Cypress.Commands.add('seoPagesController', () => {
  cy.get('@tokens').then(tokens => {
    return new SeoPagesController(seoPagesAPIURL, tokens.access_token);
  });
});

export default class SeoPagesController extends AbstractController {

  addNewPage(page) {
    return this.request({
      method: 'POST',
      body: page
    });
  }

}
