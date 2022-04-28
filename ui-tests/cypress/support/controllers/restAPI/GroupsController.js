import AbstractController from '../abstractController';

import {groupsAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('groupsController', () => {
  cy.get('@tokens').then(tokens => {
    return new GroupsController(groupsAPIURL, tokens.access_token);
  });
});

export default class GroupsController extends AbstractController {

  addGroup(code, name) {
    return this.request({
      method: 'POST',
      body: {
        'code': code,
        'name': name
      }
    });
  }

  deleteGroup(groupId) {
    return this.request({
      url: `${this.apiURL}/${groupId}`,
      method: 'DELETE'
    });
  }

}
