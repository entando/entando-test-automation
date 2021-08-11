const apiURL     = Cypress.config('restAPI');
const controller = `${apiURL}roles`;

Cypress.Commands.add('rolesController', () => {
  cy.get('@tokens').then(tokens => {
    return new RolesController(tokens.access_token);
  });
});

class RolesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addRole(code, name) {
    cy.request({
      url: `${controller}`,
      method: 'POST',
      body: {
        'code': code,
        'name': name
      },
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
