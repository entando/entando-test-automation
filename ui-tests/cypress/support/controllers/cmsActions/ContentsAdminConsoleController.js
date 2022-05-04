import AbstractController from '../abstractController';

import {contentManagementURL} from '../controllersEndPoints';

Cypress.Commands.add('contentsAdminConsoleController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentsAdminConsoleController(contentManagementURL, tokens.access_token);
  });
});

export default class ContentsAdminConsoleController extends AbstractController {}
