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

  it("Delete an existing group", () => {
    cy.groupsController().then(controller => controller.addGroup(groupCode, groupName));

    currentPage = openGroupsPage();

    currentPage.getContent().getKebabMenu(groupCode).open().clickDelete();
    currentPage.getDialog().getBody().getStateInfo().should("contain", groupCode);

    currentPage.getDialog().confirm();
    cy.reload(); //TODO the page does not automatically refresh the table
    currentPage.getContent().getTableRows().should("not.contain", groupCode);
  });

  const openGroupsPage = () => {
    cy.visit("/");
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getUsers().open();
    return currentPage.openGroups();
  };

});
