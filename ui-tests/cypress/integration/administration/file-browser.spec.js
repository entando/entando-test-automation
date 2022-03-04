import HomePage from '../../support/pageObjects/HomePage';

describe('File browser', () => {

  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('filesToBeDeleted');
    cy.kcLogin('login/admin').as('tokens');
    cy.fileBrowserController().then(controller => controller.intercept({method: 'GET'}, '?', 'openedRootFolder'));
  });

  afterEach(() => {
    cy.get('@filesToBeDeleted')
      .then(files => {
        if (files) {
          files.forEach(file => cy.fileBrowserController().then(controller => controller.deleteFile(file)))
        }
      });
    cy.kcLogout();
  });

  describe('File browser structure', () => {

    it([Tag.SMOKE, 'ENG-3297'], 'Root folder', () => {
      currentPage = openFileBrowserPage();
      currentPage.getContent().getTableRows().should('have.length', 2);
      currentPage.getContent().getTableRow(0).should('contain', 'public');
      currentPage.getContent().getTableRow(1).should('contain', 'protected');
    });

  });

  const openFileBrowserPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getAdministration().open();
    currentPage = currentPage.openFileBrowser();
    cy.wait('@openedRootFolder');
    cy.validateAppBuilderUrlPathname('/file-browser');
    return currentPage;
  };

});