import {generateRandomId} from "../support/utils";

import {htmlElements} from "../support/pageObjects/WebElement";

import {
  TEST_ID_USER_AUTHORITY_MODAL,
  TEST_ID_USER_AUTHORITY_TABLE,
  TEST_ID_USER_FORM,
  TEST_ID_DETAIL_USER_TABLE,
  TEST_ID_USER_PROFILE_FORM,
  TEST_ID_USER_LIST_TABLE
}                            from "../test-const/user-test-const";
import TEST_ID_GENERIC_MODAL from "../test-const/test-const";

import HomePage from "../support/pageObjects/HomePage";

describe("Users Management", () => {

  const USERNAME          = generateRandomId();
  const PASSWORD          = generateRandomId();
  const PROFILE_TYPE_CODE = "PFL";

  let currentPage;

  beforeEach(() => {
    cy.kcLogin("admin").as("tokens");
  });

  afterEach(() => {
    cy.kcLogout();
  });

  describe("Actions ", () => {

    it("Add a new user", () => {
      currentPage = openManagementPage();

      currentPage = currentPage.getContent().openAddUserPage();
      currentPage = currentPage.getContent().addUser(USERNAME, PASSWORD, PROFILE_TYPE_CODE);

      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME);

      cy.usersController().then(controller => controller.deleteUser(USERNAME));
    });

    it("Search an existing user", () => {
      cy.usersController().then(controller => controller.addUser(USERNAME, PASSWORD, PASSWORD, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();

      currentPage = currentPage.getContent().searchUser(USERNAME);
      currentPage.getContent().getTableRows()
                 .should("have.length", 1)
                 .then(rows => cy.get(rows).children(htmlElements.td).eq(0).should("contain", USERNAME));

      cy.usersController().then(controller => controller.deleteUser(USERNAME));
    });

    it("Search a non-existing user", () => {
      currentPage = openManagementPage();

      currentPage = currentPage.getContent().searchUser(USERNAME);
      currentPage.getContent().get().should("not.have.descendants", currentPage.getContent().table);
      currentPage.getContent().getTableAlert()
                 .should("be.visible")
                 .and("have.text", "There are no USERS available");
    });

    it("Delete a user", () => {
      cy.usersController().then(controller => controller.addUser(USERNAME, PASSWORD, PASSWORD, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME);

      currentPage.getContent().getKebabMenu(USERNAME).open().clickDelete();
      currentPage.getDialog().getStateInfo().should("contain", USERNAME);
      currentPage.getDialog().confirm();
      cy.wait(1000);
      currentPage.getContent().getTableRows().should("not.contain", USERNAME);
    });

  });

  describe("User ", () => {

    beforeEach(() => {
      cy.visit("/");
      new HomePage();
    });

    it("Should update a user", () => {
      cy.usersController().then(controller => controller.addUser(USERNAME, PASSWORD, PASSWORD, PROFILE_TYPE_CODE));

      cy.log("Update the user");
      const newPassword = "new_password_tests";
      cy.searchUser(USERNAME);
      cy.getTableRowsBySelector(USERNAME).contains("Not active").should("be.visible");
      cy.openTableActionsByTestId(USERNAME);
      cy.getVisibleActionItemByClass(TEST_ID_USER_LIST_TABLE.ACTION_EDIT_USER).click();
      cy.getInputByName(TEST_ID_USER_FORM.USERNAME_FIELD).should("have.value", USERNAME);
      cy.getInputByName(TEST_ID_USER_FORM.PASSWORD_FIELD).type(newPassword);
      cy.getInputByName(TEST_ID_USER_FORM.CONFIRM_PASSWORD_FIELD).type(newPassword);
      cy.getByTestId(TEST_ID_USER_FORM.STATUS_FIELD).click("left");
      cy.getByTestId(TEST_ID_USER_FORM.SAVE_BUTTON).click();
      cy.validateUrlChanged("/user");
      cy.log("Validate user changes");
      cy.searchUser(USERNAME);
      cy.getTableRowsBySelector(USERNAME).contains("Active").should("be.visible");

      cy.usersController().then(controller => controller.deleteUser(USERNAME));
    });

    it("Delete admin user should not be possible", () => {
      cy.log("Delete admin user should not be possible");
      cy.deleteUser("admin");
      cy.validateToastNotificationError("Sorry. You can't delete the administrator user");
    });

    it("Add user with username that already exists should not be possible", () => {
      cy.usersController().then(controller => controller.addUser(USERNAME, PASSWORD, PASSWORD, PROFILE_TYPE_CODE));

      cy.log("Add a new user with username that already exists");
      cy.addUser(USERNAME, PASSWORD, PROFILE_TYPE_CODE);
      cy.validateToastNotificationError(`The user '${USERNAME}' already exists`);

      cy.usersController().then(controller => controller.deleteUser(USERNAME));
    });
  });

  describe("User profile", () => {

    const FULL_NAME = "Test Test";
    const EMAIL     = "email-user-test@entando.com";

    beforeEach(() => {
      cy.visit("/");
      new HomePage();
    });

    it("Should edit the user profile", () => {
      cy.usersController().then(controller => controller.addUser(USERNAME, PASSWORD, PASSWORD, PROFILE_TYPE_CODE));

      cy.log("Should edit and view the user profile");
      // Edit User Profile
      cy.editUserProfile(USERNAME, FULL_NAME, EMAIL);
      cy.validateToastNotificationOk("User profile has been updated");
      cy.log("Check edited user profile");
      cy.searchUser(USERNAME);
      cy.getTableRowsBySelector(USERNAME).should("be.visible");
      cy.getTableRowsBySelector(FULL_NAME).should("be.visible");
      cy.getTableRowsBySelector(EMAIL).should("be.visible");
      cy.getTableRowsBySelector(`Default user profile ${PROFILE_TYPE_CODE}`).should("be.visible");
      cy.openTableActionsByTestId(USERNAME);
      cy.getVisibleActionItemByClass(TEST_ID_USER_LIST_TABLE.ACTION_EDIT_PROFILE).click();
      cy.validateUrlChanged(`/userprofile/${USERNAME}`);
      cy.getInputByName(TEST_ID_USER_PROFILE_FORM.USERNAME_FIELD).should("have.value", USERNAME);
      cy.getInputByName(TEST_ID_USER_PROFILE_FORM.FULL_NAME_FIELD).should("have.value", FULL_NAME);
      cy.getInputByName(TEST_ID_USER_PROFILE_FORM.EMAIL_FIELD).should("have.value", EMAIL);
      cy.getSelectByName(TEST_ID_USER_PROFILE_FORM.PROFILE_TYPE_FIELD).within(() => {
        cy.get("option:selected")
          .should("have.text", "Default user profile")
          .and("have.value", PROFILE_TYPE_CODE);
      });
      // View User Profile
      cy.log("Should view the user profile");
      cy.searchUser(USERNAME);
      cy.openTableActionsByTestId(USERNAME);
      cy.getVisibleActionItemByTestID(TEST_ID_USER_LIST_TABLE.ACTION_VIEW_PROFILE).click();
      cy.validateUrlChanged(`/user/view/${USERNAME}`);
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.TABLE).contains(USERNAME).should("be.visible");
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.TABLE).contains(FULL_NAME).should("be.visible");
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.TABLE).contains(EMAIL).should("be.visible");
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.TABLE).contains(`Default user profile ${PROFILE_TYPE_CODE}`)
        .should("be.visible");
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.BACK_BUTTON).should("be.visible");
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.BACK_BUTTON).click();
      cy.validateUrlChanged("/user");

      cy.usersController().then(controller => controller.deleteUser(USERNAME));
    });
  });

  describe("User authorizations", () => {

    const group = {
      ID: "free",
      DESCRIPTION: "Free Access"
    };
    const role  = {
      ID: "admin",
      DESCRIPTION: "Administrator"
    };

    beforeEach(() => {
      cy.visit("/");
      new HomePage();
    });

    it("Should edit the user authorizations", () => {
      cy.usersController().then(controller => controller.addUser(USERNAME, PASSWORD, PASSWORD, PROFILE_TYPE_CODE));

      cy.log("Should edit the user authorizations");
      // Edit Authorizations
      cy.searchUser(USERNAME);
      cy.openTableActionsByTestId(USERNAME);
      cy.getVisibleActionItemByClass(TEST_ID_USER_LIST_TABLE.ACTION_MANAGE_AUTHORIZATIONS).click();
      cy.validateUrlChanged(`/authority/${USERNAME}`);
      cy.contains("No authorizations yet").should("be.visible");
      // Add Authorizations
      cy.log("Should add the user authorizations");
      cy.getByTestId(TEST_ID_USER_AUTHORITY_TABLE.ADD_BUTTON).click();
      cy.getByTestId(TEST_ID_USER_AUTHORITY_MODAL.GROUP_FIELD).select(group.ID);
      cy.getByTestId(TEST_ID_USER_AUTHORITY_MODAL.ROLE_FIELD).select(role.ID);
      cy.getByTestId(TEST_ID_GENERIC_MODAL.BUTTON).contains("Add").click();
      cy.contains(group.DESCRIPTION).should("be.visible");
      cy.contains(role.DESCRIPTION).should("be.visible");
      cy.getTableRowsByTestId(TEST_ID_USER_AUTHORITY_TABLE.TABLE).should("have.length", 1);
      // Delete Authorizations
      cy.getByTestId(TEST_ID_USER_AUTHORITY_TABLE.DELETE_BUTTON).click();
      cy.contains("No authorizations yet").should("be.visible");

      cy.usersController().then(controller => controller.deleteUser(USERNAME));
    });
  });

  const openManagementPage = () => {
    cy.visit("/");
    currentPage = new HomePage();
    return currentPage.getMenu().getUsers().open().openManagement();
  };

});
