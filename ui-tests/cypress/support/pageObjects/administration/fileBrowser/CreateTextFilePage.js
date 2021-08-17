import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content from '../../app/Content';

import AppPage from '../../app/AppPage';

import UploadFilesPage  from './UploadFilesPage';
import CreateFolderPage from './CreateFolderPage';

export default class CreateTextFilePage extends Content {

  breadCrumbs      = `${htmlElements.ol}[${DATA_TESTID}=common_FileBreadcrumb_Breadcrumb]`;
  operationButtons = `${htmlElements.div}[${DATA_TESTID}=common_FileButtonsGroup_ButtonGroup]`;

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

}