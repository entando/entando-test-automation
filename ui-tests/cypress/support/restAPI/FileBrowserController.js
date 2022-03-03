import AbstractController from './abstractController';

import {fileBrowserAPIURL} from './controllersEndPoints';

Cypress.Commands.add('fileBrowserController', () => {
  cy.get('@tokens').then(tokens => {
    return new FileBrowserController(fileBrowserAPIURL, tokens.access_token);
  });
});

export default class FileBrowserController extends AbstractController {

  deleteFile(currentPath) {
    return this.request({
      method: 'DELETE',
      qs: {
        protectedFolder: false,
        currentPath: currentPath
      }
    });
  }

}
