import AbstractController from '../abstractController';

import {contentModelsAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('contentTemplatesController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentTemplatesController(contentModelsAPIURL, tokens.access_token);
  });
});

export default class ContentTemplatesController extends AbstractController {

  addContentTemplate(template) {
    return this.request({
      method: 'POST',
      body: template
    });
  }

  deleteContentTemplate(code) {
    return this.request({
      url: `${this.apiURL}/${code}`,
      method: 'DELETE'
    });
  }

}
