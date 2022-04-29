import AbstractController from '../abstractController';

import {contentModelsURL} from '../controllersEndPoints';

Cypress.Commands.add('contentTemplatesAdminConsoleController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentTemplatesAdminConsoleController(contentModelsURL, tokens.access_token);
  });
});

export default class ContentTemplatesAdminConsoleController extends AbstractController {}
