import AbstractController from './abstractController';

import {assetsAPIURL} from './controllersEndPoints';

Cypress.Commands.add('assetsController', () => {
  cy.get('@tokens').then(tokens => {
    return new AssetsController(assetsAPIURL, tokens.access_token);
  });
});

export default class AssetsController extends AbstractController {

  addAsset(fileInfo, metadata) {
    return this.uploadFixture(fileInfo, metadata);
  }

  getAssetsList(type = 'image') {
    return this.request({
      method: 'GET',
      qs: {
        type,
        sort: 'createdAt',
        direction: 'DESC',
        page: 1,
        pageSize: 10
      }
    });
  }

  deleteAsset(id) {
    return this.request({
      url: `${this.apiURL}/${id}`,
      method: 'DELETE'
    });
  }

}
