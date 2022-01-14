import {DATA_TESTID, htmlElements} from '../../WebElement.js';

import Content from '../../app/Content.js';

import AppPage from '../../app/AppPage.js';

import PagesKebabMenu from './PagesKebabMenu';

import AddPage          from './AddPage.js';
import SearchResultPage from './SearchResultPage';
import DeleteDialog     from '../../app/DeleteDialog';

export default class ManagementPage extends Content {

  searchForm   = `${htmlElements.form}[${DATA_TESTID}=list_PageSearchForm_form]`;
  searchOption = `${htmlElements.button}[${DATA_TESTID}=list_PageSearchForm_DropdownButton]`;
  searchInput  = `${htmlElements.input}[${DATA_TESTID}=list_PageSearchForm_Field]`;
  searchButton = `${htmlElements.button}[${DATA_TESTID}=list_PageSearchForm_Button]`;

  tableContainer = `${htmlElements.div}.DDTable`;
  expandAll      = `${htmlElements.div}.PageTree__toggler--expand`;
  expandNode     = `[${DATA_TESTID}=tree-node_TreeNodeExpandedIcon_i]`;

  addButton = `${htmlElements.button}.app-tour-step-5`;

  getSearchForm() {
    return this.getContents()
               .find(this.searchForm);
  }

  getSearchOption() {
    return this.getSearchForm()
               .find(this.searchOption);
  }

  getSearchInput() {
    return this.getSearchForm()
               .find(this.searchInput);
  }

  getSearchButton() {
    return this.getSearchForm()
               .find(this.searchButton);
  }

  getTableContainer() {
    return this.get()
               .find(this.tableContainer)
               .children(htmlElements.table);
  }

  getExpandAll() {
    return this.getTableContainer()
               .children(htmlElements.thead)
               .find(this.expandAll);
  }

  getTableRows() {
    return this.getTableContainer()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableRow(code) {
    return this.getKebabMenu(code)
               .get()
               .parents(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new PagesKebabMenu(this, code);
  }

  getAddButton() {
    return this.get()
               .find(this.addButton);
  }

  selectSearchOption(optionOrder) {
    this.getSearchOption().click();
    this.getSearchOption()
        .siblings(htmlElements.ul)
        .children(htmlElements.li).eq(optionOrder)
        .click();
  }

  typeSearch(value) {
    this.getSearchInput().type(value);
  }

  clickSearchButton() {
    this.getSearchButton().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(SearchResultPage);
  }

  clickExpandAll() {
    this.getExpandAll()
        .click();
  }

  toggleRowSubPages(code) {
    this.getTableRow(code)
        .find(this.expandNode)
        .click();
    cy.wait(1000); //TODO find a better way to identify when the page list is expanded
  }

  dragRow(source, target, pos = 'top') {
    this.getTableRow(target).then(row => {
      this.getTableRow(source)
          .children(htmlElements.td).eq(0)
          .children(htmlElements.button)
          .drag(row, {force: true, position: pos});
      this.parent.getDialog().setBody(DeleteDialog); //TODO validate for what else this dialog is used and rename it accordingly
    });
  }

  openAddPagePage() {
    this.getAddButton().click();
    return new AppPage(AddPage);
  }

}
