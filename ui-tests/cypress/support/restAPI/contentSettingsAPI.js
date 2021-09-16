const apiURL     = Cypress.config('restAPI');
const controller = `${apiURL}plugins/cms/contentSettings`;

Cypress.Commands.add('contentSettingsController', () => {
  cy.get('@tokens').then(tokens => {
    return new ContentSettingsController(tokens.access_token);
  });
});

class ContentSettingsController {

  constructor(access_token) {
    this.access_token = access_token;
  }

  putContentEditor(key = 'none') { // none or fckeditor
    cy.request({
      url: `${controller}/editor`,
      method: 'PUT',
      auth: {
        bearer: this.access_token
      },
      body: { key },
    });
  }
}
