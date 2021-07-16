import HomePage from "../support/pageObjects/HomePage.js";

describe('Contents', () => {
  it('Create a new content', () => {
    cy.kcLogin("admin").as("tokens");

    cy.visit('/');
    let currentPage = new HomePage();

    currentPage = currentPage.getMenu().getContent().open().openManagement();
    currentPage = currentPage.getContent().openAddContentPage();

    currentPage.getContent().addContent(`AAA-EN`, `AAA-IT`, 'description test');

    cy.validateToast(currentPage, true, 'Saved');

    cy.kcLogout();
  })


  // @TODO uncomment when edit of content bug is fixed (simulate bug: create a new content, then go to content management and edit it. You cannot save it)
  // it('Edit a newly created content', () => {
  //   cy.kcLogin("admin").as("tokens");

  //   cy.visit('/');
  //   let currentPage = new HomePage();

  //   currentPage = currentPage.getMenu().getContent().open().openManagement();
  //   currentPage = currentPage.getContent().openEditContentPage();

  //   currentPage.getContent().editContent('description changed');
  //   currentPage.getContent().getAlertMessage().contains('Saved').should('be.visible');

  //   // cy.kcLogout();
  // })

  it('Delete a newly created content', () => {
    cy.kcLogin("admin").as("tokens");

    cy.visit('/');
    let currentPage = new HomePage();

    currentPage = currentPage.getMenu().getContent().open().openManagement();
    currentPage = currentPage.getContent().deleteLastAddedContent();

    cy.validateToast(currentPage, true, 'removed');

    cy.kcLogout();
  })

})