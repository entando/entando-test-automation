import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content from '../../app/Content';

import AppPage from '../../app/AppPage';

import FilesListPage      from './FilesListPage';
import CreateFolderPage   from './CreateFolderPage';
import CreateTextFilePage from './CreateTextFilePage';

export default class UploadFilesPage extends Content {

  breadCrumbs      = `${htmlElements.ol}[${DATA_TESTID}=common_FileBreadcrumb_Breadcrumb]`;
  operationButtons = `${htmlElements.div}[${DATA_TESTID}=common_FileButtonsGroup_ButtonGroup]`;

  uploadFilesInput = `${htmlElements.input}[${DATA_TESTID}=form_RenderFileInput_input]`;
  buttonsDiv       = `${htmlElements.div}[${DATA_TESTID}=upload_UploadFileBrowserForm_div]`;

  getFileBrowserBreadCrumbs() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .find(this.breadCrumbs);
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

  openUploadFilesPage() {
    this.getUploadFilesOperationButton().click();
    return new AppPage(UploadFilesPage);
  }

  openCreateFolderPage() {
    this.getCreateFolderOperationButton().click();
    return new AppPage(CreateFolderPage);
  }

  openCreateTextFilePage() {
    this.getCreateTextFileOperationButton().click();
    return new AppPage(CreateTextFilePage);
  }

  getUploadFilesInput() {
    return this.get()
               .find(this.uploadFilesInput);
  }

  getCancelButton() {
    return this.get()
               .find(this.buttonsDiv)
               .find(htmlElements.button).eq(1);
  }

  getUploadButton() {
    return this.get()
               .find(this.buttonsDiv)
               .find(htmlElements.button).eq(0);
  }

  attachUploadFilesInput(...fileName) {
    this.getUploadFilesInput().attachFile(fileName);
  }

  cancelUpload() {
    this.getCancelButton().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(FilesListPage);
  }

  confirmUpload() {
    this.getUploadButton().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(FilesListPage);
  }

}