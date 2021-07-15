import {generateRandomId} from '../support/utils';

import {TEST_ID_ROLE_LIST_TABLE} from '../test-const/role-test-const';
import {htmlElements} from "../support/pageObjects/WebElement";

import HomePage from "../support/pageObjects/HomePage";

describe('User Roles', () => {

  const ROLE_NAME = generateRandomId();
  const ROLE_CODE = generateRandomId();
  let currentPage;

  beforeEach(() => {
    cy.kcLogin("admin").as("tokens");
  });

  afterEach(() => {
    cy.kcLogout();
  });

  describe('Role ', () => {

    it('Should add a new role', () => {
      currentPage = openRolesPage();

      currentPage = currentPage.getContent().openAddRolePage();
      currentPage = currentPage.getContent().addRole(ROLE_NAME, ROLE_CODE);

      currentPage.getContent().getTableRows().contains(htmlElements.td, ROLE_CODE).parent().as('tableRows');
      cy.get('@tableRows').children(htmlElements.td).eq(0).should('contain', ROLE_NAME);
      cy.get('@tableRows').children(htmlElements.td).eq(1).should('contain', ROLE_CODE);

      cy.rolesController().then(controller => controller.deleteRole(ROLE_CODE));
    });

    it('Should update a role and verify change on details page', () => {
      const ROLE_NAME_EDIT = generateRandomId();

      cy.rolesController().then(controller => controller.addRole(ROLE_CODE, ROLE_NAME));

      currentPage = openRolesPage();

      currentPage = currentPage.getContent().getKebabMenu(ROLE_CODE).open().openEdit();
      currentPage = currentPage.getContent().editRole(ROLE_NAME_EDIT);

      currentPage.getContent().getTableRows().contains(htmlElements.td, ROLE_CODE).parent().as('tableRows');
      cy.get('@tableRows').children(htmlElements.td).eq(0).should('contain', ROLE_NAME_EDIT);
      cy.get('@tableRows').children(htmlElements.td).eq(1).should('contain', ROLE_CODE);

      currentPage = currentPage.getContent().getKebabMenu(ROLE_CODE).open().openDetails();
      currentPage.getContent().getCodeValue().should('contain', ROLE_CODE);
      currentPage.getContent().getNameValue().should('contain', ROLE_NAME_EDIT);

      cy.rolesController().then(controller => controller.deleteRole(ROLE_CODE));
    });

    it('Should delete an unreferenced role', () => {
      cy.rolesController().then(controller => controller.addRole(ROLE_CODE, ROLE_NAME));

      currentPage = openRolesPage();

      currentPage.getContent().getKebabMenu(ROLE_CODE).open().clickDelete();
      currentPage.getDialog().getStateInfo().should('contain', ROLE_CODE);

      currentPage.getDialog().confirm();
      currentPage.getContent().getTableRows().should('not.contain', ROLE_CODE);
    });

    it('Should forbid deletion of an assigned role to a user', () => {
      currentPage = openRolesPage();

      cy.log('Delete the role');
      const adminRoleCode = 'admin';
      cy.openPageFromMenu(['Users', 'Roles']);
      cy.contains(adminRoleCode).should('be.visible');
      cy.openTableActionsByTestId(adminRoleCode);
      cy.getVisibleActionItemByTestID(TEST_ID_ROLE_LIST_TABLE.ACTION_DELETE_ROLE).click();
      cy.getModalDialogByTitle('Delete role').should('not.be.visible');
    });
  });

  const openRolesPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getUsers().open();
    return currentPage.openRoles();
  };

});