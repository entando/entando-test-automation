import AbstractController from './abstractController';

import {rolesAPIURL} from './controllersEndPoints';

Cypress.Commands.add('rolesController', () => {
  cy.get('@tokens').then(tokens => {
    return new RolesController(rolesAPIURL, tokens.access_token);
  });
});

export default class RolesController extends AbstractController {

  addRole(role) {
    return this.request({
      method: 'POST',
      body: role
    });
  }

  deleteRole(roleId) {
    return this.request({
      url: `${this.apiURL}/${roleId}`,
      method: 'DELETE'
    });
  }

}
