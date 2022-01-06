const apiURL     = Cypress.config('restAPI');
const controller = `${apiURL}fragments`;

Cypress.Commands.add('fragmentsController', () => {
  cy.get('@tokens').then(tokens => {
    return new FragmentsController(tokens.access_token);
  });
});

class FragmentsController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addFragment(code, guiCode) {
    cy.request({
      url: `${controller}`,
      method: 'POST',
      body: {
        code,
        guiCode,
      },
      auth: {
        bearer: this.access_token
      }
    });
  }

  updateFragment(code, guiCode) {
    cy.request({
      url: `${controller}/${code}`,
      method: 'PUT',
      body: {
        code,
        guiCode,
      },
      auth: {
        bearer: this.access_token
      }
    });
  }

  deleteFragment(code) {
    cy.request({
      url: `${controller}/${code}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
