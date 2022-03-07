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

  filesTable       = `${htmlElements.table}.FilesListTable__table`;
  emptyFolderAlert = `${htmlElements.div}.alert-warning`;
  folderLink       = `${htmlElements.a}.FilesListTable__link-dir`;
  upButton         = `${htmlElements.a}.FilesListTable__up-link`;
  downloadLink     = `${htmlElements.a}.FilesListTable__link-download`;

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

  getEmptyFolderAlert() {
    return this.getContents()
               .find(this.emptyFolderAlert);
  }

  getTableHeaders() {
    return this.getFilesTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getUpButton() {
    return this.getTableHeaders().find(this.upButton);
  }

  clickUpButton() {
    this.getUpButton().click();
  }

  getTableRows() {
    return cy.get(`${htmlElements.tbody} ${htmlElements.tr}`);
  }

  getTableRow(rowPos) {
    return this.getTableRows()
               .eq(rowPos);
  }

  getFolderLink(rowPos) {
    return this.getTableRow(rowPos)
               .find(this.folderLink);
  }

  getKebabMenu(rowPos) {
    return new FilesKebabMenu(this, rowPos);
  }

  getFileDownloadLink(name) {
    return this.getFileKebabMenu(name)
               .closest(htmlElements.tr)
               .find(this.downloadLink);
  }

  getKebabMenuButton(rowPos) {
    return this.getTableRow(rowPos)
               .find(htmlElements.button);
  }

  getFileKebabMenu(name) {
    return cy.get(`${htmlElements.button}[id='${name}-actions']`);
  }

  openKebabMenu(rowPos) {
    this.getKebabMenuButton(rowPos).click();
    return new FolderKebabMenu(this, rowPos);
  }

  openFileKebabMenu(name) {
    this.getFileKebabMenu(name).click();
    return new FilesKebabMenu(this, name)
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
    this.getFolderLink(rowPos).click();
  }

}

class FolderKebabMenu extends KebabMenu {

  delete = `${htmlElements.li}.FilesListMenuAction__delete`;

  constructor(parent, row) {
    super(parent);
    this.row = row;
  }

  get() {
    return this.parent.getKebabMenuButton(this.row)
               .siblings(htmlElements.ul);
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

class FilesKebabMenu extends KebabMenu {

  download = `${htmlElements.li}.FilesListMenuAction__download`;
  delete   = `${htmlElements.li}.FilesListMenuAction__delete`;

  constructor(parent, name) {
    super(parent);
    this.name = name;
  }

  get() {
    return this.parent.getFileKebabMenu(this.name)
               .siblings(htmlElements.ul);
  }

  getDelete() {
    return this.get()
               .find(this.delete);
  }

  getDownload() {
    return this.get()
               .find(this.download);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

  clickDownload() {
    this.getDownload().click();
    return new AppPage(FilesListPage);
  }

  getDeleteDialog() {
    return this.parent.parent.getDialog().getBody().get();
  }

  clickDialogConfirm() {
    this.parent.parent.getDialog().confirm();
    return new AppPage(FilesListPage);
  }

  clickDialogCancel() {
    this.parent.parent.getDialog().cancel();
    return new AppPage(FilesListPage);
  }

}
