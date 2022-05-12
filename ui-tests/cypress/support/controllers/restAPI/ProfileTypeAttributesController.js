import AbstractController from '../abstractController';

import {profileTypeAttributesAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('profileTypeAttributesController', () => {
  cy.get('@tokens').then(tokens => {
    return new ProfileTypeAttributesController(profileTypeAttributesAPIURL, tokens.access_token);
  });
});

export default class ProfileTypeAttributesController extends AbstractController {}
