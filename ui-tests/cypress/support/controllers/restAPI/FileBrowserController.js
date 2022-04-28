import AbstractController from '../abstractController';

import {fileBrowserAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('fileBrowserController', () => {
  cy.get('@tokens').then(tokens => {
    return new FileBrowserController(fileBrowserAPIURL, tokens.access_token);
  });
});

export default class FileBrowserController extends AbstractController {

  createFolder(path, protectedFolder = false) {
    return this.request({
      url: `${this.apiURL}/directory`,
      method: 'POST',
      body: {
        path: `/${path}`,
        protectedFolder: protectedFolder
      }
    });
  }

  deleteFolder(path, protectedFolder = false) {
    return this.request({
      url: `${this.apiURL}/directory`,
      method: 'DELETE',
      qs: {
        currentPath: path,
        protectedFolder: protectedFolder
      }
    });
  }

  createFile(fileInfo, protectedFolder = false) {
    return this.uploadTextFile(fileInfo, `${this.apiURL}/file`, protectedFolder);
  }

  deleteFile(path, protectedFolder = false) {
    return this.request({
      url: `${this.apiURL}/file`,
      method: 'DELETE',
      qs: {
        currentPath: path,
        protectedFolder: protectedFolder
      }
    });
  }

}
