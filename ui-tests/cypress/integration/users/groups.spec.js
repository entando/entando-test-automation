import {generateRandomId} from '../../support/utils';

import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage';

describe('Groups', () => {

  let currentPage;

  let groupName;
  let groupCode;

  beforeEach(() => {
    cy.kcLogin('admin').as('tokens');

    groupName = generateRandomId();
    groupCode = groupName.toLowerCase();
  });

  afterEach(() => {
    cy.kcLogout();
  });

  it('Add a new group', () => {
    currentPage = openGroupsPage();

    currentPage = currentPage.getContent().openAddGroupPage();
    currentPage = currentPage.getContent().addGroup(groupName, groupCode);

    currentPage.getContent().getTableRow(groupCode).children(htmlElements.td)
               .then(cells => cy.validateListTexts(cells, [groupName, groupCode]));

    cy.groupsController().then(controller => controller.deleteGroup(groupCode));
  });

  it('Update an existing group', () => {
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
                 cy.get(info).children(htmlElements.div).eq(0).children(htmlElements.div).should('have.text', groupCode);
                 cy.get(info).children(htmlElements.div).eq(1).children(htmlElements.div).should('have.text', updatedGroupName);
               });

    cy.groupsController().then(controller => controller.deleteGroup(groupCode));
  });

  it('Delete an existing group', () => {
    cy.groupsController().then(controller => controller.addGroup(groupCode, groupName));

    currentPage = openGroupsPage();

    currentPage.getContent().getKebabMenu(groupCode).open().clickDelete();
    currentPage.getDialog().getBody().getStateInfo().should('contain', groupCode);

    currentPage.getDialog().confirm();
    currentPage.getContent().getTableRows().should('not.contain', groupCode);
  });

  describe('Groups - referenced by a page', () => {
    const page = {
      charset: 'utf-8',
      code: 'test',
      contentType: 'text/html',
      pageModel: '1-2-column',
      parentCode: 'homepage',
      titles: {en: 'Test'}
    };

    beforeEach(() => {
      cy.groupsController().then(controller => controller.addGroup(groupCode, groupName));
      cy.pagesController().then(controller => controller.addNewPage({...page, ownerGroup: groupCode}));
    });

    afterEach(() => {
      cy.pagesController().then(controller => controller.setPageStatus(page.code, 'draft'));
      cy.pagesController().then(controller => controller.deletePage(page.code));
      cy.groupsController().then(controller => controller.deleteGroup(groupCode));
    });

    it('Update a group used by an unpublished page', () => {
      const updatedGroupName = generateRandomId();

      currentPage = openGroupsPage();

      currentPage = currentPage.getContent().getKebabMenu(groupCode).open().openEdit();
      currentPage = currentPage.getContent().editGroup(updatedGroupName);

      currentPage.getContent().getTableRow(groupCode).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [updatedGroupName, groupCode]));

      currentPage = currentPage.getContent().getKebabMenu(groupCode).open().openDetails();
      currentPage.getContent().getDetailsInfo()
                 .within(info => {
                   cy.get(info).children(htmlElements.div).eq(0).children(htmlElements.div).should('have.text', groupCode);
                   cy.get(info).children(htmlElements.div).eq(1).children(htmlElements.div).should('have.text', updatedGroupName);
                 });
    });

    it('Update a group used by a published page', () => {
      cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));

      const updatedGroupName = generateRandomId();

      currentPage = openGroupsPage();

      currentPage = currentPage.getContent().getKebabMenu(groupCode).open().openEdit();
      currentPage = currentPage.getContent().editGroup(updatedGroupName);

      currentPage.getContent().getTableRow(groupCode).children(htmlElements.td)
                 .then(cells => cy.validateListTexts(cells, [updatedGroupName, groupCode]));

      currentPage = currentPage.getContent().getKebabMenu(groupCode).open().openDetails();
      currentPage.getContent().getDetailsInfo()
                 .within(info => {
                   cy.get(info).children(htmlElements.div).eq(0).children(htmlElements.div).should('have.text', groupCode);
                   cy.get(info).children(htmlElements.div).eq(1).children(htmlElements.div).should('have.text', updatedGroupName);
                 });
    });

    it('Delete a group used by an unpublished page - not allowed', () => {
      currentPage = openGroupsPage();

      currentPage.getContent().getKebabMenu(groupCode).open().clickDelete();
      currentPage.getDialog().getBody().getStateInfo().should('contain', groupCode);
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage, groupCode, false);
    });

    it('Delete a group used by a published page - not allowed', () => {
      cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));

      currentPage = openGroupsPage();

      currentPage.getContent().getKebabMenu(groupCode).open().clickDelete();
      currentPage.getDialog().getBody().getStateInfo().should('contain', groupCode);
      currentPage.getDialog().confirm();

      cy.validateToast(currentPage, groupCode, false);
    });
  });

  const openGroupsPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getUsers().open();
    return currentPage.openGroups();
  };

});
