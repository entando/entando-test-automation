import HomePage             from "../../support/pageObjects/HomePage";
import { generateRandomId } from '../../support/utils';

let currentPage;

const openManagementPage = () => {
    cy.visit('/');
    let currentPage = new HomePage();
    currentPage = currentPage.getMenu().getPages().open();
    return currentPage.openManagement();
}

describe('Pages Management - Delete', () => {
  beforeEach(() => {
      cy.kcLogin("admin").as("tokens");
  });

  afterEach(() => {
      cy.kcLogout();
  });

  it('should delete an unpublished page', () => {
    // add a new page
    const code = generateRandomId();
    cy.pagesController().then(controller => controller.addPage(code, 'unpublished page', 'administrators', '1-2-column', 'homepage'));

    // try to delete unpublished page
    currentPage = openManagementPage();

    currentPage.getContent().getKebabMenu(code).open().clickDelete();
    currentPage.getDialog().getBody().getStateInfo().should("contain", code);

    currentPage.getDialog().confirm();

    // unpublished page should be deleted
    currentPage.getContent().getTableRows().should("not.contain", code);
  });

  it('should not delete a published page', () => {
    // add a new page
    const code = generateRandomId();
    cy.pagesController().then(controller => { 
      controller.addPage(code, 'published page', 'administrators', '1-2-column', 'homepage');
      controller.setPageStatus(code, 'published');
    });

    // try to delete unpublished page
    currentPage = openManagementPage();

    // delete button should be disabled
    currentPage.getContent().getKebabMenu(code).getDelete().should('have.class', 'disabled');
    
    // delete recently added page
    cy.pagesController().then(controller => {
      controller.setPageStatus(code, 'draft');
      controller.deletePage(code);
    });
  });

  it('should not delete a drafted page', () => {
    // add a new page
    const code = generateRandomId();
    cy.pagesController().then(controller => { 
      controller.addPage(code, 'published page', 'administrators', '1-2-column', 'homepage');
      controller.setPageStatus(code, 'published');
      controller.addWidgetToPage(code, 0, 'search_form');
    });

    // try to delete unpublished page
    currentPage = openManagementPage();

    currentPage.getContent().getKebabMenu(code).open().clickDelete();
    currentPage.getDialog().confirm();
    cy.wait(1000);
    
    // Error message should appear
    currentPage.getContent().getErrorsContainer().should('contain', 'Online pages can not be deleted');

    // delete recently added page
    cy.pagesController().then(controller => {
      controller.setPageStatus(code, 'draft');
      controller.deletePage(code);
    });
  });

  it('should not delete a published page with published children', () => {
    // add a new page
    const code = generateRandomId();
    const childrenCode = generateRandomId();
    cy.pagesController().then(controller => { 
      controller.addPage(code, 'published page', 'administrators', '1-2-column', 'homepage');
      controller.setPageStatus(code, 'published');
      controller.addPage(childrenCode, 'published children', 'administrators', '1-2-column', code);
      controller.setPageStatus(childrenCode, 'published');
    });

    // try to delete published page with published children
    currentPage = openManagementPage();

    // delete button should be disabled
    currentPage.getContent().getKebabMenu(code).getDelete().should('have.class', 'disabled');
    

    // delete recently added page
    cy.pagesController().then(controller => {
      controller.setPageStatus(childrenCode, 'draft');
      controller.deletePage(childrenCode);
      controller.setPageStatus(code, 'draft');
      controller.deletePage(code);
    });
  });

  it('should not delete a published page with unpublished children', () => {
    // add a new page
    const code = generateRandomId();
    const childrenCode = generateRandomId();
    cy.pagesController().then(controller => { 
      controller.addPage(code, 'published page', 'administrators', '1-2-column', 'homepage');
      controller.setPageStatus(code, 'published');
      controller.addPage(childrenCode, 'unpublished children', 'administrators', '1-2-column', code);
    });

    // try to delete published page with published children
    currentPage = openManagementPage();

    // delete button should be disabled
    currentPage.getContent().getKebabMenu(code).getDelete().should('have.class', 'disabled');
    

    // delete recently added page
    cy.pagesController().then(controller => {
      controller.deletePage(childrenCode);
      controller.setPageStatus(code, 'draft');
      controller.deletePage(code);
    });
  });

  it('should not delete an unpublished page with unpublished children', () => {
    // add a new page
    const code = generateRandomId();
    const childrenCode = generateRandomId();
    cy.pagesController().then(controller => { 
      controller.addPage(code, 'unpublished page', 'administrators', '1-2-column', 'homepage');
      controller.addPage(childrenCode, 'unpublished children', 'administrators', '1-2-column', code);
    });

    // try to delete published page with published children
    currentPage = openManagementPage();

    // delete button should be disabled
    currentPage.getContent().getKebabMenu(code).getDelete().should('have.class', 'disabled');
    
    // delete recently added page
    cy.pagesController().then(controller => {
      controller.deletePage(childrenCode);
      controller.setPageStatus(code, 'draft');
      controller.deletePage(code);
    });
  });

});
