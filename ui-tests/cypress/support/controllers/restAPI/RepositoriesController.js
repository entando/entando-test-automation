import AbstractController from '../abstractController';

import {digitalExchangeURL} from '../controllersEndPoints';

Cypress.Commands.add('repositoriesController', () => {
  cy.get('@tokens').then(tokens => {
    return new RepositoriesController(digitalExchangeURL, tokens.access_token);
  });
});

export default class RepositoriesController extends AbstractController {

  addRegistry(registry) {
    return this.request({
      url: `${this.apiURL}/registries`,
      method: 'POST',
      body: {
        name: registry.name,
        url: registry.url
      }
    })
  }

  deleteRegistry(code) {
    return this.request({
      url: `${this.apiURL}/registries/${code}`,
      method: 'DELETE'
    });
  }

  deployBundle(bundle) {
    return this.request({
      url: `${this.apiURL}/components`,
      method: 'POST',
      body: {
        bundleGroups: bundle.bundleGroups,
        bundleId: bundle.bundleId,
        descriptionImage: bundle.descriptionImage,
        gitRepoAddress: bundle.gitRepoAddress,
        name: bundle.bundleName
      }
    });
  }

  installBundle(bundle) {
    return this.request({
      url: `${this.apiURL}/components/${bundle.installCode}/installplans`,
      method: 'POST',
      body: {
        version: bundle.version
      }
    }).then(payload => this.request({
      url: `${this.apiURL}/components/${bundle.installCode}/installplans`,
      method: 'PUT',
      body: payload
    })).then(() => {
      const checkInstallation = () => {
        this.request({
          url: `${this.apiURL}/components/${bundle.installCode}/installplans`,
          method: 'GET'
        }).then(res => {
          if (res.body.payload.status !== 'INSTALL_COMPLETED') {
            cy.wait(3000);
            checkInstallation();
          }
          cy.wrap(res.body.payload.componentId);
        });
      }
      checkInstallation();
    });
  }

  undeployBundle(code) {
    return this.request({
      url: `${this.apiURL}/components/${code}`,
      method: 'DELETE'
    });
  }

  uninstallBundle(code) {
    return this.request({
      url: `${this.apiURL}/components/${code}/uninstall`,
      method: 'POST'
    });
  }

}
