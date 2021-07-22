import {generateRandomId} from "../../support/utils";

import {htmlElements} from "../../support/pageObjects/WebElement";

import HomePage from "../../support/pageObjects/HomePage";

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

      currentPage.getContent().getTableRow(USERNAME).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [USERNAME]));

      cy.usersController().then(controller => controller.deleteUser(USERNAME));
    });

    it("Add a user with existing user name is forbidden", () => {
      cy.usersController().then(controller => controller.addUser(USERNAME, PASSWORD, PASSWORD, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();

      currentPage = currentPage.getContent().openAddUserPage();
      currentPage.getContent().addUser(USERNAME, PASSWORD, PROFILE_TYPE_CODE);

      cy.validateToast(currentPage, false, `The user '${USERNAME}' already exists`);

      cy.usersController().then(controller => controller.deleteUser(USERNAME));
    });

    it("Update an existing user", () => {
      const PASSWORD_EDIT = generateRandomId();

      cy.usersController().then(controller => controller.addUser(USERNAME, PASSWORD, PASSWORD, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME);

      currentPage = currentPage.getContent().getKebabMenu(USERNAME).open().openEdit();
      currentPage = currentPage.getContent().editUser(PASSWORD_EDIT, true);

      currentPage.getContent().getTableRow(USERNAME).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [USERNAME, null, null, null, "\u00a0Active"]));

      cy.usersController().then(controller => controller.deleteUser(USERNAME));
    });

    it("Update an existing user profile", () => {
      const FULL_NAME         = generateRandomId();
      const EMAIL             = `${generateRandomId()}@entando.com`;
      const PROFILE_TYPE_DESC = "Default user profile";

      cy.usersController().then(controller => controller.addUser(USERNAME, PASSWORD, PASSWORD, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME);

      currentPage = currentPage.getContent().getKebabMenu(USERNAME).open().openEditProfile();
      currentPage.getContent().getUsernameInput().should("have.value", USERNAME);

      currentPage = currentPage.getContent().editUser(null, FULL_NAME, EMAIL, null);

      cy.validateToast(currentPage, true, "User profile has been updated");

      currentPage.getContent().getTableRow(USERNAME).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [USERNAME, `${PROFILE_TYPE_DESC} ${PROFILE_TYPE_CODE}`, FULL_NAME, EMAIL, "\u00a0Not active"]));

      cy.usersController().then(controller => controller.deleteUser(USERNAME));
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

      cy.usersController().then(controller => controller.addUser(USERNAME, PASSWORD, PASSWORD, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();
      currentPage.getContent().getTableRows().contains(htmlElements.td, USERNAME);

      currentPage = currentPage.getContent().getKebabMenu(USERNAME).open().openManageAuth();
      currentPage.getContent().getTitle().should("contain", USERNAME);

      currentPage.getContent().addAuthorization();
      currentPage.getDialog().getBody().selectGroup(GROUP.ID);
      currentPage.getDialog().getBody().selectRole(ROLE.ID);
      currentPage.getDialog().confirm();

      currentPage.getContent().getTableRows().contains(htmlElements.td, GROUP.DESCRIPTION).parent().then(row => {
        cy.get(row).children(htmlElements.td).eq(0).should("have.text", GROUP.DESCRIPTION);
        cy.get(row).children(htmlElements.td).eq(1).should("have.text", ROLE.DESCRIPTION);
      });

      currentPage.getContent().save();

      cy.usersController().then(controller => controller.deleteUser(USERNAME));
    });

    it.only("Search an existing user", () => {
      cy.usersController().then(controller => controller.addUser(USERNAME, PASSWORD, PASSWORD, PROFILE_TYPE_CODE));

      currentPage = openManagementPage();

      currentPage = currentPage.getContent().searchUser(USERNAME);
      currentPage.getContent().getTableRows()
                 .should("have.length", 1)
                 .children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [USERNAME]));

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
      currentPage.getDialog().getBody().getStateInfo().should("contain", USERNAME);
      currentPage.getDialog().confirm();
      cy.wait(1000);
      currentPage.getContent().getTableRows().should("not.contain", USERNAME);
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
