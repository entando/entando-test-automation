import HomePage       from '../../support/pageObjects/HomePage';
import {htmlElements} from '../../support/pageObjects/WebElement';

describe([Tag.GTS], 'File browser', () => {

  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('filesToBeDeleted');
    cy.kcLogin('login/admin').as('tokens');
    currentPage = openFileBrowserPage();
  });

  afterEach(() => {
    cy.get('@filesToBeDeleted')
      .then(files => files.forEach(file => cy.fileBrowserController().then(controller => controller.deleteFile(file))));
    cy.kcLogout();
  });

  describe('Upload file', () => {

    it('Upload a json file', () => {
      currentPage.getContent().openSubFolder(0);

      currentPage = currentPage.getContent().openUploadFilesPage();
      currentPage.getContent().selectFiles('cypress/fixtures/upload/data1.json');
      currentPage = currentPage.getContent().confirmUpload();
      cy.wrap(['data1.json']).as('filesToBeDeleted');

      cy.validateToast(currentPage);
      currentPage.getContent().getTableRows().then(rows =>
          cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('contain.text', 'data1.json')
      );
    });

    it('Upload a json file via drag n drop', () => {
      currentPage.getContent().openSubFolder(0);

      currentPage = currentPage.getContent().openUploadFilesPage();
      currentPage.getContent().selectFiles('cypress/fixtures/upload/data1.json', {action: 'drag-drop'});
      currentPage = currentPage.getContent().confirmUpload();
      cy.wrap(['data1.json']).as('filesToBeDeleted');

      cy.validateToast(currentPage);
      currentPage.getContent().getTableRows().then(rows =>
          cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('contain.text', 'data1.json')
      );
    });

    it('Upload multiple json file', () => {
      currentPage.getContent().openSubFolder(0);

      currentPage = currentPage.getContent().openUploadFilesPage();
      currentPage.getContent().selectFiles('cypress/fixtures/upload/data1.json', 'cypress/fixtures/upload/data2.json');
      currentPage = currentPage.getContent().confirmUpload();
      cy.wrap(['data1.json', 'data2.json']).as('filesToBeDeleted');

      cy.validateToast(currentPage);
      currentPage.getContent().getTableRows().then(rows => {
        cy.wrap(rows).eq(-2).children(htmlElements.td).eq(0).should('contain.text', 'data1.json');
        cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('contain.text', 'data2.json');
      });
    });

    it('Delete file with parenthesis in the filename', () => {
      //TODO file upload should be performed via API call
      const filename = 'data(with-parenthesis).json';
      currentPage.getContent().openSubFolder(0);

      currentPage = currentPage.getContent().openUploadFilesPage();
      currentPage.getContent().selectFiles(`cypress/fixtures/upload/${filename}`);
      currentPage = currentPage.getContent().confirmUpload();

      cy.validateToast(currentPage);
      cy.closeAllToasts(currentPage);
      currentPage.getContent().getTableRows().then(rows => {
        cy.wrap(rows).contains(filename).should('be.visible');
        // delete file
        cy.wrap(rows).contains(filename).parents(htmlElements.tr).children(htmlElements.td).eq(-1).find(htmlElements.button).eq(0).click();
        cy.wrap(rows).contains(filename).parents(htmlElements.tr).children(htmlElements.td).eq(-1).find(htmlElements.a).eq(1).click();
        cy.wait(1000); // wait modal to open
        cy.get(`${htmlElements.button}[id=DeleteFileModal__button-delete]`).click();
        cy.wait(1000); // wait toast to show up
        cy.validateToast(currentPage);
      });
    });

  });

  const openFileBrowserPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getAdministration().open();
    return currentPage.openFileBrowser();
  };

});
