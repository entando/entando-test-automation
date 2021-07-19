import {
  TEST_ID_USER_SEARCH_FORM
} from "../../test-const/user-test-const";

Cypress.Commands.add("searchUser", (username) => {
  cy.log(`Search User ${username}`);
  cy.openPageFromMenu(["Users", "Management"]);
  cy.getByTestId(TEST_ID_USER_SEARCH_FORM.USERNAME_FIELD).clear();
  cy.getByTestId(TEST_ID_USER_SEARCH_FORM.USERNAME_FIELD).type(username);
  cy.getByTestId(TEST_ID_USER_SEARCH_FORM.SEARCH_BUTTON).click();
});

export {};
