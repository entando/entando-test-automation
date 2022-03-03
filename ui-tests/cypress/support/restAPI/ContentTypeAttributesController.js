import AbstractController from './abstractController';

import {contentTypesAPIURL} from './controllersEndPoints';

Cypress.Commands.add('contentTypeAttributesController', (contentTypeCode) => {
  cy.get('@tokens').then(tokens => {
    return new ContentTypeAttributesController(contentTypesAPIURL, tokens.access_token, contentTypeCode);
  });
});

export default class ContentTypeAttributesController extends AbstractController {

  constructor(apiURL, accessToken, contentTypeCode) {
    super(apiURL, accessToken);
    this.contentType = contentTypeCode;
  }

  addAttribute(requestBody) {
    return this.request({
      url: `${this.apiURL}/${this.contentType}/attributes`,
      method: 'POST',
      body: requestBody
    });
  }

  deleteAttribute(code) {
    return this.request({
      url: `${this.apiURL}/${this.contentType}/attributes/${code}`,
      method: 'DELETE'
    });
  }

}
