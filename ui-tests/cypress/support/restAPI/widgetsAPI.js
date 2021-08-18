const apiURL     = Cypress.config('restAPI');
const controller = `${apiURL}widgets`;

Cypress.Commands.add('widgetsController', () => {
  cy.get('@tokens').then(tokens => {
    return new WidgetsController(tokens.access_token);
  });
});

class WidgetsController {
  constructor(access_token) {
    this.access_token = access_token;
  }

  addWidget(widget) {
    return cy.request({
      url: `${controller}`,
      method: 'POST',
      auth: {
        bearer: this.access_token
      },
      body: {
        ...widget
      }
    });
  }

  deleteWidget(widgetCode) {
    cy.request({
      url: `${controller}/${widgetCode}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }
}
