import AbstractController from '../abstractController';

import {contentTypesJacmsURL} from '../controllersEndPoints';

Cypress.Commands.add('contentTypesJacmsAdminConsoleController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentTypesJacmsAdminConsoleController(contentTypesJacmsURL, tokens.access_token);
  });
});

export default class ContentTypesJacmsAdminConsoleController extends AbstractController {}
