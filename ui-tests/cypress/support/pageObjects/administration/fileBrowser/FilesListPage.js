import {htmlElements} from '../../WebElement';

import Content   from '../../app/Content';
import KebabMenu from '../../app/KebabMenu';

import AppPage      from '../../app/AppPage';
import DeleteDialog from '../../app/DeleteDialog';

import UploadFilesPage    from './UploadFilesPage';
import CreateFolderPage   from './CreateFolderPage';
import CreateTextFilePage from './CreateTextFilePage';

export default class FilesListPage extends Content {

  breadCrumbs      = `${htmlElements.ol}.breadcrumb`;
  operationButtons = `${htmlElements.div}.FileButtonsGroup`;

  filesTable = `${htmlElements.table}.FilesListTable__table`;
  folderLink = `${htmlElements.a}.FilesListTable__link-dir`;

  getFileBrowserBreadCrumbs() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .find(this.breadCrumbs);
  }

  getFileBrowserOperationButtons() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .find(this.operationButtons)
               .children(htmlElements.div)
               .children(htmlElements.div);
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

  getFilesTable() {
    return this.getContents()
               .find(this.filesTable);
  }

  getTableHeaders() {
    return this.getFilesTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getTableRows() {
    return this.getFilesTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableRow(rowPos) {
    return this.getTableRows()
               .eq(rowPos);
  }

  getKebabMenu(rowPos) {
    return new FilesKebabMenu(this, rowPos);
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

  openSubFolder(rowPos) {
    this.getTableRow(rowPos)
        .find(this.folderLink)
        .click();
    cy.wait(1000); //TODO find a better way to identify when the list loaded
  }

}

class FilesKebabMenu extends KebabMenu {

  delete = `${htmlElements.li}.FilesListMenuAction__delete`;

  constructor(parent, row) {
    super(parent);
    this.row = row;
  }

  get() {
    return this.parent.getTableRow(this.row)
               .children(htmlElements.div);
  }

  getDelete() {
    return this.get()
               .find(this.delete);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
