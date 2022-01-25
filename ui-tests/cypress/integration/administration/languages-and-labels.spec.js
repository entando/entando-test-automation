import HomePage from '../../support/pageObjects/HomePage';

describe('Languages and labels', () => {

  let currentPage;

  beforeEach(() => {

    cy.kcLogin('admin').as('tokens');

    currentPage = openLanguagesAndLabelsPage();
  });

  afterEach(() => {
    cy.kcLogout();
  });

  describe('Search for labels', () => {

    it('Verify the amount of searched labels when empty criteria', () => {
      currentPage.getContent().getLabelsTabLink().click();
      currentPage.getContent().getSearchSubmitButton().click();
      currentPage.getContent().getDisplayedLabelsCount().should('have.length', 11)
    });

    it('Verify the amount of searched labels when criteria is non-empty', () => {
      currentPage.getContent().getLabelsTabLink().click();
      currentPage.getContent().getLabelSearchForm().type("ALL");
      currentPage.getContent().getSearchSubmitButton().click();
      currentPage.getContent().getDisplayedLabelsCount().should('have.length', 4)
    });

  });

  const openLanguagesAndLabelsPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getAdministration().open();
    return currentPage.openLanguages_Labels();
  };

});
