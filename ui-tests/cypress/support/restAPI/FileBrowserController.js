import AbstractController from './abstractController';

import {fileBrowserAPIURL} from './controllersEndPoints';

Cypress.Commands.add('fileBrowserController', () => {
  cy.get('@tokens').then(tokens => {
    return new FileBrowserController(fileBrowserAPIURL, tokens.access_token);
  });
});

export default class FileBrowserController extends AbstractController {

  createFolder(path) {
    return this.request({
      url: `${this.apiURL}/directory`,
      method: 'POST',
      body: {protectedFolder: false, path: `/${path}`}
    })
  }

  deleteFolder(path) {
    return this.request({
      url: `${this.apiURL}/directory`,
      method: 'DELETE',
      qs: {
        protectedFolder: false,
        currentPath: path
      }
    });
  }

  deleteFile(currentPath) {
    return this.request({
      url: `${this.apiURL}/file`,
      method: 'DELETE',
      qs: {
        protectedFolder: false,
        currentPath: currentPath
      }
    });
  }

}
