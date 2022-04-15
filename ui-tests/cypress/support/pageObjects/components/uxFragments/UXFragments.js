import {DATA_ID, htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';
import AppPage      from '../../app/AppPage.js';
import AddPage      from './AddPage';
import KebabMenu    from '../../app/KebabMenu.js';
import DeleteDialog from '../../app/DeleteDialog.js';
import DetailsPage from '../../components/uxFragments/DetailsPage.js';

export default class UXFragmentsPage extends AppContent {

  searchForm                 = `${htmlElements.form}.FragmentSearchForm`;
  searchCodeInput            = `${htmlElements.input}#fragmentcode[name="code"]`;
  addBtn                     = `${htmlElements.button}[type=button].FragmentListContent__add`;
  spinner                    = `${htmlElements.div}.spinner.spinner-md`;
  paginationForm             = `${htmlElements.form}.content-view-pf-pagination`;
  paginationFormPageSelector = `${htmlElements.input}[type=text].pagination-pf-page`;

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

  clickSearchSubmitButton(){
    this.getSearchSubmitButton().click();
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
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

  getTableRow(code){
    return this.getTableRows()
        .find(`${htmlElements.button}#${code}-actions`)
        .closest(htmlElements.tr);
  }

  getTableHeaders(){
    return this.getTable()
        .children(htmlElements.thead)
        .children(htmlElements.tr)
        .find(htmlElements.th);
  }

  getPagination() {
    return this.get()
        .find(this.paginationForm);
  }

  getPaginationSelector(){
    return this.getPagination()
        .find(this.paginationFormPageSelector);

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
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }
}

class FragmentsKebabMenu extends KebabMenu {

  get() {
    return this.parent.getTableRows()
               .find(`#${this.code}-actions`)
               .closest(htmlElements.div);
  }

  getDropdown() {
    return this.get().find(`${htmlElements.ul}[role="menu"]`);
  }

  getEdit() {
    return this.get()
               .find(`[${DATA_ID}=edit-${this.code}]`)
               .eq(0);
  }

  getClone(){
    return this.get()
        .find(`[${DATA_ID}=clone-${this.code}]`);
  }

  getDetails(){
    return this.get()
        .find(`.FragmentListMenuAction__menu-item-details`);

  }

  getDelete() {
    return this.get()
               .find(`.FragmentListMenuAction__menu-item-delete`);
  }

  openEdit() {
    this.getEdit().click();
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

  openClone(){
    this.getClone().click();
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

  openDetails(){
    this.getDetails().click();
    return cy.wrap(new AppPage(DetailsPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}
