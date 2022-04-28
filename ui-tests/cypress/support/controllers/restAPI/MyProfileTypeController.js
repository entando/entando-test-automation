import AbstractController from '../abstractController';

import {myProfileTypeAPIURL} from '../controllersEndPoints';

Cypress.Commands.add('myProfileTypeController', () => {
  cy.get('@tokens').then(tokens => {
    return new MyProfileTypeController(myProfileTypeAPIURL, tokens.access_token);
  });
});

export default class MyProfileTypeController extends AbstractController {}
