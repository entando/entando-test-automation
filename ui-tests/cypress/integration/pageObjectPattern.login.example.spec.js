import LoginPage from "../support/pageObjects/keyCloak/LoginPage.js";

const baseUrl = Cypress.config("baseUrl");
var currentPage;

describe('Keycloack', () => {

  it('Login via UI', () => {
    cy.visit("/");

    cy.fixture(`users/admin`)
      .then((userData) => {
        currentPage = new LoginPage();
        currentPage.login(userData);
      })

    cy.url().should('eq', `${baseUrl}dashboard`);

  })

  it('Login via keyCloak', () => {
    cy.kcLogin("admin").as("tokens");

    cy.visit('/');
    cy.url().should('eq', `${baseUrl}dashboard`);

    cy.kcLogout();
  })

})