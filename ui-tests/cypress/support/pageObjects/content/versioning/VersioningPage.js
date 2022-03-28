import Content from '../../app/Content.js';
import {htmlElements } from '../../WebElement.js';
import Pagination from '../../app/Pagination.js';

export default class VersioningPage extends Content {
  
  searchForm = `${htmlElements.form}[id="search"]`;
  searchDescInput = `${htmlElements.input}.form-control`;

  getSearchForm() {
    return this.get()
               .find(this.searchForm);
  }

  getSearchDescInput() {
    return this.getSearchForm()
               .find(this.searchDescInput);
  }

  getSearchSubmitButton() {
    return this.getSearchForm()
               .find(`${htmlElements.button}[type=submit]`);
  }

  getTable() {
    return this.get()
               .find(htmlElements.table);
  }

  getTableRows() {
    return this.getTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getPagination() {
    return new Pagination(this);
  }
}
