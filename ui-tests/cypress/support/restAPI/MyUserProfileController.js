import AbstractController from './abstractController';

import {myUserProfileAPIURL} from './controllersEndPoints';

Cypress.Commands.add('myUserProfileController', () => {
  cy.get('@tokens').then(tokens => {
    return new MyUserProfileController(myUserProfileAPIURL, tokens.access_token);
  });
});

export default class MyUserProfileController extends AbstractController {}
