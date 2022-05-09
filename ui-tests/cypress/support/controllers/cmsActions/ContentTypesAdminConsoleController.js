import AbstractController from '../abstractController';

import {contentTypesURL} from '../controllersEndPoints';

Cypress.Commands.add('contentTypesAdminConsoleController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentTypesAdminConsoleController(contentTypesURL, tokens.access_token);
  });
});

export default class ContentTypesAdminConsoleController extends AbstractController {}
