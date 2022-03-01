import {contentModelsAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('contentTemplatesController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentTemplatesController(tokens.access_token);
  });
});

class ContentTemplatesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addContentTemplate(template) {
    cy.request({
      url: controller,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: template
    });
  }

  deleteContentTemplate(code) {
    cy.request({
      url: `${controller}/${code}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
