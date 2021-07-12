import {TEST_ID_KEY, htmlElements, WebElement} from "../../WebElement.js";

import Content from "../../app/Content.js";

import AppPage from "../../app/AppPage.js";

import AddPage from "./AddPage.js";

export default class RolesPage extends Content {

  tableDiv = `${htmlElements.div}[${TEST_ID_KEY}=list_RoleListTable_div]`;
  tableCol = `${htmlElements.div}[${TEST_ID_KEY}=list_RoleListTable_Col]`;
  table = `${htmlElements.table}[${TEST_ID_KEY}=RoleListTable__table]`;
  pageCol = `${htmlElements.div}[${TEST_ID_KEY}=list_ListRolePage_Col]`;
  pageLink = `${htmlElements.a}[${TEST_ID_KEY}=list_ListRolePage_Link]`;

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