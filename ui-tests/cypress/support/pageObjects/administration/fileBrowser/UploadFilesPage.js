import {htmlElements} from '../../WebElement';

import FilesBrowserPage from './FilesBrowserPage';

import AppPage from '../../app/AppPage';

import BrowserPage        from './BrowserPage';
import CreateFolderPage   from './CreateFolderPage';
import CreateTextFilePage from './CreateTextFilePage';

export default class UploadFilesPage extends FilesBrowserPage {

  constructor(parent) {
    super(parent, BrowserPage, UploadFilesPage, CreateFolderPage, CreateTextFilePage);
  }

  static openPage(button) {
    super.loadPage(button, '/file-browser/upload');
  }

  getUploadFilesForm() {
    return this.get().find(`${htmlElements.form}.UploadFileBrowserForm`);
  }

  getUploadFilesInput() {
    return this.getUploadFilesForm().find(`${htmlElements.input}[name="file"]`);
  }

  getFormButtons() {
    return this.getUploadFilesForm().find(`${htmlElements.div}.UploadFileBrowserForm__btn`);
  }

  getCancelButton() {
    return this.getFormButtons().find(htmlElements.button).eq(1);
  }

  getUploadButton() {
    return this.getFormButtons().find(htmlElements.button).eq(0);
  }

  selectFiles(fileName, options) {
    this.getUploadFilesInput().selectFile(fileName, options);
    return cy.get('@currentPage');
  }

  cancelUpload() {
    this.getCancelButton().then(button => this.browserPage.openPage(button));
    return cy.wrap(new AppPage(BrowserPage)).as('currentPage');
  }

  confirmUpload() {
    this.getUploadButton().then(button => this.browserPage.openPage(button, true));
    return cy.wrap(new AppPage(BrowserPage)).as('currentPage');
  }

}
