const controller = `${Cypress.config('restAPI')}users`;

Cypress.Commands.add('usersController', () => {
  cy.get('@tokens').then(tokens => {
    return new UsersController(tokens.access_token);
  });
});

class UsersController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  addUser(username, password, passwordConfirm, profileType) {
    cy.request({
      url: `${controller}`,
      method: 'POST',
      body: {
        'username': username,
        'password': password,
        'passwordConfirm': passwordConfirm,
        'profileType': profileType
      },
      auth: {
        bearer: this.access_token
      }
    });
  }
  
  addUserObj(user) {
    cy.request({
      url: `${controller}`,
      method: 'POST',
      body: user,
      auth: {
        bearer: this.access_token
      }
    });
  }
  
  updateUser(user) {
    cy.request({
      url: `${controller}/${user.username}`,
      method: 'PUT',
      body: user,
      auth: {
        bearer: this.access_token
      }
    });
  }

  addAuthorities(username, group, role) {
    cy.request({
      url: `${controller}/${username}/authorities`,
      method: 'POST',
      body: [{
        group,
        role
      }],
      auth: {
        bearer: this.access_token
      }
    });
  }

  deleteAuthorities(username) {
    cy.request({
      url: `${controller}/${username}/authorities`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

  deleteUser(username) {
    cy.request({
      url: `${controller}/${username}`,
      method: 'DELETE',
      auth: {
        bearer: this.access_token
      }
    });
  }

}
