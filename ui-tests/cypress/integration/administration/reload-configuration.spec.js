import HomePage from '../../support/pageObjects/HomePage';

describe('Reload configuration', () => {

  let currentPage;

  beforeEach(() => {
    cy.kcLogin('login/admin').as('tokens');
    currentPage = openReloadConfigurationPage();
  });

  afterEach(() => {
    cy.kcLogout();
  });

  it([Tag.SMOKE, 'ENG-3296'], 'Reload configuration page structure', () => {
    cy.validateAppBuilderUrlPathname('/reloadConfiguration');
    currentPage.getContent().getReloadButton().should('exist').and('be.visible');
  });

  const openReloadConfigurationPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getAdministration().open();
    currentPage = currentPage.openReloadConfiguration();
    return currentPage;
  };

});
