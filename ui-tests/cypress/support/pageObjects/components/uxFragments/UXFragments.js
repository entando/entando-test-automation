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
  currentPageRange           = `${htmlElements.span}.pagination-pf-items-current`;

  static openPage(button) {
    cy.fragmentsController().then(controller => controller.intercept({method: 'GET'}, 'fragmentsPageLoadingGET', "?*" ));
    cy.get(button).click();
    cy.wait('@fragmentsPageLoadingGET');
  }


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
  getDisplayedFragments(){
    return this
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
  getNextPage(){
    return this.getPagination()
        .find(`${htmlElements.a}[title="Next page"]`);
  }
  navigateToNextPage(){
    this.getNextPage().then(button =>UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

  getCurrentPageRange() {
    return this.getPagination()
        .find(this.currentPageRange);
  }
  getPreviousPage(){
    return this.getPagination()
        .find(`${htmlElements.a}[title="Previous page"]`).should('be.visible');
  }
  navigateToPreviousPage(){
    this.getPreviousPage().then(button =>UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

  getFirstPage(){
    return this.getPagination()
        .find(`${htmlElements.a}[title="First page"]`).should('exist');

  }
  navigateToFirstPage(){
    this.getFirstPage().then(button =>UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }
  getLastPage(){
    return this.getPagination()
        .find(`${htmlElements.a}[title="Last page"]`).should('exist')
  }
  navigateToLastPage(){
    this.getLastPage().then(button => UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');

  }


  getPaginationRowDropdown(){
    return this.getPagination()
        .find(`${htmlElements.button}#pagination-row-dropdown`);
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
    this.getAddButton().then(button => AddPage.openPage(button));
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
    this.getEdit().then(button => AddPage.openPage(button));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

  openClone(){
    this.getClone().then(button => AddPage.openPage(button));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

  openDetails(){
    this.getDetails().then(button => DetailsPage.openPage(button));
    return cy.wrap(new AppPage(DetailsPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}
