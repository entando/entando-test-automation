import HomePage from '../../support/pageObjects/HomePage';

const openVersioningPage = () => {
  cy.visit('/');
  let currentPage = new HomePage();
  currentPage = currentPage.getMenu().getContent().open();
  return currentPage.openVersioning();
};

describe('Content Versioning', () => {
  let currentPage;

  beforeEach(() => cy.kcLogin('admin').as('tokens'));

  afterEach(() => cy.kcLogout());

  describe('Content Version Browsing', () => {
    it('Pagination check when there are no results (ENG-2680)', () => {
      currentPage = openVersioningPage();
      currentPage.getContent().getSearchDescInput().type('z');
      currentPage.getContent().getSearchSubmitButton().click();
      cy.wait(1000);

      currentPage.getContent().getPagination()
                  .getItemsCurrent().invoke('text').should('be.equal', '0-0');
      currentPage.getContent().getPagination()
                  .getItemsTotal().invoke('text').should('be.equal', '0');
    });
    
  });

});
