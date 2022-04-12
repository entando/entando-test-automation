import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent';

import AppPage from '../../app/AppPage.js';

import DatabasePage from './DatabasePage';

export default class AddDatabasePage extends AppContent {

  tablesList = `${htmlElements.ul}.list-unstyled`;

  addPageButtonsDiv = `${htmlElements.div}.AddDatabaseListTable__btn-add`;
  backupNowButton   = `${htmlElements.button}.AddDatabaseListTable__backup`;
  goBackButton      = `${htmlElements.button}.AddDatabaseListTable__goto-list`;

  static openPage(button) {
    cy.databaseController().then(controller => controller.intercept({method: 'GET'}, 'addDatabasePageLoadingGET', '/initBackup'));
    cy.get(button).click();
    cy.wait('@addDatabasePageLoadingGET');
  }

  getTablesList() {
    return this.getContents().find(this.tablesList);
  }

  getButtons() {
    return this.getContents().find(this.addPageButtonsDiv);
  }

  getGoBackButton() {
    return this.getButtons().find(this.goBackButton);
  }

  getBackupNowButton() {
    return this.getButtons().find(this.backupNowButton);
  }

  goBack() {
    this.getGoBackButton().then(button => DatabasePage.openPage(button));
    return cy.wrap(new AppPage(DatabasePage)).as('currentPage');
  }

  createBackup() {
    this.getBackupNowButton().then(button => DatabasePage.openPage(button));
    return cy.wrap(new AppPage(DatabasePage)).as('currentPage');
  }

}
