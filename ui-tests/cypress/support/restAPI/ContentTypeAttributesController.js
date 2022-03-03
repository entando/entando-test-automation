import {contentTypesAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('contentTypeAttributesController', (contentTypeCode) => {
  cy.get('@tokens').then(tokens => {
    return new ContentTypeAttributesController(tokens.access_token, contentTypeCode);
  });
});

export default class ContentTypeAttributesController {

  constructor(access_token, contentTypeCode) {
    this.access_token = access_token;
    this.contentType  = contentTypeCode;
  }

  addAttribute(requestBody) {
    cy.request({
      url: `${controller}/${this.contentType}/attributes`,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: requestBody
    });
  }

  deleteAttribute(code) {
    cy.request({
      url: `${controller}/${this.contentType}/attributes/${code}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
