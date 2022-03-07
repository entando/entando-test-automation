import {htmlElements} from '../../WebElement';

import Content from '../../app/Content';

import AppPage from '../../app/AppPage';

import UploadFilesPage    from './UploadFilesPage';
import CreateTextFilePage from './CreateTextFilePage';
import FilesListPage from './FilesListPage';

export default class CreateFolderPage extends Content {

  breadCrumbs      = `${htmlElements.ol}.breadcrumb`;
  operationButtons = `${htmlElements.div}.btn-group`;

  createFolderForm = `${htmlElements.form}.FileBrowserCreateFolder`;
  folderNameInput  = `${htmlElements.input}[name='path']#path`;
  cancelButton     = `${htmlElements.a}.FileBrowserCreateFolderForm__btn-cancel`;
  saveButton       = `${htmlElements.button}.FileBrowserCreateFolderForm__btn-submit`;

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

  getCreateFolderForm() {
    return this.getContents()
               .find(this.createFolderForm);
  }

  getNameInput() {
    return this.getCreateFolderForm()
               .find(this.folderNameInput);
  }

  getCancelButton() {
    return this.getCreateFolderForm()
               .find(this.cancelButton);
  }

  clickCancelButton() {
    this.getCancelButton().click();
    return new AppPage(FilesListPage);
  }

  getSaveButton() {
    return this.getCreateFolderForm()
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

  openCreateTextFilePage() {
    this.getCreateTextFileOperationButton().click();
    return new AppPage(CreateTextFilePage);
  }

}
