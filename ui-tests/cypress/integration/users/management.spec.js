import {generateRandomId} from "../../support/utils";

import {htmlElements} from "../../support/pageObjects/WebElement";

import {
  TEST_ID_DETAIL_USER_TABLE,
  TEST_ID_USER_AUTHORITY_MODAL,
  TEST_ID_USER_AUTHORITY_PAGE_FORM,
  TEST_ID_USER_AUTHORITY_TABLE,
  TEST_ID_USER_FORM,
  TEST_ID_USER_LIST_PAGE,
  TEST_ID_USER_LIST_TABLE,
  TEST_ID_USER_PROFILE_FORM,
  TEST_ID_USER_SEARCH_FORM
}                            from "../../test-const/user-test-const";
import TEST_ID_GENERIC_MODAL from "../../test-const/test-const";

import HomePage from "../../support/pageObjects/HomePage";

describe("Users Management", () => {

  let currentPage;

  beforeEach(() => {
    cy.kcLogin("admin").as("tokens");
  });

  afterEach(() => {
    cy.kcLogout();
  });

  describe("UI", () => {

    const USERNAME_ADMIN = "admin";

    it("Users management page", () => {
      currentPage = openManagementPage();

      // Page title
      cy.getPageTitle().should("be.visible").and("have.text", "Users");
      // Page breadcrumb
      cy.validateBreadcrumbItems(["Users", "Management"]);
      // Search box title
      cy.getByTestId(TEST_ID_USER_SEARCH_FORM.FORM).within(() => {
        cy.get("h3").contains("Search").should("be.visible");
      });
      // Form Fields
      cy.getInputByName("username").should("be.visible");
      cy.getByTestId(TEST_ID_USER_SEARCH_FORM.WITH_PROFILE_FIELD).should("be.visible");
      cy.getByTestId(TEST_ID_USER_SEARCH_FORM.SEARCH_BUTTON).should("be.visible");
      cy.getByTestId(TEST_ID_USER_LIST_TABLE.TABLE).should("be.visible");
      // Table
      cy.getByTestId(TEST_ID_USER_LIST_TABLE.TABLE).should("be.visible");
      cy.getByTestId(TEST_ID_USER_LIST_TABLE.TABLE).contains("Username").should("be.visible");
      cy.getByTestId(TEST_ID_USER_LIST_TABLE.TABLE).contains("Full Name").should("be.visible");
      cy.getByTestId(TEST_ID_USER_LIST_TABLE.TABLE).contains("Email").should("be.visible");
      cy.getByTestId(TEST_ID_USER_LIST_TABLE.TABLE).contains("Profile Type").should("be.visible");
      cy.getByTestId(TEST_ID_USER_LIST_TABLE.TABLE).contains("Status").should("be.visible");
      cy.getByTestId(TEST_ID_USER_LIST_TABLE.TABLE).contains("Actions").should("be.visible");
      cy.getTableColsByTestId(TEST_ID_USER_LIST_TABLE.TABLE).should("have.length", 6);
      // Button
      cy.getByTestId(TEST_ID_USER_LIST_PAGE.ADD_USER_BUTTON).should("be.visible").and("have.text", "Add");
    });

    it("Edit user page", () => {
      currentPage = openManagementPage();

      cy.log("Should have all defined page components");
      cy.searchUser(USERNAME_ADMIN);
      cy.openTableActionsByTestId(USERNAME_ADMIN);
      cy.getVisibleActionItemByClass(TEST_ID_USER_LIST_TABLE.ACTION_EDIT_USER).click();
      cy.validateUrlChanged(`/user/edit/${USERNAME_ADMIN}`);
      // Page title
      cy.getPageTitle().should("be.visible").and("have.text", "Edit");
      // Page breadcrumb
      cy.validateBreadcrumbItems(["Users", "Management", "Edit"]);
      // Form Fields
      cy.getInputByName(TEST_ID_USER_FORM.USERNAME_FIELD).should("be.visible");
      cy.getInputByName(TEST_ID_USER_FORM.PASSWORD_FIELD).should("be.visible");
      cy.getInputByName(TEST_ID_USER_FORM.CONFIRM_PASSWORD_FIELD).should("be.visible");
      cy.getByTestId(TEST_ID_USER_FORM.STATUS_FIELD).should("be.visible");
      cy.getByTestId(TEST_ID_USER_FORM.RESET_FIELD).should("be.visible");
      // Labels
      cy.getLabelByText("Username").should("be.visible");
      cy.getLabelByText("Password").should("be.visible");
      cy.getLabelByText("Confirm password").should("be.visible");
      cy.getLabelByText("Registration").should("be.visible");
      cy.getLabelByText("Last login").should("be.visible");
      cy.getLabelByText("Last password change").should("be.visible");
      cy.getLabelByText("Reset").should("be.visible");
      cy.getLabelByText("Status").should("be.visible");
      // Button
      cy.getByTestId(TEST_ID_USER_FORM.SAVE_BUTTON).should("be.visible").and("have.text", "Save");
    });

    it("Edit user profile page", () => {
      currentPage = openManagementPage();

      cy.log("Should have all defined page components");
      cy.searchUser(USERNAME_ADMIN);
      cy.openTableActionsByTestId(USERNAME_ADMIN);
      cy.getVisibleActionItemByClass(TEST_ID_USER_LIST_TABLE.ACTION_EDIT_PROFILE).click();
      cy.validateUrlChanged(`/userprofile/${USERNAME_ADMIN}`);
      // Page title
      cy.getPageTitle().should("be.visible").and("have.text", "Edit");
      // Page breadcrumb
      cy.validateBreadcrumbItems(["Users", "Management", "Edit user profile"]);
      // Form Fields
      cy.getSelectByName(TEST_ID_USER_PROFILE_FORM.PROFILE_TYPE_FIELD).should("be.visible");
      cy.getInputByName(TEST_ID_USER_PROFILE_FORM.USERNAME_FIELD).should("be.visible").and("be.disabled");
      cy.getInputByName(TEST_ID_USER_PROFILE_FORM.FULL_NAME_FIELD).should("be.visible");
      cy.getInputByName(TEST_ID_USER_PROFILE_FORM.EMAIL_FIELD).should("be.visible");
      // Labels
      cy.getLabelByText("Profile Type").should("be.visible");
      cy.getLabelByText("Username").should("be.visible");
      cy.getLabelByText("Full Name").should("be.visible");
      cy.getLabelByText("Email").should("be.visible");
      // Button
      cy.getByTestId(TEST_ID_USER_PROFILE_FORM.SAVE_BUTTON).should("be.visible").and("have.text", "Save");
    });

    it("View user profile page", () => {
      currentPage = openManagementPage();

      cy.log("Should have all defined page components");
      cy.searchUser(USERNAME_ADMIN);
      cy.openTableActionsByTestId(USERNAME_ADMIN);
      cy.getVisibleActionItemByTestID(TEST_ID_USER_LIST_TABLE.ACTION_VIEW_PROFILE).click();
      cy.validateUrlChanged(`/user/view/${USERNAME_ADMIN}`);
      // Page title
      cy.getPageTitle().should("be.visible").and("have.text", "Details");
      // Page breadcrumb
      cy.validateBreadcrumbItems(["Users", "Management", "Details"]);
      // Table
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.TABLE).should("be.visible");
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.TABLE).contains("Username").should("be.visible");
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.TABLE).contains("Full Name").should("be.visible");
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.TABLE).contains("Email").should("be.visible");
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.TABLE).contains("Profile Type").should("be.visible");
      // Button
      cy.getByTestId(TEST_ID_DETAIL_USER_TABLE.BACK_BUTTON).should("be.visible").and("have.text", "Back");
    });

    it("User authorizations page", () => {
      currentPage = openManagementPage();

      cy.log("Should edit the user authorizations");
      // Edit Authorizations
      cy.searchUser(USERNAME_ADMIN);
      cy.openTableActionsByTestId(USERNAME_ADMIN);
      cy.getVisibleActionItemByClass(TEST_ID_USER_LIST_TABLE.ACTION_MANAGE_AUTHORIZATIONS).click();
      cy.validateUrlChanged(`/authority/${USERNAME_ADMIN}`);
      // Page title
      cy.getPageTitle().should("be.visible").and("have.text", `Authorizations for ${USERNAME_ADMIN}`);
      // Page breadcrumb
      cy.validateBreadcrumbItems(["Users", "Management", "Authorizations"]);
      // Table
      cy.getByTestId(TEST_ID_USER_AUTHORITY_TABLE.TABLE).should("be.visible");
      cy.getByTestId(TEST_ID_USER_AUTHORITY_TABLE.TABLE).contains("User Group").should("be.visible");
      cy.getByTestId(TEST_ID_USER_AUTHORITY_TABLE.TABLE).contains("User Role").should("be.visible");
      cy.getByTestId(TEST_ID_USER_AUTHORITY_TABLE.TABLE).contains("Actions").should("be.visible");
      cy.getTableColsByTestId(TEST_ID_USER_AUTHORITY_TABLE.TABLE).should("have.length", 3);
      // Buttons
      cy.getByTestId(TEST_ID_USER_AUTHORITY_TABLE.ADD_BUTTON).should("be.visible").and("have.text", "Add new Authorization");
      cy.getByTestId(TEST_ID_USER_AUTHORITY_TABLE.DELETE_BUTTON).should("be.visible");
      cy.getByTestId(TEST_ID_USER_AUTHORITY_PAGE_FORM.SAVE_BUTTON).should("be.visible").and("have.text", "Save");
      // Add authorization modal
      cy.getByTestId(TEST_ID_USER_AUTHORITY_TABLE.ADD_BUTTON).click();
      cy.getModalDialogByTitle("New authorizations").should("be.visible");
      cy.getByTestId(TEST_ID_USER_AUTHORITY_MODAL.ROLE_FIELD).should("be.visible");
      cy.getByTestId(TEST_ID_USER_AUTHORITY_MODAL.GROUP_FIELD).should("be.visible");
      cy.getByTestId(TEST_ID_GENERIC_MODAL.BUTTON).contains("Cancel").should("be.visible");
      cy.getByTestId(TEST_ID_GENERIC_MODAL.BUTTON).contains("Add").should("be.visible");
    });

  });

  describe("Actions", () => {

    const PROFILE_TYPE_CODE = "PFL";

    let username;
    let password;

    beforeEach(() => {
      username = generateRandomId();
      password = generateRandomId();
    });

    it("Add a new user", () => {
      currentPage = openManagementPage();

      currentPage = currentPage.getContent().openAddUserPage();
      currentPage = currentPage.getContent().addUser(username, password, PROFILE_TYPE_CODE);

      currentPage.getContent().getTableRow(username).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username]));

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it("Add a user with existing user name is forbidden", () => {
      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();

      currentPage = currentPage.getContent().openAddUserPage();
      currentPage.getContent().addUser(username, password, PROFILE_TYPE_CODE);

      cy.validateToast(currentPage, false, `The user '${username}' already exists`);

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it("Update an existing user", () => {
      const PASSWORD_EDIT = generateRandomId();

      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, username);

      currentPage = currentPage.getContent().getKebabMenu(username).open().openEdit();
      currentPage = currentPage.getContent().editUser(PASSWORD_EDIT, true);

      currentPage.getContent().getTableRow(username).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username, null, null, null, "\u00a0Active"]));

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it("Update an existing user profile", () => {
      const FULL_NAME         = generateRandomId();
      const EMAIL             = `${generateRandomId()}@entando.com`;
      const PROFILE_TYPE_DESC = "Default user profile";

      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, username);

      currentPage = currentPage.getContent().getKebabMenu(username).open().openEditProfile();
      currentPage.getContent().getUsernameInput().should("have.value", username);

      currentPage = currentPage.getContent().editUser(null, FULL_NAME, EMAIL, null);

      cy.validateToast(currentPage, true, "User profile has been updated");

      currentPage.getContent().getTableRow(username).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username, `${PROFILE_TYPE_DESC} ${PROFILE_TYPE_CODE}`, FULL_NAME, EMAIL, "\u00a0Not active"]));

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it("Update an existing user authorization", () => {
      const GROUP = {
        ID: "free",
        DESCRIPTION: "Free Access"
      };
      const ROLE  = {
        ID: "admin",
        DESCRIPTION: "Administrator"
      };

      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, username);

      currentPage = currentPage.getContent().getKebabMenu(username).open().openManageAuth();
      currentPage.getContent().getTitle().should("contain", username);

      currentPage.getContent().addAuthorization();
      currentPage.getDialog().getBody().selectGroup(GROUP.ID);
      currentPage.getDialog().getBody().selectRole(ROLE.ID);
      currentPage.getDialog().confirm();

      currentPage.getContent().getTableRows().contains(htmlElements.td, GROUP.DESCRIPTION).parent().then(row => {
        cy.get(row).children(htmlElements.td).eq(0).should("have.text", GROUP.DESCRIPTION);
        cy.get(row).children(htmlElements.td).eq(1).should("have.text", ROLE.DESCRIPTION);
      });

      currentPage.getContent().save();

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it("Search an existing user", () => {
      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();

      currentPage = currentPage.getContent().searchUser(username);
      currentPage.getContent().getTableRows()
                 .should("have.length", 1)
                 .children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [username]));

      cy.usersController().then(controller => controller.deleteUser(username));
    });

    it("Search a non-existing user", () => {
      currentPage = openManagementPage();

      currentPage = currentPage.getContent().searchUser(username);
      currentPage.getContent().get().should("not.have.descendants", currentPage.getContent().table);
      currentPage.getContent().getTableAlert()
                 .should("be.visible")
                 .and("have.text", "There are no USERS available");
    });

    it("Delete a user", () => {
      cy.usersController().then(controller => controller.addUser(username, password, password, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, username);

      currentPage.getContent().getKebabMenu(username).open().clickDelete();
      currentPage.getDialog().getBody().getStateInfo().should("contain", username);
      currentPage.getDialog().confirm();
      cy.wait(1000);
      currentPage.getContent().getTableRows().should("not.contain", username);
    });

    it("Deletion of admin is forbidden", () => {
      const USERNAME_ADMIN = "admin";

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME_ADMIN);

      currentPage.getContent().getKebabMenu(USERNAME_ADMIN).open().clickDelete();
      currentPage.getDialog().getBody().getStateInfo().should("contain", USERNAME_ADMIN);
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage, false, "Sorry. You can't delete the administrator user");
    });

  });

  const openManagementPage = () => {
    cy.visit("/");
    currentPage = new HomePage();
    return currentPage.getMenu().getUsers().open().openManagement();
  };

});
