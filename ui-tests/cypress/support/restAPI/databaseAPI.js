const apiURL = Cypress.config('restAPI');
const controller = `${apiURL}database`;

Cypress.Commands.add('databaseController', () => {
  cy.get('@tokens').then(tokens => {
    return new DatabaseController(tokens.access_token);
  });
});

class DatabaseController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addBackup() {
    cy.request({
      url: `${controller}/startBackup`,
      method: 'POST',
      body: {},
      auth: {
        bearer: this.access_token
      }
    });
  }

  getBackupList() {
    cy.request({
      url: `${controller}?page=1&pageSize=0`,
      method: 'GET',
      body: {},
      auth: {
        bearer: this.access_token
      }
    });
  }

  deleteBackup(code) {
    cy.request({
      url: `${controller}/report/${code}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }
}
