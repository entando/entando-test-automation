const apiURL = Cypress.config('restAPI');
const controller = `${apiURL}plugins/cms/contentTypes`;

Cypress.Commands.add('contentTypesController', () => {
  cy.get('@tokens').then(tokens => {
    return new contentTypesController(tokens.access_token);
  });
})

class contentTypesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  postContentType(code, name) {
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

  postContentTypeAttribute(code, attribute) {
    cy.request({
      url: `${controller}/${code}/attributes`,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: {
        ...attribute
      }
    });
  }
}
