import {htmlElements} from '../../support/pageObjects/WebElement';

describe('Reload configuration', () => {

  beforeEach(() => {
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
    cy.get('@currentPage').then(page => page.getMenu().getAdministration().open().openReloadConfiguration());
  });

  afterEach(() => cy.kcTokenLogout());

  it([Tag.SMOKE, 'ENG-3296'], 'Reload configuration page structure', () => {
    cy.get('@currentPage').then(page => page.getContent().getReloadButton().should('exist').and('be.visible'));
  });

  it([Tag.SANITY, 'ENG-3296'], 'A successful message should be displayed when clicking the reload button', () => {
    cy.get('@currentPage')
      .then(page => page.getContent().reload())
      .then(page => page.getContent().getReloadConfirmation().should('exist').and('be.visible')
                            .then(confirmation => cy.get(confirmation).find(`${htmlElements.span}.pficon`).should('have.class', 'pficon-ok')));
  });

  it([Tag.FEATURE, 'ENG-3296'], 'Clicking on breadcrumb after reload should take back to the reload configuration page', () => {
    cy.get('@currentPage')
      .then(page => page.getContent().reload())
      .then(page => page.getContent().clickSectionRootFromBreadCrumb());
  });

});
