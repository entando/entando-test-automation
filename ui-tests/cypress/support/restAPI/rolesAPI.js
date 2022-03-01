import {rolesAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('rolesController', () => {
  cy.get('@tokens').then(tokens => {
    return new RolesController(tokens.access_token);
  });
});

class RolesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addRole(role) {
    cy.request({
      url: controller,
      method: 'POST',
      body: role,
      auth: {
        bearer: this.access_token
      }
    });
  }

  deleteRole(roleId) {
    cy.request({
      url: `${controller}/${roleId}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
