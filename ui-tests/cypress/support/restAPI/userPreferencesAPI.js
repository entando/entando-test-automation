import {userPreferencesAPIURL as controller} from './controllersEndPoints';

Cypress.Commands.add('userPreferencesController', () => {
  cy.get('@tokens').then(tokens => {
    return new UserPreferencesController(tokens.access_token);
  });
});

class UserPreferencesController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  defaultOptions = {
    defaultContentJoinGroups: [],
    defaultContentOwnerGroup: '',
    defaultPageJoinGroups: [],
    defaultPageOwnerGroup: '',
    defaultWidgetJoinGroups: null,
    defaultWidgetOwnerGroup: '',
    loadOnPageSelect: true,
    translationWarning: true,
    wizard: true
  };

  updateUserPreferences(username, options) {
    cy.request({
      url: `${controller}/${username}`,
      method: 'PUT',
      body: {
        ...options
      },
      auth: {
        bearer: this.access_token
      }
    });
  }

  resetUserPreferences(username) {
    cy.request({
      url: `${controller}/${username}`,
      method: 'PUT',
      body: {
        ...this.defaultOptions
      },
      auth: {
        bearer: this.access_token
      }
    });
  }
}
