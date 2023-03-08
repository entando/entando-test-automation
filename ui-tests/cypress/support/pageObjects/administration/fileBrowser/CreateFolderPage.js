import {htmlElements} from '../../WebElement';

import FilesBrowserPage from './FilesBrowserPage';

import AppPage from '../../app/AppPage';

import BrowserPage        from './BrowserPage';
import UploadFilesPage    from './UploadFilesPage';
import CreateTextFilePage from './CreateTextFilePage';

export default class CreateFolderPage extends FilesBrowserPage {

  constructor(parent) {
    super(parent, BrowserPage, UploadFilesPage, CreateFolderPage, CreateTextFilePage);
  }

  static openPage(button) {
    super.loadPage(button, '/file-browser/create-folder');
  }

  getCreateFolderForm() {
    return this.getContents().find(`${htmlElements.form}.FileBrowserCreateFolder`);
  }

  getNameInput() {
    return this.getCreateFolderForm().find(`${htmlElements.input}#path`);
  }

  getCancelButton() {
    return this.getCreateFolderForm().find(`${htmlElements.a}.FileBrowserCreateFolderForm__btn-cancel`);
  }

  getSaveButton() {
    return this.getCreateFolderForm().find(`${htmlElements.button}.FileBrowserCreateFolderForm__btn-submit`);
  }

  cancel() {
    this.getCancelButton().then(button => this.browserPage.openPage(button, false));
    return cy.wrap(new AppPage(BrowserPage)).as('currentPage');
  }

  save() {
    this.getSaveButton().then(button => this.browserPage.openPage(button));
    return cy.wrap(new AppPage(BrowserPage)).as('currentPage');
  }

}
