import AbstractController from '../abstractController';

import {contentsAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('contentsController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentsController(contentsAPIURL, tokens.access_token);
  });
});

export default class ContentsController extends AbstractController {

  getContent(contentId) {
    return this.request({
      url: `${this.apiURL}/${contentId}`,
      method: 'GET',
    });
  }

  getContentList() {
    return this.request({
      method: 'GET',
      qs: {
        sort: 'lastModified',
        direction: 'DESC',
        mode: 'full',
        page: 1,
        pageSize: 20
      }
    });
  }

  addContent(content) {
    return this.request({
      method: 'POST',
      body: [{
        ...content
      }]
    });
  }

  deleteContent(id) {
    return this.request({
      url: `${this.apiURL}/${id}`,
      method: 'DELETE'
    });
  }

  updateStatus(id, status) {
    return this.request({
      url: `${this.apiURL}/status`,
      method: 'PUT',
      body: {
        codes: [id],
        status
      }
    });
  }

}
