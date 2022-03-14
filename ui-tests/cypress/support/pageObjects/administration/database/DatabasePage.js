import AppPage         from '../../app/AppPage.js';
import Content         from '../../app/Content.js';
import {DialogContent} from '../../app/Dialog.js';
import {htmlElements}  from '../../WebElement.js';
import ReportPage      from './ReportPage.js';

export default class DatabasePage extends Content {

  databaseListTable  = `${htmlElements.table}.DatabaseListTable__table`;
  createBackupButton = `${htmlElements.button}.DatabaseListPage__add`;
  deleteButton       = `${htmlElements.button}.UserAuthorityTable__delete-tag-btn`;
  noBackupsAlert     = `${htmlElements.div}.DatabaseListPage__alert`;

  tablesList        = `${htmlElements.ul}.list-unstyled`;
  addPageButtonsDiv = `${htmlElements.div}.AddDatabaseListTable__btn-add`;
  backupNowButton   = `${htmlElements.button}.AddDatabaseListTable__backup`;
  goBackButton      = `${htmlElements.button}.AddDatabaseListTable__goto-list`;


  getDatabaseListTable() {
    return this.getContents().find(this.databaseListTable);
  }

  getCreateBackupButton() {
    return this.getContents().find(this.createBackupButton);
  }

  getTableHeaders() {
    return this.getDatabaseListTable()
      .children(htmlElements.thead)
      .find(htmlElements.th);
  }

  getTableRows() {
    return this.getDatabaseListTable()
      .children(htmlElements.tbody)
      .children(htmlElements.tr);
  }

  getTableRowByIndex(index) {
    return this.getTableRows().eq(index);
  }

  getDeleteButtonByIndex(index) {
    return this.getTableRowByIndex(index)
      .find(this.deleteButton);
  }

  clickDeleteButtonByIndex(index) {
    this.getDeleteButtonByIndex(index).click();
    this.parent.getDialog().setBody(DialogContent);
  }

  getDetailsByIndex(index) {
    return this.getTableRowByIndex(index)
      .find(htmlElements.a);
  }

  openDetailsByIndex(index) {
    this.getDetailsByIndex(index).click();
    return new AppPage(ReportPage);
  }

  getTablesList() {
    return this.getContents().find(this.tablesList);
  }

  getBackupNowButton() {
    return this.getContents().find(this.addPageButtonsDiv).find(this.backupNowButton);
  }

  getGoBackButton() {
    return this.getContents().find(this.addPageButtonsDiv).find(this.goBackButton);
  }

  createBackup() {
    this.getCreateBackupButton().click();
    this.getBackupNowButton().click();
  }

  getAlert() {
    return this.getContents().find(this.noBackupsAlert);
  }

}
