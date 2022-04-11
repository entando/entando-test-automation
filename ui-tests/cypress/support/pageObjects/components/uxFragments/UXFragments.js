import AppContent from '../../app/AppContent.js';
import { DATA_ID, htmlElements } from '../../WebElement.js';
import Pagination from '../../app/Pagination.js';
import AppPage from '../../app/AppPage.js';
import AddPage from './AddPage';
import KebabMenu from '../../app/KebabMenu.js';
import DeleteDialog from '../../app/DeleteDialog.js';

export default class UXFragmentsPage extends AppContent {

  searchForm       = `${htmlElements.form}.FragmentSearchForm`;
  searchCodeInput  = `${htmlElements.input}#fragmentcode[name="code"]`;
  addBtn           = `${htmlElements.button}[type=button].FragmentListContent__add`;
  spinner          = `${htmlElements.div}.spinner.spinner-md`;

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

  getAddButton() {
    return this.get()
               .find(this.addBtn);
  }

  getSpinner() {
    return this.get()
               .find(this.spinner);
  }

  getKebabMenu(code) {
    return new FragmentsKebabMenu(this, code);
  }

  openAddFragmentPage() {
    this.getAddButton().click();
    return new AppPage(AddPage);
  }
}

class FragmentsKebabMenu extends KebabMenu {

  get() {
    return this.parent.getTableRows()
               .find(`#${this.code}-actions`)
               .closest(htmlElements.div);
  }

  getEdit() {
    return this.get()
               .find(`[${DATA_ID}=edit-${this.code}]`)
               .eq(0);
  }

  getDelete() {
    return this.get()
               .find(`.FragmentListMenuAction__menu-item-delete`);
  }

  openEdit() {
    this.getEdit().click();
    return new AppPage(AddPage);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
