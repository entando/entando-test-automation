const apiURL     = Cypress.config('restAPI');
const controller = `${apiURL}pages`;

Cypress.Commands.add('pageWidgetsController', (pageCode) => {
  cy.get('@tokens').then(tokens => {
    return new PageWidgetsController(tokens.access_token, pageCode);
  });
});

class PageWidgetsController {

  constructor(access_token, pageCode) {
    this.access_token = access_token;
    this.pageCode     = pageCode;
  }

  addWidget(frameCode, widgetCode, config) {
    cy.request({
      url: `${controller}/${this.pageCode}/widgets/${frameCode}`,
      method: 'PUT',
      auth: {
        bearer: this.access_token
      },
      body: {
        code: widgetCode,
        config
      }
    });
  }

  deleteWidget(frameCode) {
    cy.request({
      url: `${controller}/${this.pageCode}/widgets/${frameCode}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
