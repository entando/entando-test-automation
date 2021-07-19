import {
  TEST_ID_USER_LIST_TABLE,
  TEST_ID_USER_PROFILE_FORM,
  TEST_ID_USER_SEARCH_FORM
} from "../../test-const/user-test-const";

Cypress.Commands.add("searchUser", (username) => {
  cy.log(`Search User ${username}`);
  cy.openPageFromMenu(["Users", "Management"]);
  cy.getByTestId(TEST_ID_USER_SEARCH_FORM.USERNAME_FIELD).clear();
  cy.getByTestId(TEST_ID_USER_SEARCH_FORM.USERNAME_FIELD).type(username);
  cy.getByTestId(TEST_ID_USER_SEARCH_FORM.SEARCH_BUTTON).click();
});

Cypress.Commands.add("editUserProfile", (username, fullname, email) => {
  cy.searchUser(username);
  cy.openTableActionsByTestId(username);
  cy.getVisibleActionItemByClass(TEST_ID_USER_LIST_TABLE.ACTION_EDIT_PROFILE).click();
  cy.validateUrlChanged(`/userprofile/${username}`);
  cy.getInputByName(TEST_ID_USER_PROFILE_FORM.FULL_NAME_FIELD).type(fullname);
  cy.getInputByName(TEST_ID_USER_PROFILE_FORM.EMAIL_FIELD).type(email);
  cy.getByTestId(TEST_ID_USER_PROFILE_FORM.SAVE_BUTTON).click();
});

export {};
