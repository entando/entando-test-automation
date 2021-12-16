import HomePage from '../../support/pageObjects/HomePage';

const openFragmentsPage = () => {
  cy.visit('/');
  let currentPage = new HomePage();
  currentPage = currentPage.getMenu().getComponents().open();
  return currentPage.openUXFragments();
};

describe('UX Fragments', () => {
  let currentPage;

  beforeEach(() => cy.kcLogin('admin').as('tokens'));

  afterEach(() => cy.kcLogout());

  describe('Fragments Browsing', () => {
    it('Pagination check when there are no results (ENG-2680)', () => {
      currentPage = openFragmentsPage();
      currentPage.getContent().getSearchCodeInput().type('z');
      currentPage.getContent().getSearchSubmitButton().click();
      cy.wait(1000);

      currentPage.getContent().getPagination()
                  .getItemsCurrent().invoke('text').should('be.equal', '0-0');
      currentPage.getContent().getPagination()
                  .getItemsTotal().invoke('text').should('be.equal', '0');
    });
    
  });

});
