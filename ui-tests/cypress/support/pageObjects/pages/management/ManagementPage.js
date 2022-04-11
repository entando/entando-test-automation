import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import PagesKebabMenu from './PagesKebabMenu';

import AddPage          from './AddPage.js';
import SearchResultPage from './SearchResultPage';
import DeleteDialog     from '../../app/DeleteDialog';

export default class ManagementPage extends AppContent {

  searchForm   = `${htmlElements.form}.PageSearchForm`;
  searchOption = `${htmlElements.button}.PageSearchForm__filter-searchby-dropdown`;
  searchInput  = `${htmlElements.input}[id=pagecode]`;
  searchButton = `${htmlElements.button}[type="submit"]`;

  tableContainer = `${htmlElements.div}.DDTable`;
  expandAll      = `${htmlElements.div}.PageTree__toggler--expand`;
  expandNode     = `${htmlElements.span}.PageTree__icons-label`;
  dragHandle     = `${htmlElements.button}.PageTree__drag-handle`;

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

  getTableRow(pageTitle) {
    return this.getTableRows()
               .contains(htmlElements.tr, pageTitle);
  }

  getKebabMenu(pageTitle) {
    return new PagesKebabMenu(this, pageTitle);
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
    return new AppPage(SearchResultPage);
  }

  clickExpandAll() {
    this.getExpandAll()
        .click();
  }

  toggleRowSubPages(pageTitle) {
    this.getTableRow(pageTitle)
        .find(this.expandNode)
        .click();
  }

  dragRow(source, target, pos = 'top') {
    this.getTableRow(target).then(row => {
      this.getTableRow(source)
          .children(htmlElements.td).eq(0)
          .children(this.dragHandle)
          .drag(row, {force: true, position: pos});
      this.parent.getDialog().setBody(DeleteDialog); //TODO validate for what else this dialog is used and rename it accordingly
    });
  }

  openAddPagePage() {
    this.getAddButton().click();
    return new AppPage(AddPage);
  }

}
