import {htmlElements} from '../../WebElement.js';

import AdminContent from '../../app/AdminContent';

import AddPage      from './AddPage';
import AdminPage    from '../../app/AdminPage';
import KebabMenu    from '../../app/KebabMenu.js';
import DeleteDialog from '../../app/DeleteDialog.js';

export default class ManagementPage extends AdminContent {

  contentsTableDiv        = `${htmlElements.div}.Contents__table`;
  contentsKebabMenu       = `${htmlElements.div}.dropdown-kebab-pf`;
  contentsKebabMenuButton = `${htmlElements.button}`;
  contentsKebabMenuAction = `${htmlElements.li}`;

  //FIXME AdminConsole is not built on REST APIs
  static openPage(button) {
    cy.intercept('http://test-7-0-0-final-cypress.apps.ent64azure.com/entando-de-app/do/jacms/Content/list.action').as('contentManagementPageLoadingGET');
    cy.get(button).click();
    cy.wait('@contentManagementPageLoadingGET');
  }

  //FIXME AdminConsole is not built on REST APIs
  static openSearchPage(button) {
    cy.intercept('http://test-7-0-0-final-cypress.apps.ent64azure.com/entando-de-app/do/jacms/Content/search.action').as('contentManagementPageLoadingGET');
    cy.get(button).click();
    cy.wait('@contentManagementPageLoadingGET');
  }

  //FIXME AdminConsole is not built on REST APIs
  static savePage(button) {
    cy.intercept(' http://test-7-0-0-final-cypress.apps.ent64azure.com/entando-de-app/do/jacms/Content/results.action').as('contentManagementPageLoadingGET');
    cy.get(button).click();
    cy.wait('@contentManagementPageLoadingGET');
  }

  getContents() {
    return this.get()
               .children(`${htmlElements.div}#main`);
  }

  getSearchForm() {
    return this.getContents()
               .children(htmlElements.div).eq(0)
               .children(htmlElements.form);
  }

  getFormNameInput() {
    return this.getSearchForm()
               .find(`${htmlElements.input}#text`);
  }

  getFormCodeInput() {
    return this.getSearchForm()
               .find(`${htmlElements.input}#contentIdToken`);
  }

  getFormSearchButton() {
    return this.getSearchForm()
               .find(`${htmlElements.button}[type=submit]`);
  }

  getAddButton() {
    return this.getContents()
               .children(htmlElements.div).eq(1)
               .children(htmlElements.div)
               .children(htmlElements.button);
  }

  getAddOptionsList() {
    return this.getContents()
               .children(htmlElements.div).eq(1)
               .children(htmlElements.div)
               .children(htmlElements.ul);
  }

  //FIXME elements should be identifiable by a more reliable properties
  getAddOption(typeName) {
    return this.getAddOptionsList()
               .children(htmlElements.li)
               .contains(typeName);
  }

  getContentsForm() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .children(`${htmlElements.form}#search`);
  }

  getTableWrapper() {
    return this.getContentsForm().find(`${htmlElements.div}#contentListTable_wrapper`);
  }

  getTable() {
    return this.getTableWrapper().find(`${htmlElements.table}#contentListTable`);
  }

  getTableHeaders() {
    //TODO it's a separate table!!
  }

  getTableRows() {
    return this.getTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  //FIXME we should have the code generated during the creation of the content
  getTableRow(name) {
    return this.getTableRows()
               .contains(htmlElements.td, name)
               .parents(htmlElements.tr);
  }

  clickFormSearchButton() {
    this.getFormSearchButton().then(button => ManagementPage.openSearchPage(button));
    return cy.wrap(new AdminPage(ManagementPage)).as('currentPage');
  }

  openAddContentPage(contentType) {
    this.getAddButton().click()
        .then(() => this.getAddOption(contentType).then(button => AddPage.openPage(button)));
    return cy.wrap(new AdminPage(AddPage)).as('currentPage');
  }

  // ---- old -----


  getTableRowAction(code) {
    return this.getTable()
               .find(`${htmlElements.button}#actionsKebab_${code}`);
  }

  getKebabMenu(code) {
    return new ManagementKebabMenu(this, code);
  }

  openEditContentPage() {
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenu).eq(0)
        .find(this.contentsKebabMenuButton)
        .click();
    this.getContents()
        .get(this.contentsTableDiv)
        .find(this.contentsKebabMenuAction).eq(0)
        .click();
    return new AdminPage(AddPage);
  }

}

class ManagementKebabMenu extends KebabMenu {

  get() {
    return this.parent
               .getTableRowAction(this.code)
               .closest(htmlElements.div);
  }

  getEdit() {
    return this.get()
               .find(htmlElements.li)
               .eq(0);
  }

  getDelete() {
    return this.get()
               .find(htmlElements.li)
               .eq(1);
  }

  openEdit() {
    this.getEdit().click();
    cy.wait(1000);
    return new AdminPage(AddPage);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
