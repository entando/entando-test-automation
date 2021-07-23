import {generateRandomId} from "../../support/utils";

import {htmlElements} from "../../support/pageObjects/WebElement";

import {TEST_ID_GROUPS_TABLE} from "../../test-const/group-test-const";

import HomePage from "../../support/pageObjects/HomePage";

describe("Groups", () => {

  let currentPage;

  let groupName;
  let groupCode;

  beforeEach(() => {
    cy.kcLogin("admin").as("tokens");

    groupName = generateRandomId();
    groupCode = groupName.toLowerCase();
  });

  afterEach(() => {
    cy.kcLogout();
  });

  it("Add a new group", () => {
    currentPage = openGroupsPage();

    currentPage = currentPage.getContent().openAddGroupPage();
    currentPage = currentPage.getContent().addGroup(groupName, groupCode);

    currentPage.getContent().getTableRow(groupCode).children(htmlElements.td)
               .then(cells => cy.validateListTexts(cells, [groupName, groupCode]));

    cy.groupsController().then(controller => controller.deleteGroup(groupCode));
  });

  it("Edit group", () => {
    cy.visit("/");
    new HomePage();

    cy.addGroup(groupName);

    cy.log("should redirect to list with updated group after submitting the form");
    const updatedGroupName = generateRandomId();
    cy.editGroup(groupCode, updatedGroupName);
    cy.getByTestId(TEST_ID_GROUPS_TABLE).should("be.visible");
    cy.getTableRowsBySelector(updatedGroupName).should("be.visible");
    cy.getTableRowsBySelector(groupCode).should("be.visible");

    cy.log("should redirect back to list on cancel");
    cy.openTableActionsByTestId(groupCode);
    cy.get(`[data-id=edit-${groupCode}`).find("a").click();
    cy.getButtonByText("Cancel").click();
    cy.getByTestId(TEST_ID_GROUPS_TABLE).should("be.visible");

    cy.groupsController().then(controller => controller.deleteGroup(groupCode));
  });

  it("Delete group", () => {
    cy.visit("/");
    new HomePage();

    cy.addGroup(groupName);
    cy.wait(1000);
    cy.log("should delete the group after clicking and confirming the delete action");
    cy.deleteGroup(groupCode);
    cy.contains(groupCode).should("not.be.visible");
  });

  const openGroupsPage = () => {
    cy.visit("/");
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getUsers().open();
    return currentPage.openGroups();
  };

});
