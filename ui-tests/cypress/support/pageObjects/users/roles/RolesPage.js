import {DATA_TESTID, htmlElements, WebElement} from "../../WebElement.js";

import Content from "../../app/Content.js";

import AppPage from "../../app/AppPage.js";

import AddPage from "./AddPage.js";

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