import AbstractController                from '../abstractController';
import {versioningURL}                   from '../controllersEndPoints';

Cypress.Commands.add('versioningController', () => {
  cy.get('@tokens').then(tokens => {
    return new VersioningController(versioningURL, tokens.access_token);
  });
});

export default class VersioningController extends AbstractController {}
