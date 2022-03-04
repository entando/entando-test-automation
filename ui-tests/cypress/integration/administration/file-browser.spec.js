import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';

describe('File browser', () => {

  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('filesToBeDeleted');
    cy.wrap(null).as('folderToBeDeleted');
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
    cy.get('@folderToBeDeleted')
      .then(folder => {
        if (folder) cy.fileBrowserController().then(controller => controller.deleteFolder(folder));
      })
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

    it([Tag.SMOKE, 'ENG-3297'], 'Folder context menu', () => {
      createTestFolder(testFolderInfo);
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openKebabMenu(-1);
      currentPage.get().should('exist').and('be.visible');
      currentPage.getDelete().should('exist').and('be.visible');
    })

    it([Tag.SMOKE, 'ENG-3297'], 'File context menu', () => {
      createTestFile(testFileInfo);
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openFileKebabMenu(testFileInfo.name);
      currentPage.get().should('exist').and('be.visible');
      currentPage.getDownload().should('exist').and('be.visible');
      currentPage.getDelete().should('exist').and('be.visible');
    });

    it([Tag.SMOKE, 'ENG-3297'], 'Upload files page', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openUploadFilesPage();
      cy.validateAppBuilderUrlPathname('/file-browser/upload');
      currentPage.getContent().getUploadFilesForm().should('exist').and('be.visible');
      currentPage.getContent().getUploadFilesInput().should('exist').and('be.visible');
      currentPage.getContent().getCancelButton().should('exist').and('be.visible');
      currentPage.getContent().getUploadButton().should('exist').and('be.visible');
    });

    it([Tag.SMOKE, 'ENG-3297'], 'Create folder page', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openCreateFolderPage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-folder');
      currentPage.getContent().getCreateFolderForm().should('exist').and('be.visible');
      currentPage.getContent().getNameInput().should('exist').and('be.visible');
      currentPage.getContent().getCancelButton().should('exist').and('be.visible');
      currentPage.getContent().getSaveButton().should('exist').and('be.visible');
    });

  });

  const testFileInfo = {path: '', name: 'data1.json', base64: '', type: 'application/json'}

  const createTestFile = (fileInfo) => {
    cy.fileBrowserController().then(controller => controller.createFile(fileInfo, false))
                              .then(() => cy.wrap([fileInfo.path + fileInfo.name]).as('filesToBeDeleted'));
  }

  const testFolderInfo = {name: 'test', path: ''}

  const createTestFolder = (folderInfo) => {
    cy.fileBrowserController().then(controller => controller.createFolder(folderInfo.path + folderInfo.name))
                              .then(response => {
                                cy.get('@folderToBeDeleted').then(folder => {
                                 if (!folder) cy.wrap(response.body.payload.path).as('folderToBeDeleted')
                                })
                              });
  };

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
