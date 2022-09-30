import AbstractController from '../abstractController';

import {pagesAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('pagesController', () => {
  cy.get('@tokens').then(tokens => {
    return new PagesController(pagesAPIURL, tokens.access_token);
  });
});

export default class PagesController extends AbstractController {

  setPageStatus(id, status) {
    return this.request({
      url: `${this.apiURL}/${id}/status`,
      method: 'PUT',
      body: {status}
    });
  }

  deletePage(id) {
    return this.request({
      url: `${this.apiURL}/${id}`,
      method: 'DELETE'
    });
  }

  movePage(id, parent, position) {
    return this.request({
      url: `${this.apiURL}/${id}/position`,
      method: 'PUT',
      body: {
        code: id,
        parentCode: parent,
        position
      }
    })
  }

}
