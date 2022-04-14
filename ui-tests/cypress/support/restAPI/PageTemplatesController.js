import AbstractController from './abstractController';

import {pageModelsAPIURL} from './controllersEndPoints';

Cypress.Commands.add('pageTemplatesController', () => {
  cy.get('@tokens').then(tokens => {
    return new PageTemplatesController(pageModelsAPIURL, tokens.access_token);
  });
});

export default class PageTemplatesController extends AbstractController {

  addPageTemplate(template) {
    return this.request({
      method: 'POST',
      body: template
    });
  }

  deletePageTemplate(code) {
    return this.request({
      url: `${this.apiURL}/${code}`,
      method: 'DELETE'
    });
  }

  getPageTemplatesList() {
    return this.request({
      url: `${this.apiURL}?page=1&pageSize=50`,
      method: 'GET'
    });
  }

}
