import {htmlElements} from '../../WebElement';

import Content from '../../app/Content';

import AppPage from '../../app/AppPage';

import UploadFilesPage  from './UploadFilesPage';
import CreateFolderPage from './CreateFolderPage';
import FilesListPage from './FilesListPage';

export default class CreateTextFilePage extends Content {

  breadCrumbs        = `${htmlElements.ol}.breadcrumb`;
  operationButtons   = `${htmlElements.div}.btn-group`;

  createTextFileForm = `${htmlElements.form}.CreateTextFileForm`;
  textFileNameInput  = `${htmlElements.input}[name='name']#name`;
  extensionSelector  = `${htmlElements.select}[name='extension'].CreateTextFileForm__select-extension`;
  textArea           = `${htmlElements.textarea}[name='content'].RenderTextAreaInput-textarea`;
  cancelButton       = `${htmlElements.a}.CreateTextFileForm__btn-cancel`;
  saveButton         = `${htmlElements.button}.CreateTextFileForm__btn-submit`;

  getFileBrowserBreadCrumbs() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .find(this.breadCrumbs);
  }

  getBreadCrumbsElement(element) {
    return this.getFileBrowserBreadCrumbs().children(htmlElements.li).eq(element);
  }

  clickBreadCrumbsRoot() {
    this.getBreadCrumbsElement(0).click();
    return new AppPage(FilesListPage);
  }

  clickFileBrowserBreadCrumbs(element) {
    this.getBreadCrumbsElement(element).click();
    return new AppPage(FilesListPage);
  }

  getFileBrowserOperationButtons() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .find(this.operationButtons);
  }

  getUploadFilesOperationButton() {
    return this.getFileBrowserOperationButtons()
               .children(htmlElements.a)
               .eq(2);
  }

  getCreateFolderOperationButton() {
    return this.getFileBrowserOperationButtons()
               .children(htmlElements.a)
               .eq(1);
  }

  getCreateTextFileOperationButton() {
    return this.getFileBrowserOperationButtons()
               .children(htmlElements.a)
               .eq(0);
  }

  getCreateTextFileForm() {
    return this.getContents()
               .find(this.createTextFileForm);
  }

  getNameInput() {
    return this.getCreateTextFileForm()
               .find(this.textFileNameInput);
  }

  getExtensionSelector() {
    return this.getCreateTextFileForm()
               .find(this.extensionSelector);
  }

  getTextArea() {
    return this.getCreateTextFileForm()
               .find(this.textArea);
  }

  getCancelButton() {
    return this.getCreateTextFileForm()
               .find(this.cancelButton);
  }

  getSaveButton() {
    return this.getCreateTextFileForm()
               .find(this.saveButton);
  }

  clickSaveButton() {
    this.getSaveButton().click();
    return new AppPage(FilesListPage);
  }

  openUploadFilesPage() {
    this.getUploadFilesOperationButton().click();
    return new AppPage(UploadFilesPage);
  }

  openCreateFolderPage() {
    this.getCreateFolderOperationButton().click();
    return new AppPage(CreateFolderPage);
  }

}
