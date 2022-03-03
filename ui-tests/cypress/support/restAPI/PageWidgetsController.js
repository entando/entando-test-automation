import AbstractController from './abstractController';

import {pagesAPIURL} from './controllersEndPoints';

Cypress.Commands.add('pageWidgetsController', (pageCode) => {
  cy.get('@tokens').then(tokens => {
    return new PageWidgetsController(pagesAPIURL, tokens.access_token, pageCode);
  });
});

export default class PageWidgetsController extends AbstractController {

  constructor(apiURL, accessToken, pageCode) {
    super(apiURL, accessToken);
    this.pageCode = pageCode;
  }

  addWidget(frameCode, widgetCode, config) {
    return this.request({
      url: `${this.apiURL}/${this.pageCode}/widgets/${frameCode}`,
      method: 'PUT',
      body: {
        code: widgetCode,
        config
      }
    });
  }

  deleteWidget(frameCode) {
    return this.request({
      url: `${this.apiURL}/${this.pageCode}/widgets/${frameCode}`,
      method: 'DELETE'
    });
  }

}
