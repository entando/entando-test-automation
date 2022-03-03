import {fileBrowserAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('fileBrowserController', () => {
  cy.get('@tokens').then(tokens => {
    return new FileBrowserController(tokens.access_token);
  });
});

export default class FileBrowserController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  deleteFile(currentPath) {
    cy.request({
      url: controller,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      },
      qs: {
        protectedFolder: false,
        currentPath: currentPath
      }
    });
  }

}
