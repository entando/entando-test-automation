import {generateRandomId} from "../../support/utils";

import {htmlElements} from "../../support/pageObjects/WebElement";

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

  it("Update an existing group", () => {
    const updatedGroupName = generateRandomId();

    cy.groupsController().then(controller => controller.addGroup(groupCode, groupName));

    currentPage = openGroupsPage();

    currentPage = currentPage.getContent().getKebabMenu(groupCode).open().openEdit();
    currentPage = currentPage.getContent().editGroup(updatedGroupName);

    currentPage.getContent().getTableRow(groupCode).children(htmlElements.td)
               .then(cells => cy.validateListTexts(cells, [updatedGroupName, groupCode]));

    currentPage = currentPage.getContent().getKebabMenu(groupCode).open().openDetails();
    currentPage.getContent().getDetailsInfo()
               .within(info => {
                 cy.get(info).children(htmlElements.div).eq(0).children(htmlElements.div).should("have.text", groupCode);
                 cy.get(info).children(htmlElements.div).eq(1).children(htmlElements.div).should("have.text", updatedGroupName);
               });

    cy.groupsController().then(controller => controller.deleteGroup(groupCode));
  });

  it("Delete group", () => {
    cy.groupsController().then(controller => controller.addGroup(groupCode, groupName));

    cy.visit("/");
    new HomePage();

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
