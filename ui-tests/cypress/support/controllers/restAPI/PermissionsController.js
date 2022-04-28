import AbstractController from '../abstractController';

import {permissionsAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('permissionsController', () => {
  cy.get('@tokens').then(tokens => {
    return new PermissionsController(permissionsAPIURL, tokens.access_token);
  });
});

export default class PermissionsController extends AbstractController {}
