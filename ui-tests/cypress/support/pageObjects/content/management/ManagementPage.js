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

  //FIXME AdminConsole is not built on REST APIs
  static openPage(button) {
    cy.contentsAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'contentManagementPageLoadingGET', '/list.action'));
    cy.get(button).click();
    cy.wait('@contentManagementPageLoadingGET');
  }

  //FIXME AdminConsole is not built on REST APIs
  static openSearchPage(button) {
    cy.contentsAdminConsoleController().then(controller => controller.intercept({method: 'POST'}, 'contentManagementSearchPOST', '/search.action'));
    cy.get(button).click();
    cy.wait('@contentManagementSearchPOST');
  }

  //FIXME AdminConsole is not built on REST APIs
  static savePage(button) {
    cy.contentsAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'contentManagementPageLoadingGET', '/results.action'));
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

  getContentCheckBox(content) {
    return this.getTableRow(content).children().find(`${htmlElements.input}#content_${content}`);
  }

  getDelete() {
    return this.get()
               .find(`.btn-toolbar > .pull-right > .btn`);
  }

  clickDelete() {
    this.getDelete().then(button => ResultsPage.openDeleteContentsPage(button));
    return cy.wrap(new AdminPage(ResultsPage)).as('currentPage');
  }

  getUnPublish() {
    return this.get()
               .find(`.toolbar-pf-actions > :nth-child(2) > .col-xs-7 > .btn-toolbar > :nth-child(1) > .btn-default`);
  }

  clickUnPublish() {
    this.getUnPublish().then(button => ResultsPage.openUnPublishContentsPage(button));
    return cy.wrap(new AdminPage(ResultsPage)).as('currentPage');
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

  getActionsRow(code) {
    return this.getTableRow(code)
               .find('.table-view-pf-actions');
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

  openDropdown() {
    this.get()
        .children(htmlElements.button)
        .click({force: true});
    return this;
  }


  getEdit() {
    return this.get()
               .find(htmlElements.li)
               .contains(`Edit`);
  }

  openEdit() {
    this.getEdit().then(button => AddPage.editPage(button, this.code));
    return cy.wrap(new AdminPage(AddPage)).as('currentPage');
  }
}
