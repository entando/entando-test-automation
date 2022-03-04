import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';

describe('File browser', () => {

  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('filesToBeDeleted');
    cy.kcLogin('login/admin').as('tokens');
    cy.fileBrowserController().then(controller => controller.intercept({method: 'GET'}, '?', 'openedRootFolder'));
    cy.fileBrowserController().then(controller => controller.intercept({method: 'GET'}, '?protectedFolder=*', 'openedFolder'));
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

    it([Tag.SMOKE, 'ENG-3297'], 'Subfolder', () => {
      currentPage = openPublicFolder();
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getTableRow(0).children(htmlElements.td).should('have.length', 4);
      currentPage.getContent().getUpButton().should('exist').and('be.visible');
      currentPage.getContent().getUploadFilesOperationButton().should('exist').and('be.visible');
      currentPage.getContent().getCreateFolderOperationButton().should('exist').and('be.visible');
      currentPage.getContent().getCreateTextFileOperationButton().should('exist').and('be.visible');
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

  const openPublicFolder = () => {
    currentPage = openFileBrowserPage();
    openSubFolder(0);
    return currentPage;
  };

  const openSubFolder = (row) => {
    currentPage.getContent().openSubFolder(row);
    cy.wait('@openedFolder');
  };

});
