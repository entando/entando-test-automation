import {DATA_TESTID, DATA_ID, htmlElements, WebElement} from "../../WebElement.js";

import Content from "../../app/Content.js";

import AppPage from "../../app/AppPage.js";

import AddPage from "./AddPage.js";
import EditPage from "./EditPage.js";
import DetailsPage from "./DetailsPage";

export default class RolesPage extends Content {

  tableDiv = `${htmlElements.div}[${DATA_TESTID}=list_RoleListTable_div]`;
  tableCol = `${htmlElements.div}[${DATA_TESTID}=list_RoleListTable_Col]`;
  table = `${htmlElements.table}[${DATA_TESTID}=RoleListTable__table]`;
  pageCol = `${htmlElements.div}[${DATA_TESTID}=list_ListRolePage_Col]`;
  pageLink = `${htmlElements.a}[${DATA_TESTID}=list_ListRolePage_Link]`;

  getRolesTable() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .children(this.tableDiv)
               .children(this.tableCol)
               .children(this.table);
  }

  getTableRows() {
    return this.getRolesTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new KebabMenu(this, code);
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
    return new AppPage(AddPage);
  }

}

class KebabMenu extends WebElement {

  constructor(parent, code) {
    super(parent);
    this.code = code;
  }

  get() {
    return this.parent.getTableRows()
        .find(`${htmlElements.td}[${DATA_TESTID}=${this.code}-actions]`)
        .children(htmlElements.div);
  }

  getDetails() {
    return this.get()
               .find(`[${DATA_ID}=detail-${this.code}]`)
  }

  getEdit() {
    return this.get()
               .find(`[${DATA_ID}=edit-${this.code}]`)
  }

  getDelete() {
    return this.get()
               .find(`[${DATA_TESTID}=RoleListMenuAction__menu-item-delete]`)
  }

  open() {
    this.get()
        .children(htmlElements.button)
        .click();
    return this;
  }

  openDetails() {
    this.getDetails().click();
    return new AppPage(DetailsPage);
  }

  openEdit() {
    this.getEdit().click();
    return new AppPage(EditPage);
  }

  clickDelete() {
    this.getDelete().click();
  }

}