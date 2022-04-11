import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import {DialogContent} from '../../app/Dialog.js';

export default class ReportPage extends AppContent {

  descriptionList    = `${htmlElements.dl}.dl-horizontal`;
  componentTable     = `${htmlElements.table}.ReportDatabaseListTable__table`;
  dataSourceTables   = `${htmlElements.table}.ReportDatabaseDataSource__table`;
  dataSourceCollapse = `${htmlElements.a}[role=button]`;

  getDescriptionList() {
    return this.getContents().find(this.descriptionList);
  }

  getDescriptionDataTitles() {
    return this.getDescriptionList().children(htmlElements.dt);
  }

  getComponentTable() {
    return this.getContents().find(this.componentTable);
  }

  getDataSourceTables() {
    return this.getContents().find(this.dataSourceTables);
  }

  openDataSource() {
    this.getContents().find(this.dataSourceCollapse).click();
  }

  getDataSourcePortTableHeaders() {
    return this.getDataSourceTables().eq(0)
               .children(htmlElements.thead)
               .find(htmlElements.th);
  }

  getDataSourcePortTableRowByIndex(index) {
    return this.getDataSourceTables().eq(0)
               .children(htmlElements.tbody)
               .children(htmlElements.tr).eq(index)
               .children(htmlElements.td);
  }

  getDataSourceServTableHeaders() {
    return this.getDataSourceTables().eq(1)
               .children(htmlElements.thead)
               .find(htmlElements.th);
  }

  getDataSourceServTableRowByIndex(index) {
    return this.getDataSourceTables().eq(1)
               .children(htmlElements.tbody)
               .children(htmlElements.tr).eq(index)
               .children(htmlElements.td);
  }

  openSQLQueryFromDataSourcePortByIndex(index) {
    this.getDataSourcePortTableRowByIndex(index).eq(0).children(htmlElements.a).click();
    this.parent.getDialog().setBody(DialogContent);
  }

  openSQLQueryFromDataSourceServByIndex(index) {
    this.getDataSourceServTableRowByIndex(index).eq(0).children(htmlElements.a).click();
    this.parent.getDialog().setBody(DialogContent);
  }

}
