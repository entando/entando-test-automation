import {htmlElements} from '../../WebElement.js';

import Content from '../../app/Content.js';

import AppPage from '../../app/AppPage.js';

import PagesKebabMenu from './PagesKebabMenu';

import AddPage from './AddPage.js';

export default class SearchResultPage extends Content {

  searchForm   = `${htmlElements.form}.list_PageSearchForm_form`;
  searchOption = `${htmlElements.button}.list_PageSearchForm_DropdownButton`;
  searchInput  = `${htmlElements.input}.list_PageSearchForm_Field`;
  searchButton = `${htmlElements.button}.list_PageSearchForm_Button]`;

  tableContainer = `${htmlElements.div}.PageListSearchTable `;

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
               .find(htmlElements.table);
  }

  getTableRows() {
    return this.getTableContainer()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableRow(code) {
    return this.getTableContainer()
               .find(`#${code}-actions`)
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

  openAddPagePage() {
    this.getAddButton().click();
    return new AppPage(AddPage);
  }

}
