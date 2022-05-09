import AbstractController                from '../abstractController';
import {assetsURL} from '../controllersEndPoints';

Cypress.Commands.add('assetsAdminConsoleController', () => {
  cy.get('@tokens').then(tokens => {
    return new AssetsAdminConsoleController(assetsURL, tokens.access_token);
  });
});

export default class AssetsAdminConsoleController extends AbstractController {}
