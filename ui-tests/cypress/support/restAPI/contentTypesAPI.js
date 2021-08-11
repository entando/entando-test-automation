const apiURL     = Cypress.config('restAPI');
const controller = `${apiURL}plugins/cms/contentTypes`;

Cypress.Commands.add('contentTypesController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentTypesController(tokens.access_token);
  });
});

Cypress.Commands.add('contentTypeAttributeController', (contentTypeCode) => {
  cy.get('@tokens').then(tokens => {
    return new ContentTypeAttributesController(tokens.access_token, contentTypeCode);
  });
});

class ContentTypesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addContentType(code, name) {
    cy.request({
      url: `${controller}`,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: {
        code,
        name
      }
    });
  }

  deleteContentType(code) {
    cy.request({
      url: `${controller}/${code}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}

class ContentTypeAttributesController {

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
