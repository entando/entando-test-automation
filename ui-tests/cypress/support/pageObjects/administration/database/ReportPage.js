import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import {DialogContent} from '../../app/Dialog.js';

export default class ReportPage extends AppContent {

  descriptionList = `${htmlElements.dl}.dl-horizontal`;
  componentTable  = `${htmlElements.table}.ReportDatabaseListTable__table`;

  dataSourceCollapse = `${htmlElements.div}#accordion-details`;
  dataSourceTables   = `${htmlElements.table}.ReportDatabaseDataSource__table`;

  static openPage(button, code) {
    cy.databaseController().then(controller => controller.intercept({method: 'GET'}, 'reportPageLoadingGET', `/report/${code}`));
    cy.get(button).click();
    cy.wait('@reportPageLoadingGET');
  }

  getDescriptionList() {
    return this.getContents().find(this.descriptionList);
  }

  getDescriptionDataTitles() {
    return this.getDescriptionList().children(htmlElements.dt);
  }

  getComponentTable() {
    return this.getContents().find(this.componentTable);
  }

  getDataSourceCollapse() {
    return this.getContents().find(this.dataSourceCollapse);
  }

  getDataSourceTables() {
    return this.getContents().find(this.dataSourceTables);
  }

  getDataSourcePortTable() {
    return this.getDataSourceTables().eq(0);
  }

  getDataSourcePortTableHeaders() {
    return this.getDataSourcePortTable()
               .children(htmlElements.thead)
               .find(htmlElements.tr);
  }

  getDataSourcePortTableRowByIndex(index) {
    return this.getDataSourcePortTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr).eq(index);
  }

  getDataSourceServTable() {
    return this.getDataSourceTables().eq(1);
  }

  getDataSourceServTableHeaders() {
    return this.getDataSourceServTable()
               .children(htmlElements.thead)
               .find(htmlElements.tr);
  }

  getDataSourceServTableRowByIndex(index) {
    return this.getDataSourceServTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr).eq(index);
  }

  openDataSource() {
    this.getDataSourceCollapse().click();
    return cy.get('@currentPage');
  }

  openSQLQueryFromDataSourcePortTableByIndex(index) {
    this.getDataSourcePortTableRowByIndex(index)
        .children(htmlElements.td).eq(0)
        .children(htmlElements.a).click();
    this.parent.getDialog().setBody(DialogContent);
    return cy.get('@currentPage');
  }

  openSQLQueryFromDataSourceServTableByIndex(index) {
    this.getDataSourceServTableRowByIndex(index)
        .children(htmlElements.td).eq(0)
        .children(htmlElements.a).click();
    this.parent.getDialog().setBody(DialogContent);
    return cy.get('@currentPage');
  }

}
