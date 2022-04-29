import AbstractController from '../abstractController';

import {categoriesURL} from '../controllersEndPoints';

Cypress.Commands.add('categoriesAdminConsoleController', () => {
  cy.get('@tokens').then(tokens => {
    return new CategoriesAdminConsoleController(categoriesURL, tokens.access_token);
  });
});

export default class CategoriesAdminConsoleController extends AbstractController {}
