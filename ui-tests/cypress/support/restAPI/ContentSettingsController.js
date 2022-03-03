import AbstractController from './abstractController';

import {contentSettingsAPIURL} from './controllersEndPoints';

Cypress.Commands.add('contentSettingsController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentSettingsController(contentSettingsAPIURL, tokens.access_token);
  });
});

export default class ContentSettingsController extends AbstractController {

  putContentEditor(key = 'none') { // none or fckeditor
    return this.request({
      url: `${this.apiURL}/editor`,
      method: 'PUT',
      body: {key}
    });
  }

}
