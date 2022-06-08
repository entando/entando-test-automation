import AbstractController from '../abstractController';

import {seoPagesAPIURL} from '../controllersEndPoints';

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

  setPageJoinGroups(page, newJoinGroups) {
    page.joinGroups = newJoinGroups;
    return this.request({
      url: `${this.apiURL}/${page.code}`,
      method: 'PUT',
      body: page
    });
  }

}
