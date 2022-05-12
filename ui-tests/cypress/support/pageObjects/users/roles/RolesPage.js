import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';
import KebabMenu  from '../../app/KebabMenu';

import AppPage      from '../../app/AppPage.js';
import DeleteDialog from '../../app/DeleteDialog';

import AddPage     from './AddPage.js';
import EditPage    from './EditPage.js';
import DetailsPage from './DetailsPage';

export default class RolesPage extends AppContent {

  tableDiv = `${htmlElements.div}.RoleListTable`;
  tableCol = `${htmlElements.div}.col-xs-12`;
  table    = `${htmlElements.table}.RoleListTable__table`;
  pageCol  = `${htmlElements.div}.col-md-12`;
  pageLink = `${htmlElements.a}`;

  static openPage(button) {
    cy.rolesController().then(controller => controller.intercept({method: 'GET'}, 'rolesPageLoadingGET', '?page=1&pageSize=10'));
    cy.get(button).click();
    cy.wait('@rolesPageLoadingGET');
  }

  getRolesTable() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .children(this.tableDiv)
               .children(this.tableCol)
               .children(this.table);
  }

  getTableHeaders() {
    return this.getRolesTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getTableRows() {
    return this.getRolesTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableRow(code) {
    return this.getRolesTable()
               .find(`#${code}-actions`)
               .parents(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new RolesKebabMenu(this, code);
  }

  getTablePagination() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .children(this.tableDiv)
               .children(this.tableCol)
               .children(htmlElements.form);
  }

  getAddButton() {
    return this.getContents()
               .children(htmlElements.div).eq(3)
               .children(this.pageCol)
               .children(this.pageLink)
               .children(htmlElements.button);
  }

  openAddRolePage() {
    this.getAddButton().then(button => AddPage.openPage(button));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

}

class RolesKebabMenu extends KebabMenu {

  getDetails() {
    return this.get()
               .find(`${htmlElements.li}.RoleListMenuAction__menu-item-detail`);
  }

  getEdit() {
    return this.get()
               .find(`${htmlElements.li}.RoleListMenuAction__menu-item-edit`);
  }

  getDelete() {
    return this.get()
               .find(`${htmlElements.li}.RoleListMenuAction__menu-item-delete`);
  }

  openDetails() {
    this.getDetails().then(button => DetailsPage.openPage(button, this.code));
    return cy.wrap(new AppPage(DetailsPage)).as('currentPage');
  }

  openEdit() {
    this.getEdit().then(button => EditPage.openPage(button, this.code));
    return cy.wrap(new AppPage(EditPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().then(button => this.parent.click(button));
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}
