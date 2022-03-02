import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';

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

  it([Tag.SANITY, 'ENG-3296'], 'A successful message should be displayed when clicking the reload button', () => {
    cy.intercept('POST', '**/reloadConfiguration').as('reloadConfiguration')
    currentPage.getContent().clickReloadButton();
    cy.wait('@reloadConfiguration').its('response.statusCode').should('eq', 200);
    cy.validateAppBuilderUrlPathname('/reloadConfiguration/confirm');
    currentPage.getContent().getReloadConfirmation().should('exist').and('be.visible');
    currentPage.getContent().getReloadConfirmation().find(`${htmlElements.span}.pficon`).should('have.class', 'pficon-ok');
  });

  it([Tag.FEATURE, 'ENG-3296'], 'Clicking on breadcrumb after reload should take back to the reload configuration page', () => {
    cy.intercept('POST', '**/reloadConfiguration').as('reloadConfiguration')
    currentPage.getContent().clickReloadButton();
    cy.wait('@reloadConfiguration').its('response.statusCode').should('eq', 200);
    currentPage.getContent().getBreadCrumb().children(htmlElements.li).eq(1).click();
    cy.validateAppBuilderUrlPathname('/reloadConfiguration');
  });

  const openReloadConfigurationPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getAdministration().open();
    currentPage = currentPage.openReloadConfiguration();
    return currentPage;
  };

});
