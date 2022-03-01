import {groupsAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('groupsController', () => {
  cy.get('@tokens').then(tokens => {
    return new GroupsController(tokens.access_token);
  });
});

class GroupsController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addGroup(code, name) {
    cy.request({
      url: controller,
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

  deleteGroup(groupId) {
    cy.request({
      url: `${controller}/${groupId}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
