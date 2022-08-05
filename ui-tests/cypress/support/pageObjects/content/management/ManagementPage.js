import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';
import Pagination from '../../app/Pagination.js';
import AppPage from '../../app/AppPage.js';
import AddPage from './AddPage.js';
import DeleteDialog from '../../app/DeleteDialog.js';
import KebabMenu from '../../app/KebabMenu.js';
import { Dialog } from '../../app/Dialog.js';

export default class ManagementPage extends AppContent {

  addButton     = `${htmlElements.button}#addContent`;

  contentsFilter           = `${htmlElements.div}.ContentsFilter`;
  searchFilterTextfield    = `${htmlElements.input}[type=text]`;
  searchFilterSubmitButton = `${htmlElements.button}.ContentsFilter__search-button`;

  static openPage(button) {
    cy.contentsController().then(controller => controller.intercept({method: 'GET'}, 'contentManagementPageLoadingGET', '?*'));
    cy.categoriesController().then(controller => controller.intercept({method: 'GET'}, 'categoriesLoadingGET', '?parentCode=home'));
    cy.groupsController().then(controller => controller.intercept({method: 'GET'}, 'groupsLoadingGET', '?page=1&pageSize=0'));
    cy.contentTypesController().then(controller => controller.intercept({method: 'GET'}, 'contentTypesLoadingGET', '?page=1&pageSize=0'));
    cy.usersController().then(controller => controller.intercept({method: 'GET'}, 'usersLoadingGET', '?page=1&pageSize=0'));
    cy.get(button).click();
    cy.wait(['@contentManagementPageLoadingGET', '@categoriesLoadingGET', '@groupsLoadingGET', '@contentTypesLoadingGET', '@usersLoadingGET']);
  }

  getAddButton() {
    return this.get()
               .find(this.addButton)
               .eq(0);
  }

  getAddContentDropdownList() {
    return this.getAddButton()
               .closest(htmlElements.div)
               .find(htmlElements.ul);
  }

  openAddContentPage(contentType) {
    this.getAddButton().click();
    this.getAddContentDropdownList().contains(contentType.name).then(element => AddPage.openPage(element, contentType.code));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

  getSearchPanel() {
    return this.getContents()
               .find(this.contentsFilter);
  }

  getSearchTextField() {
    return this.getSearchPanel()
               .find(this.searchFilterTextfield);
  }

  getSearchSubmitButton() {
    return this.getSearchPanel()
               .find(this.searchFilterSubmitButton);
  }

  doSearch(text = '') {
    this.getSearchTextField().then(input => this.clear(input));
    if (text !== '') {
      this.getSearchTextField().then(input => this.type(input, text));
    }
    return this.getSearchSubmitButton().then(button => this.click(button));
  }

  getTable() {
    return this.getContents()
               .find(htmlElements.table);
  }

  getTableRowAction(code) {
    return this.getTable()
               .find(`${htmlElements.button}#actionsKebab_${code}`);
  }

  getTableRow(code) {
    return this.getTableRowAction(code)
               .closest(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new ManagementKebabMenu(this, code);
  }

  getPagination() {
    return new Pagination(this);
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

  getUnpublish() {
    return this.get()
               .find(htmlElements.li)
               .eq(4);
  }

  openEdit(contentType) {
    this.getEdit().then(button => AddPage.openPage(button, contentType, true));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

  clickUnpublish() {
    this.getUnpublish().click();
    this.parent.parent.getDialog().setBody(Dialog);
    return cy.get('@currentPage');
  }

}
