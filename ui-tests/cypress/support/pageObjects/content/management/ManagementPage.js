import {htmlElements} from '../../WebElement.js';

import AdminContent from '../../app/AdminContent';

import AddPage     from './AddPage';
import AdminPage   from '../../app/AdminPage';
import KebabMenu   from '../../app/KebabMenu.js';
import ResultsPage from './ResultsPage';

export default class ManagementPage extends AdminContent {

  contentsTableDiv        = `${htmlElements.div}.Contents__table`;
  contentsKebabMenu       = `${htmlElements.div}.dropdown-kebab-pf`;
  contentsKebabMenuButton = `${htmlElements.button}`;
  contentsKebabMenuAction = `${htmlElements.li}`;

  static openPage(button) {
    super.loadPage(button, '/jacms/Content/list.action');
  }

  static openSearchPage(button) {
    super.loadPage(button, '/jacms/Content/search.action');
  }

  static savePage(button) {
    super.loadPage(button, '/jacms/Content/results.action');
  }

  getContents() {
    return super.getContents().children(`${htmlElements.div}#main`);
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

  getFormSearchButton() {
    return this.getSearchForm()
               .find(`${htmlElements.button}[type=submit]`);
  }

  getContentCheckBox(content) {
    return this.getTableRow(content).children().find(`${htmlElements.input}#content_${content}`);
  }

  getDelete() {
    return this.getContents()
               .find(`${htmlElements.button}.btn-danger`);
  }

  getContentsForm() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .children(`${htmlElements.form}#search`);
  }

  getUnPublish() {
    return this.getContents()
               .find(`${htmlElements.button}[title="Suspend the content"]`);
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

  getTableRow(code) {
    return this.getTableRows()
               .contains(htmlElements.td, code)
               .parents(htmlElements.tr);
  }

  getActionsRow(code) {
    return this.getTableRow(code)
               .find('.table-view-pf-actions');
  }

  clickDelete() {
    this.getDelete().then(button => ResultsPage.openConfirmActionPage(button));
    return cy.wrap(new AdminPage(ResultsPage)).as('currentPage');
  }

  clickFormSearchButton() {
    this.getFormSearchButton().then(button => ManagementPage.openSearchPage(button));
    return cy.wrap(new AdminPage(ManagementPage)).as('currentPage');
  }

  clickUnPublish() {
    this.getUnPublish().then(button => ResultsPage.openConfirmActionPage(button));
    return cy.wrap(new AdminPage(ResultsPage)).as('currentPage');
  }

  openAddContentPage(contentType) {
    this.getAddButton().click()
        .then(() => this.getAddOption(contentType.name).then(button => AddPage.openPage(button)));
    return cy.wrap(new AdminPage(AddPage)).as('currentPage');
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
    return this.parent.getActionsRow(this.code)
               .children(htmlElements.div);
  }

  getEdit() {
    return this.get()
               .find(htmlElements.li)
               .contains(`Edit`);
  }

  openEdit(force = false) {
    this.getEdit().then(button => AddPage.editPage(button, force));
    return cy.wrap(new AdminPage(AddPage)).as('currentPage');
  }
}
