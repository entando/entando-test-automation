import AbstractController from '../abstractController';

import {reloadConfigurationAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('reloadConfigurationController', () => {
  cy.get('@tokens').then(tokens => {
    return new ReloadConfigurationController(reloadConfigurationAPIURL, tokens.access_token);
  });
});

export default class ReloadConfigurationController extends AbstractController {}
