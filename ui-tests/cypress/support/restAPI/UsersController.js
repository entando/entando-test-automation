import AbstractController from './abstractController';

import {usersAPIURL} from './controllersEndPoints';

Cypress.Commands.add('usersController', () => {
  cy.get('@tokens').then(tokens => {
    return new UsersController(usersAPIURL, tokens.access_token);
  });
});

export default class UsersController extends AbstractController {

  addUser(user) {
    return this.request({
      method: 'POST',
      body: user
    });
  }

  updateUser(user) {
    return this.request({
      url: `${this.apiURL}/${user.username}`,
      method: 'PUT',
      body: user
    });
  }

  addAuthorities(username, group, role) {
    return this.request({
      url: `${this.apiURL}/${username}/authorities`,
      method: 'POST',
      body: [{
        group,
        role
      }]
    });
  }

  deleteAuthorities(username) {
    return this.request({
      url: `${this.apiURL}/${username}/authorities`,
      method: 'DELETE'
    });
  }

  deleteUser(username) {
    return this.request({
      url: `${this.apiURL}/${username}`,
      method: 'DELETE'
    });
  }

  changePassword(username, passwords) {
    return this.request({
      url: `${this.apiURL}/${username}/password`,
      method: 'POST',
      body: {
        ...passwords
      }
    });
  }

}
