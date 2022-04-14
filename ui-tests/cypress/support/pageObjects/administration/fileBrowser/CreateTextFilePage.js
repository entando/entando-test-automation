import {htmlElements} from '../../WebElement';

import FilesBrowserPage from './FilesBrowserPage';

import AppPage from '../../app/AppPage';

import BrowserPage      from './BrowserPage';
import UploadFilesPage  from './UploadFilesPage';
import CreateFolderPage from './CreateFolderPage';

export default class CreateTextFilePage extends FilesBrowserPage {

  constructor(parent) {
    super(parent, BrowserPage, UploadFilesPage, CreateFolderPage, CreateTextFilePage);
  }

  getCreateTextFileForm() {
    return this.getContents().find(`${htmlElements.form}.CreateTextFileForm`);
  }

  getNameInput() {
    return this.getCreateTextFileForm().find(`${htmlElements.input}#name`);
  }

  getExtensionSelector() {
    return this.getCreateTextFileForm().find(`${htmlElements.select}[name='extension']`);
  }

  getTextArea() {
    return this.getCreateTextFileForm().find(`${htmlElements.textarea}[name='content']`);
  }

  getCancelButton() {
    return this.getCreateTextFileForm().find(`${htmlElements.a}.CreateTextFileForm__btn-cancel`);
  }

  getSaveButton() {
    return this.getCreateTextFileForm().find(`${htmlElements.button}.CreateTextFileForm__btn-submit`);
  }

  cancel() {
    this.getCancelButton().then(button => BrowserPage.openPage(button));
    return cy.wrap(new AppPage(BrowserPage)).as('currentPage');
  }

  save() {
    this.getSaveButton().then(button => BrowserPage.openPage(button));
    return cy.wrap(new AppPage(BrowserPage)).as('currentPage');
  }

}
