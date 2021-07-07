import HomePage from "../support/pageObjects/HomePage.js";

import {generateRandomId} from "../support/utils";

const ROLE_NAME = generateRandomId();
const ROLE_CODE = generateRandomId();

var currentPage;

describe('Roles', () => {

  it('Create a role', () => {
    cy.kcLogin("admin").as("tokens");

    cy.visit('/');
    currentPage = new HomePage();

    currentPage = currentPage.getMenu().getUsers().open();
    currentPage = currentPage.openRoles();

    currentPage = currentPage.getContent().addRole();
    currentPage = currentPage.getContent().addRole(ROLE_NAME, ROLE_CODE);

    currentPage.getContent().getTableRows().contains('td', ROLE_CODE).parent().as('tableRows');
    cy.get('@tableRows').children('td').eq(0).should('contain', ROLE_NAME);
    cy.get('@tableRows').children('td').eq(1).should('contain', ROLE_CODE);

    cy.rolesController().then(controller => controller.deleteRole(ROLE_CODE));
    cy.kcLogout();
  })

})