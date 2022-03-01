import {pageModelsAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('pageTemplatesController', () => {
  cy.get('@tokens').then(tokens => {
    return new PageTemplatesController(tokens.access_token);
  });
});

class PageTemplatesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addPageTemplate(template) {
    cy.request({
      url: controller,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: template
    });
  }

  deletePageTemplate(code) {
    cy.request({
      url: `${controller}/${code}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
