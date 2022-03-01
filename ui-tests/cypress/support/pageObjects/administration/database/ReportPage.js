import Content from '../../app/Content.js';
import {DialogContent} from '../../app/Dialog.js';
import {htmlElements} from '../../WebElement.js';

export default class ReportPage extends Content {

  descriptionList = `${htmlElements.dl}.dl-horizontal`
  componentTable = `${htmlElements.table}.ReportDatabaseListTable__table`
  dataSourceTables = `${htmlElements.table}.ReportDatabaseDataSource__table`;
  dataSourceCollapse = `${htmlElements.a}[role=button]`;

  getDescriptionList() {
    return this.getContents().find(this.descriptionList);
  }

  getDescriptionData() {
    return this.getDescriptionList().children();
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

  getDataSourcePortTableRowByIndex(index) {
    return this.getDataSourceTables().eq(0)
      .children(htmlElements.tbody)
      .children(htmlElements.tr).eq(index)
      .children(htmlElements.td);
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
