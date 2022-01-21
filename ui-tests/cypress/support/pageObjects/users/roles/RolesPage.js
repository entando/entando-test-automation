import {DATA_TESTID, DATA_ID, htmlElements} from '../../WebElement.js';

import Content   from '../../app/Content.js';
import KebabMenu from '../../app/KebabMenu';

import AppPage      from '../../app/AppPage.js';
import DeleteDialog from '../../app/DeleteDialog';

import AddPage     from './AddPage.js';
import EditPage    from './EditPage.js';
import DetailsPage from './DetailsPage';

export default class RolesPage extends Content {

  tableDiv = `${htmlElements.div}.RoleListTable`;
  tableCol = `${htmlElements.div}.col-xs-12`;
  table    = `${htmlElements.table}.RoleListTable__table`;
  pageCol  = `${htmlElements.div}.col-md-12`;
  pageLink = `${htmlElements.a}`;

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
    this.getAddButton().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(AddPage);
  }

}

class RolesKebabMenu extends KebabMenu {

  getDetails() {
    return this.get()
              .find(`${htmlElements.button}#${this.code}-actions`)
              .click()
              .parent(htmlElements.div)
              .children(htmlElements.ul)
              .children(`${htmlElements.li}.RoleListMenuAction__menu-item-detail`)
              .find(htmlElements.a);
  }

  getEdit() {
    return this.get() 
              .find(`${htmlElements.button}#${this.code}-actions`)
              .click()
              .parent(htmlElements.div)
              .children(htmlElements.ul)
              .children(`${htmlElements.li}.RoleListMenuAction__menu-item-edit`)
              .find(htmlElements.a);
  }

  getDelete() {
    return this.get()
              
              .find(`${htmlElements.li}.RoleListMenuAction__menu-item-delete`)

  }

  openDetails() {
    this.getDetails().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(DetailsPage);
  }

  openEdit() {
    this.getEdit().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(EditPage);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }
  clickDeleteRole() {
   this.get()
              .find(`${htmlElements.button}#${this.code}-actions`)
              .click()
              .parent(htmlElements.div)
              .find(`${htmlElements.li}.RoleListMenuAction__menu-item-delete`)
              .click()
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
