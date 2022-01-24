import {htmlElements} from '../../support/pageObjects/WebElement';

import HomePage from '../../support/pageObjects/HomePage';

describe('File browser', () => {

  let currentPage;

  beforeEach(() => {
    cy.wrap(null).as('fileToBeDeleted');

    cy.kcLogin('admin').as('tokens');

    currentPage = openFileBrowserPage();
  });

  afterEach(() => {
    cy.get('@fileToBeDeleted')
      .then(files => files.forEach(file => cy.fileBrowserController().then(controller => controller.deleteFile(file))));
    cy.kcLogout();
  });


  describe('Upload file', () => {

    it('Upload a json file', () => {
      currentPage.getContent().openSubFolder(0);

      currentPage = currentPage.getContent().openUploadFilesPage();
      currentPage.getContent().attachUploadFilesInput('upload/data1.json');
      currentPage = currentPage.getContent().confirmUpload();
      cy.wrap(['data1.json']).as('fileToBeDeleted');

      cy.validateToast(currentPage);
      currentPage.getContent().getTableRows().then(rows =>
          cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('contain.text', 'data1.json')
      );
    });

    it('Upload multiple json file', () => {
      currentPage.getContent().openSubFolder(0);

      currentPage = currentPage.getContent().openUploadFilesPage();
      currentPage.getContent().attachUploadFilesInput('upload/data1.json', 'upload/data2.json');
      currentPage = currentPage.getContent().confirmUpload();
      cy.wrap(['data1.json', 'data2.json']).as('fileToBeDeleted');

      cy.validateToast(currentPage);
      currentPage.getContent().getTableRows().then(rows => {
        cy.wrap(rows).eq(-2).children(htmlElements.td).eq(0).should('contain.text', 'data1.json');
        cy.wrap(rows).eq(-1).children(htmlElements.td).eq(0).should('contain.text', 'data2.json');
      });
    });

    xit('Upload a json file via drag n drop', () => {
      //TODO find how to simulate file drag 'n' drop
    });

  });

  const openFileBrowserPage = () => {
    cy.visit('/');
    currentPage = new HomePage();
    currentPage = currentPage.getMenu().getAdministration().open();
    return currentPage.openFileBrowser();
  };

});
