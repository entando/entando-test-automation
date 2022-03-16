import {deleteDownloadsFolder} from '../../support/utils';
import HomePage                from '../../support/pageObjects/HomePage';
import {htmlElements}          from '../../support/pageObjects/WebElement';

describe('File browser', () => {

  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('filesToBeDeleted');
    cy.wrap(null).as('folderToBeDeleted');
    cy.kcLogin('login/admin').as('tokens');
    cy.fileBrowserController().then(controller => controller.intercept({method: 'GET'}, 'openedRootFolder', '?'));
    cy.fileBrowserController().then(controller => controller.intercept({method: 'GET'}, 'openedFolder', '?protectedFolder=*'));
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

    it([Tag.SMOKE, 'ENG-3297'], 'Create text file page', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openCreateTextFilePage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-text-file');
      currentPage.getContent().getCreateTextFileForm().should('exist').and('be.visible');
      currentPage.getContent().getNameInput().should('exist').and('be.visible');
      currentPage.getContent().getExtensionSelector().should('exist').and('be.visible');
      currentPage.getContent().getTextArea().should('exist').and('be.visible');
      currentPage.getContent().getExtensionSelector().children(htmlElements.option).should('have.length', 2);
      currentPage.getContent().getExtensionSelector().children(htmlElements.option).eq(0).should('have.value', '.txt');
      currentPage.getContent().getExtensionSelector().children(htmlElements.option).eq(1).should('have.value', '.css');
      currentPage.getContent().getCancelButton().should('exist').and('be.visible');
      currentPage.getContent().getSaveButton().should('exist').and('be.visible');
    });

    it([Tag.SANITY, 'ENG-3297'], 'Subfolder content', () => {
      createTestFolder(testFolderInfo);
      createTestFolder(subfolderTestFolderInfo);
      createTestFile(subfolderTestFileInfo);
      currentPage = openPublicFolder();
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getTableRows().should('have.length', 2);
      currentPage.getContent().getFileKebabMenu(testFileInfo.name).should('exist');
      currentPage.getContent().getFolderLink(0).should('exist');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'The upload button should be disabled when no file selected', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openUploadFilesPage();
      cy.validateAppBuilderUrlPathname('/file-browser/upload');
      currentPage.getContent().getUploadFilesForm().should('exist').and('be.visible');
      currentPage.getContent().getUploadButton().should('be.disabled');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'The save button should be disabled when fields are not filled when creating a folder', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openCreateFolderPage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-folder');
      currentPage.getContent().getCreateFolderForm().should('exist').and('be.visible');
      currentPage.getContent().getSaveButton().should('be.disabled');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'The save button should be disabled when fields are not filled when creating a text file', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openCreateTextFilePage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-text-file');
      currentPage.getContent().getCreateTextFileForm().should('exist').and('be.visible');
      currentPage.getContent().getSaveButton().should('be.disabled');
    });

    it([Tag.ERROR, 'ENG-3297'], 'When creating a folder, an error should be displayed when deselecting the folder name field without filling it', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openCreateFolderPage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-folder');
      currentPage.getContent().getNameInputHelpBlock().should('not.exist');
      currentPage.getContent().getNameInput().focus().blur();
      currentPage.getContent().getNameInputHelpBlock().should('exist').and('be.visible');
    });

    it([Tag.ERROR, 'ENG-3297'], 'When creating a text file, an error should be displayed when deselecting a field without filling it', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openCreateTextFilePage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-text-file');
      currentPage.getContent().getNameInputHelpBlock().should('not.exist');
      currentPage.getContent().getNameInput().focus().blur();
      currentPage.getContent().getNameInputHelpBlock().should('exist').and('be.visible');
      currentPage.getContent().getTextAreaHelpBlock().should('not.exist');
      currentPage.getContent().getTextArea().focus().blur();
      currentPage.getContent().getTextAreaHelpBlock().should('exist').and('be.visible');
    });

  });

  describe('File browser interactions', () => {

    beforeEach(() => {
      cy.wrap(null).as('deleteDownloadsFolder');
    });

    afterEach(() => {
      cy.get('@deleteDownloadsFolder').then(deleteFolder => {
        if(deleteFolder) deleteDownloadsFolder();
      })
    });

    it([Tag.SANITY, 'ENG-3297'], 'Downloading a file by clicking on it', () => {
      createTestFile(testFileInfo);
      currentPage = openPublicFolder();
      currentPage.getContent().getFileDownloadLink(testFileInfo.name).click();
      cy.verifyDownload(testFileInfo.name).as('deleteDownloadsFolder');
    });

    it([Tag.SANITY, 'ENG-3297'], 'Uploading a file', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openUploadFilesPage();
      cy.validateAppBuilderUrlPathname('/file-browser/upload');
      currentPage.getContent().selectFiles(`cypress/fixtures/upload/${testFileInfo.name}`);
      currentPage = currentPage.getContent().confirmUpload();
      cy.wait('@openedFolder');
      cy.wrap([testFileInfo.name]).as('filesToBeDeleted');
      cy.validateToast(currentPage);
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getFileKebabMenu(testFileInfo.name).should('exist');
      currentPage.getContent().getFileDownloadLink(testFileInfo.name).should('exist');
    });

    it([Tag.SANITY, 'ENG-3297'], 'Creating a folder', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openCreateFolderPage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-folder');
      currentPage.getContent().getNameInput().type(testFolderInfo.name);
      currentPage= currentPage.getContent().clickSaveButton();
      cy.wait('@openedFolder');
      cy.wrap(testFolderInfo.name).as('folderToBeDeleted');
      cy.validateToast(currentPage);
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getTableRows().should('have.length', 7);
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getFolderLink(-1).should('contain', testFolderInfo.name);
    });

    it([Tag.SANITY, 'ENG-3297'], 'Creating a text file', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openCreateTextFilePage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-text-file');
      currentPage.getContent().getNameInput().type(textTestFile.name);
      currentPage.getContent().getTextArea().type(textTestFile.content);
      currentPage = currentPage.getContent().clickSaveButton();
      cy.wait('@openedFolder');
      cy.wrap([`${textTestFile.name}.${textTestFile.extension}`]).as('filesToBeDeleted');
      cy.validateToast(currentPage);
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getFileKebabMenu(`${textTestFile.name}.${textTestFile.extension}`).should('exist');
      currentPage.getContent().getFileDownloadLink(`${textTestFile.name}.${textTestFile.extension}`).should('exist');
    });

    it([Tag.SANITY, 'ENG-3297'], 'A confirmation modal should be displayed when trying to delete a file/folder', () => {
      createTestFile(testFileInfo);
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openFileKebabMenu(testFileInfo.name);
      currentPage.clickDelete();
      currentPage.getDeleteDialog().should('exist').and('be.visible').and('contain', testFileInfo.name);
    });

    it([Tag.SANITY, 'ENG-3297'], 'Deleting a file/folder', () => {
      createTestFile(testFileInfo);
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openFileKebabMenu(testFileInfo.name);
      currentPage.clickDelete();
      currentPage = currentPage.clickDialogConfirm();
      cy.wait('@openedFolder');
      currentPage.getDialog().get().should('not.exist');
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getFileKebabMenu(testFileInfo.name).should('not.exist');
      cy.wrap(null).as('filesToBeDeleted');
    });

    it([Tag.SANITY, 'ENG-3297'], 'When canceling the deletion, the modal should close and the file not be deleted', () => {
      createTestFile(testFileInfo);
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openFileKebabMenu(testFileInfo.name);
      currentPage.clickDelete();
      currentPage = currentPage.clickDialogCancel();
      currentPage.getDialog().get().should('not.exist');
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getFileKebabMenu(testFileInfo.name).should('exist');
      currentPage.getContent().getFileDownloadLink(testFileInfo.name).should('exist');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'The up button should take to the parent folder', () => {
      createTestFolder(testFolderInfo);
      createTestFile(subfolderTestFileInfo);
      currentPage = openPublicFolder();
      openSubFolder(-1);
      currentPage.getContent().clickUpButton();
      cy.wait('@openedFolder');
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getTableRows().should('have.length', 7);
      currentPage.getContent().getFolderLink(-1).should('contain', testFolderInfo.name);
    });

    it([Tag.FEATURE, 'ENG-3297'], 'Downloading a file using the context menu', () => {
      createTestFile(testFileInfo);
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openFileKebabMenu(testFileInfo.name);
      currentPage = currentPage.clickDownload();
      cy.verifyDownload(testFileInfo.name).as('deleteDownloadsFolder');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'Navigating out of file upload page to root using breadcrumb', () => {
      createTestFolder(testFolderInfo);
      currentPage = openPublicFolder();
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
      currentPage = currentPage.getContent().openUploadFilesPage();
      cy.validateAppBuilderUrlPathname('/file-browser/upload');
      currentPage.getContent().selectFiles(`cypress/fixtures/upload/${testFileInfo.name}`);
      currentPage = currentPage.getContent().clickBreadCrumbsRoot();
      cy.wait('@openedRootFolder');
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getTableRows().should('have.length', 2);
      currentPage.getContent().getTableRow(0).should('contain', 'public');
      currentPage.getContent().getTableRow(1).should('contain', 'protected');
      openSubFolder(0);
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'Navigating out of file upload page NOT to root using breadcrumb', () => {
      createTestFolder(testFolderInfo);
      currentPage = openPublicFolder();
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
      currentPage = currentPage.getContent().openUploadFilesPage();
      cy.validateAppBuilderUrlPathname('/file-browser/upload');
      currentPage.getContent().selectFiles(`cypress/fixtures/upload/${testFileInfo.name}`);
      currentPage = currentPage.getContent().clickFileBrowserBreadCrumbs(1);
      cy.wait('@openedFolder');
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getTableRows().should('have.length', 7);
      currentPage.getContent().getFolderLink(-1).should('contain', testFolderInfo.name);
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'No file is uploaded when canceling out of upload page', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openUploadFilesPage();
      cy.validateAppBuilderUrlPathname('/file-browser/upload');
      currentPage.getContent().selectFiles(`cypress/fixtures/upload/${testFileInfo.name}`);
      currentPage = currentPage.getContent().cancelUpload();
      cy.wait('@openedFolder');
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getFilesTable().should('exist');
      currentPage.getContent().getTableRows().should('have.length', 6);
      currentPage.getContent().getFileKebabMenu(testFileInfo.name).should('not.exist');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'Navigating out of create folder page to root using breadcrumb', () => {
      createTestFolder(testFolderInfo);
      currentPage = openPublicFolder();
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
      currentPage = currentPage.getContent().openCreateFolderPage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-folder');
      currentPage.getContent().getNameInput().type(testFolderInfo.name);
      currentPage = currentPage.getContent().clickBreadCrumbsRoot();
      cy.wait('@openedRootFolder');
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getTableRows().should('have.length', 2);
      currentPage.getContent().getTableRow(0).should('contain', 'public');
      currentPage.getContent().getTableRow(1).should('contain', 'protected');
      openSubFolder(0);
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'Navigating out of create folder page NOT to root using breadcrumb', () => {
      createTestFolder(testFolderInfo);
      currentPage = openPublicFolder();
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
      currentPage = currentPage.getContent().openCreateFolderPage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-folder');
      currentPage.getContent().getNameInput().type(testFolderInfo.name);
      currentPage = currentPage.getContent().clickFileBrowserBreadCrumbs(1);
      cy.wait('@openedFolder');
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getTableRows().should('have.length', 7);
      currentPage.getContent().getFolderLink(-1).should('contain', testFolderInfo.name);
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'No folder is created when canceling out of create folder page', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openCreateFolderPage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-folder');
      currentPage.getContent().getNameInput().type(testFolderInfo.name);
      currentPage = currentPage.getContent().clickCancelButton();
      cy.wait('@openedFolder');
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getFilesTable().should('exist');
      currentPage.getContent().getTableRows().should('have.length', 6);
      currentPage.getContent().getFolderLink(-1).should('not.contain', testFolderInfo.name);
    });

    it([Tag.FEATURE, 'ENG-3297'], 'Navigating out of create text file page to root using breadcrumb', () => {
      createTestFolder(testFolderInfo);
      currentPage = openPublicFolder();
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
      currentPage = currentPage.getContent().openCreateTextFilePage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-text-file');
      currentPage.getContent().getNameInput().type(textTestFile.name);
      currentPage.getContent().getTextArea().type(textTestFile.content);
      currentPage = currentPage.getContent().clickBreadCrumbsRoot();
      cy.wait('@openedRootFolder');
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getTableRows().should('have.length', 2);
      currentPage.getContent().getTableRow(0).should('contain', 'public');
      currentPage.getContent().getTableRow(1).should('contain', 'protected');
      openSubFolder(0);
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'Navigating out of create text file page NOT to root using breadcrumb', () => {
      createTestFolder(testFolderInfo);
      currentPage = openPublicFolder();
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
      currentPage = currentPage.getContent().openCreateTextFilePage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-text-file');
      currentPage.getContent().getNameInput().type(textTestFile.name);
      currentPage.getContent().getTextArea().type(textTestFile.content);
      currentPage = currentPage.getContent().clickFileBrowserBreadCrumbs(1);
      cy.wait('@openedFolder');
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getFilesTable().should('exist').and('be.visible');
      currentPage.getContent().getTableRows().should('have.length', 7);
      currentPage.getContent().getFolderLink(-1).should('contain', testFolderInfo.name);
      openSubFolder(-1);
      currentPage.getContent().getFilesTable().should('not.exist');
      currentPage.getContent().getEmptyFolderAlert().should('exist');
    });

    it([Tag.FEATURE, 'ENG-3297'], 'No file is created when canceling out of create text file page', () => {
      currentPage = openPublicFolder();
      currentPage = currentPage.getContent().openCreateTextFilePage();
      cy.validateAppBuilderUrlPathname('/file-browser/create-text-file');
      currentPage.getContent().getNameInput().type(textTestFile.name);
      currentPage.getContent().getTextArea().type(textTestFile.content);
      currentPage = currentPage.getContent().clickCancelButton();
      cy.wait('@openedFolder');
      cy.validateAppBuilderUrlPathname('/file-browser');
      currentPage.getContent().getFilesTable().should('exist');
      currentPage.getContent().getTableRows().should('have.length', 6);
      currentPage.getContent().getFileKebabMenu(`${textTestFile.name}.${textTestFile.extension}`).should('not.exist');
    });

  });

  const textTestFile = {name: 'test', extension: 'txt', content: 'this is a test'}

  const testFileInfo          = {path: '',      name: 'data1.json', base64: '', type: 'application/json'}
  const subfolderTestFileInfo = {path: 'test/', name: 'data1.json', base64: '', type: 'application/json'}

  const createTestFile = (fileInfo) => {
    cy.fileBrowserController().then(controller => controller.createFile(fileInfo, false))
                              .then(() => cy.wrap([fileInfo.path + fileInfo.name]).as('filesToBeDeleted'));
  }

  const testFolderInfo          = {name: 'test',    path: ''}
  const subfolderTestFolderInfo = {name: 'subTest', path: 'test/'}

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
