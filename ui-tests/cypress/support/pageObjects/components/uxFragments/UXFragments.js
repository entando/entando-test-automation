import Content from '../../app/Content.js';
import { DATA_TESTID, htmlElements } from '../../WebElement.js';
import Pagination from '../../app/Pagination.js';

export default class UXFragmentsPage extends Content {
  searchForm       = `${htmlElements.form}.FragmentSearchForm[${DATA_TESTID}=list_FragmentSearchForm_form]`;
  searchCodeInput  = `${htmlElements.input}#fragmentcode[name="code"]`;

  getSearchForm() {
    return this.get()
        .find(this.searchForm);
  }

  getSearchCodeInput() {
    return this.getSearchForm()
        .find(this.searchCodeInput);
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
