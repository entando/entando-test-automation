import AbstractController from './abstractController';

import {userPreferencesAPIURL} from './controllersEndPoints';

Cypress.Commands.add('userPreferencesController', () => {
  //FIXME only user can update their preferences
  cy.get('@UITokens').then(tokens => {
    return new UserPreferencesController(userPreferencesAPIURL, tokens.access_token);
  });
});

export default class UserPreferencesController extends AbstractController {

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
    return this.request({
      url: `${this.apiURL}/${username}`,
      method: 'PUT',
      body: options
    });
  }

  resetUserPreferences(username) {
    return this.request({
      url: `${this.apiURL}/${username}`,
      method: 'PUT',
      body: this.defaultOptions
    });
  }

}
