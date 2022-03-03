import AbstractController from './abstractController';

import {contentTypesAPIURL} from './controllersEndPoints';

Cypress.Commands.add('contentTypesController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentTypesController(contentTypesAPIURL, tokens.access_token);
  });
});

export default class ContentTypesController extends AbstractController {

  addContentType(code, name) {
    return this.request({
      method: 'POST',
      body: {
        code,
        name
      }
    });
  }

  deleteContentType(code) {
    return this.request({
      url: `${this.apiURL}/${code}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
