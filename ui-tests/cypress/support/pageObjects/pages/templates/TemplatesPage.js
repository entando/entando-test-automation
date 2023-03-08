import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';
import KebabMenu  from '../../app/KebabMenu.js';

import AppPage      from '../../app/AppPage.js';
import Pagination   from '../../app/Pagination.js';
import DeleteDialog from '../../app/DeleteDialog';
import AddPage      from './AddPage.js';
import DetailsPage  from './DetailsPage.js';

export default class TemplatesPage extends AppContent {
  filterRow = `${htmlElements.div}.row`;

  static openPage(button, waitDOM = true) {
    super.loadPage(button, '/page-template', false, waitDOM);
  }

  static changePage(button) {
    this.openPage(button, true);
  }

  static goToPage(page) {
    cy.realType(`${page}`);
    this.openPage(null, true);
  }

  getTable() {
    return this.get()
               .find(htmlElements.table);
  }

  getTableRows() {
    return this.getTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getKebabMenuByCode(code) {
    return new TemplatesKebabMenu(this, code);
  }

  getTableRow(code) {
    return this.getTableRows()
               .find(`button#${code}-actions`)
               .closest(htmlElements.tr);
  }

  getPagination() {
    return new Pagination(this, TemplatesPage);
  }

  getFootArea() {
    return this.get()
               .find(this.filterRow).eq(3);
  }

  getAddButton() {
    return this.getFootArea().find(htmlElements.button);
  }

  openAddPage() {
    this.getAddButton().then(button => AddPage.openPage(button));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }
}

class TemplatesKebabMenu extends KebabMenu {
  static MENU_OPTIONS = {
    EDIT: 'editTemplate',
    CLONE: 'cloneTemplate',
    DETAILS: 'detailsTemplate',
    DELETE: 'detailsDelete'
  };

  get() {
    return this.getKebabButton()
               .closest(`${htmlElements.div}.PageTemplateListMenuActions`);
  }

  getKebabButton() {
    return this.parent.getTableRows()
               .find(`button#${this.code}-actions`);
  }

  getMenu() {
    return this.get()
               .children(`ul[role=menu]`);
  }

  getMenuList() {
    return this.getMenu()
               .children(`li`);
  }

  getListItemByOption(option) {
    const options = Object.values(TemplatesKebabMenu.MENU_OPTIONS);
    const idx     = options.indexOf(option);
    return this.getMenuList().eq(idx > -1 ? idx : 0);
  }

  getEditButton() {
    return this.getListItemByOption(TemplatesKebabMenu.MENU_OPTIONS.EDIT).children(htmlElements.a);
  }

  getCloneButton() {
    return this.getListItemByOption(TemplatesKebabMenu.MENU_OPTIONS.CLONE).children(htmlElements.a);
  }

  getDetailsButton() {
    return this.getListItemByOption(TemplatesKebabMenu.MENU_OPTIONS.DETAILS).children(htmlElements.a);
  }

  getDeleteButton() {
    return this.getListItemByOption(TemplatesKebabMenu.MENU_OPTIONS.DELETE).children(htmlElements.a);
  }

  openEdit() {
    this.getEditButton().then(button => AddPage.openPage(button, this.code, 'edit'));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

  openClone() {
    this.getCloneButton().then(button => AddPage.openPage(button, this.code, 'clone', true));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

  openDetails() {
    this.getDetailsButton().then(button => DetailsPage.openPage(button, this.code));
    return cy.wrap(new AppPage(DetailsPage)).as('currentPage');
  }

  clickDelete() {
    this.getDeleteButton().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    this.parent.parent.getDialog().getBody().setLoadOnConfirm(TemplatesPage);
    return cy.get('@currentPage');
  }
}
