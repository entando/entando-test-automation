import AbstractController from './abstractController';

import {databaseAPIURL} from './controllersEndPoints';

Cypress.Commands.add('databaseController', () => {
  cy.get('@tokens').then(tokens => {
    return new DatabaseController(databaseAPIURL, tokens.access_token);
  });
});

export default class DatabaseController extends AbstractController {

  addBackup() {
    return this.request({
      url: `${this.apiURL}/startBackup`,
      method: 'POST'
    });
  }

  getBackupList() {
    return this.request({
      method: 'GET',
      qs: {
        page: 1,
        pageSize: 0
      }
    });
  }

  deleteBackup(code) {
    return this.request({
      url: `${this.apiURL}/report/${code}`,
      method: 'DELETE'
    });
  }

}
