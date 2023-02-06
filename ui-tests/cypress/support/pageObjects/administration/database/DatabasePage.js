import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import ReportPage      from './ReportPage.js';
import AddDatabasePage from './AddDatabasePage';
import DeleteDialog    from '../../app/DeleteDialog';

export default class DatabasePage extends AppContent {

  createBackupButton = `${htmlElements.button}.DatabaseListPage__add`;

  noBackupsAlert = `${htmlElements.div}.DatabaseListPage__alert`;

  databaseListTable = `${htmlElements.table}.DatabaseListTable__table`;
  deleteButton      = `${htmlElements.button}.UserAuthorityTable__delete-tag-btn`;

  static openPage(button) {
    cy.databaseController().then(controller => controller.intercept({method: 'GET'}, 'databasePageLoadingGET', '?*'));
    cy.get(button).click();
    cy.wait(['@databasePageLoadingGET', '@databasePageLoadingGET']);
  }

  getCreateBackupButton() {
    return this.getContents().find(this.createBackupButton);
  }

  getAlert() {
    return this.getContents().find(this.noBackupsAlert);
  }

  getDatabaseListTable() {
    return this.getContents().find(this.databaseListTable);
  }

  getTableHeaders() {
    return this.getDatabaseListTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getTableRows() {
    return this.getDatabaseListTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableRow(code) {
    return this.getTableRows()
               .contains(htmlElements.td, code)
               .parent();
  }

  getRowDetails(code) {
    return this.getTableRow(code).find(htmlElements.a);
  }

  getRowDeleteButton(code) {
    return this.getTableRow(code).find(this.deleteButton);
  }

  openCreateBackup() {
    this.getCreateBackupButton().then(button => AddDatabasePage.openPage(button));
    return cy.wrap(new AppPage(AddDatabasePage)).as('currentPage');
  }

  openRowDetails(code) {
    this.getRowDetails(code).then(button => ReportPage.openPage(button, code));
    return cy.wrap(new AppPage(ReportPage)).as('currentPage');
  }

  clickDeleteButton(code) {
    this.getRowDeleteButton(code).click();
    this.parent.getDialog().setBody(DeleteDialog);
    this.parent.getDialog().getBody().setLoadOnConfirm(DatabasePage);
    cy.waitForStableDOM();
    return cy.get('@currentPage');
  }

}
