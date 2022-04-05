import Content                     from '../../app/Content.js';
import {DATA_TESTID, htmlElements} from '../../WebElement.js';
import Pagination                  from '../../app/Pagination.js';


export default class VersioningPage extends Content {
  searchForm = `${htmlElements.form}[${DATA_TESTID}=versioning_VersioningSearchForm_form]`;
  searchDescInput = `${htmlElements.input}[name=description]`;

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
