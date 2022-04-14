import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import AppPage from '../../app/AppPage';

export default class FilesBrowserPage extends AppContent {

  constructor(parent, browserPage, uploadFilesPage, createFolderPage, createTextFilePage) {
    super(parent);
    this.browserPage        = browserPage;
    this.uploadFilesPage    = uploadFilesPage;
    this.createFolderPage   = createFolderPage;
    this.createTextFilePage = createTextFilePage;
  }

  getFileBrowserBreadCrumbs() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .find(`${htmlElements.div}.FileBreadcrumb`)
               .children(htmlElements.div)
               .children(htmlElements.ol);
  }

  getBreadCrumbsElement(element) {
    return this.getFileBrowserBreadCrumbs().children(htmlElements.li).eq(element);
  }

  getBreadCrumbsRootFolder() {
    return this.getBreadCrumbsElement(0);
  }

  getBreadCrumbsFirstLevelFolder() {
    return this.getBreadCrumbsElement(1);
  }

  getFileBrowserOperationButtons() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .find(`${htmlElements.div}.FileButtonsGroup`)
               .children(htmlElements.div)
               .children(htmlElements.div);
  }

  getUploadFilesOperationButton() {
    return this.getFileBrowserOperationButtons()
               .find(`${htmlElements.a}.FilesButtonGroup__uploadFile`);
  }

  getCreateFolderOperationButton() {
    return this.getFileBrowserOperationButtons()
               .find(`${htmlElements.a}.FilesButtonGroup__createFolder`);
  }

  getCreateTextFileOperationButton() {
    return this.getFileBrowserOperationButtons()
               .find(`${htmlElements.a}.FilesButtonGroup__createTextFile`);
  }

  goToRootViaBreadCrumbs() {
    this.getBreadCrumbsRootFolder().then(button => this.browserPage.openPage(button));
    return cy.wrap(new AppPage(this.browserPage)).as('currentPage');
  }

  goToFirstLevelViaBreadCrumbs() {
    this.getBreadCrumbsFirstLevelFolder().then(button => this.browserPage.openPage(button));
    return cy.wrap(new AppPage(this.browserPage)).as('currentPage');
  }

  goToElementViaBreadCrumbs(element) {
    this.getBreadCrumbsElement(element).then(button => this.browserPage.openPage(button));
    return cy.wrap(new AppPage(this.browserPage)).as('currentPage');
  }

  openUploadFilesPage() {
    this.getUploadFilesOperationButton().click();
    return cy.wrap(new AppPage(this.uploadFilesPage)).as('currentPage');
  }

  openCreateFolderPage() {
    this.getCreateFolderOperationButton().click();
    return cy.wrap(new AppPage(this.createFolderPage)).as('currentPage');
  }

  openCreateTextFilePage() {
    this.getCreateTextFileOperationButton().click();
    return cy.wrap(new AppPage(this.createTextFilePage)).as('currentPage');
  }

}
