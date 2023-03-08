import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import AppPage from '../../app/AppPage';

import ManagementPage      from './ManagementPage';
import AuthorizationDialog from './AuthorizationDialog';

export default class AuthorizationPage extends AppContent {

  addButton  = `${htmlElements.button}[type=button].UserAuthorityTable__addNew`;
  table      = `${htmlElements.table}.table`;
  tableAlert = `${htmlElements.div}.authority_UserAuthorityTable_Alert`;
  saveButton = `${htmlElements.button}[type=submit].btn-primary`;

  static openPage(button, code) {
    super.loadPage(button, `/authority/${code}`);
  }

  getTitle() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .find(htmlElements.h1);
  }

  getAddButton() {
    return this.get()
               .find(this.addButton);
  }

  getAuthorityTable() {
    return this.getContents()
               .find(this.table);
  }

  getTableHeaders() {
    return this.getAuthorityTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getTableRows() {
    return this.getAuthorityTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableAlert() {
    return this.get()
               .find(this.tableAlert);
  }

  getSaveButton() {
    return this.get()
               .find(this.saveButton);
  }

  addAuthorization(code) {
    this.getAddButton().then(button => this.click(button));
    this.parent.getDialog().setBody(AuthorizationDialog);
    this.parent.getDialog().getBody().setLoadOnConfirm(AuthorizationPage, undefined, code);
    return cy.get('@currentPage');
  }

  save() {
    this.getSaveButton().then(button => ManagementPage.openPage(button, false));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

}
