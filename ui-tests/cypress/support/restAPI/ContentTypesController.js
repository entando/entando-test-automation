import {contentTypesAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('contentTypesController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentTypesController(tokens.access_token);
  });
});

export default class ContentTypesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addContentType(code, name) {
    cy.request({
      url: controller,
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
