import {assetsAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('assetsController', () => {
  cy.get('@tokens').then(tokens => {
    return new AssetsController(tokens.access_token);
  });
});

export default class AssetsController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addAsset(fileInfo, metadata) {
    const {fileType, fileName, fixture} = fileInfo;
    return cy.fixture(fixture, 'base64')
             .then(f => Cypress.Blob.base64StringToBlob(f, fileType))
             .then((blob) => {
               const file     = new File([blob], fileName, {type: fileType});
               const formData = new FormData();
               formData.append('file', file);
               formData.append('metadata', JSON.stringify(metadata));
               return formData;
             })
             .then(body => cy.uploadRequest({
                   url: controller,
                   method: 'POST',
                   body,
                   auth: {bearer: this.access_token}
                 })
             )
             .then(response => ({controller: this, response: JSON.parse(response)}));
  }

  getAssetsList(type = 'image') {
    return cy.request({
      url: controller,
      method: 'GET',
      auth: {
        bearer: this.access_token
      },
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
    cy.request({
      url: `${controller}/${id}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}