import {htmlElements} from '../../WebElement.js';

import Content   from '../../app/Content.js';
import KebabMenu from '../../app/KebabMenu';

import AppPage      from '../../app/AppPage.js';
import DeleteDialog from '../../app/DeleteDialog';

import AddPage     from './AddPage.js';
import EditPage    from './EditPage.js';
import DetailsPage from './DetailsPage';

export default class GroupsPage extends Content {

  tableDiv = `${htmlElements.div}.list_GroupListTable_div`;
  tableCol = `${htmlElements.div}.list_GroupListTable_Col`;
  table    = `${htmlElements.table}.GroupListTable__table`;
  pageCol  = `${htmlElements.div}.col-md-12`;
  pageLink = `${htmlElements.a}`;

  getGroupsTable() {
    return this.getContents()
               .find(this.table);
  }

  getTableHeaders() {
    return this.getGroupsTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getTableRows() {
    return this.getGroupsTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableRow(code) {
    return this.getGroupsTable()
               .find(`#${code}-actions`)
               .parents(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new GroupsKebabMenu(this, code);
  }

  getTablePagination() {
    return this.getContents()
               .children(htmlElements.div).eq(3)
               .children(this.tableDiv)
               .children(this.tableCol)
               .children(htmlElements.form);
  }

  getAddButton() {
    return this.getContents()
               .children(htmlElements.div).eq(4)
               .children(this.pageCol)
               .children(this.pageLink)
               .children(htmlElements.button);
  }

  openAddGroupPage() {
    this.getAddButton().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(AddPage);
  }

}

class GroupsKebabMenu extends KebabMenu {

  getDetails() {
    return this.get()
               .find(`${htmlElements.li}.GroupListMenuAction__menu-item-detail`);
  }

  getEdit() {
    return this.get()
               .find(`${htmlElements.li}.GroupListMenuAction__menu-item-edit`);
  }

  getDelete() {
    return this.get()
               .find(`${htmlElements.li}.GroupListMenuAction__menu-item-delete`);
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

}
