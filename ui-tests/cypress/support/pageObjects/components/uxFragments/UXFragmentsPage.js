import {DATA_ID, htmlElements} from '../../WebElement.js';

import AppContent    from '../../app/AppContent.js';
import AppPage       from '../../app/AppPage.js';
import FragmentsPage from './FragmentsPage';
import KebabMenu     from '../../app/KebabMenu.js';
import DeleteDialog  from '../../app/DeleteDialog.js';
import DetailsPage   from '../../components/uxFragments/DetailsPage.js';
import Pagination from "../../app/Pagination";

export default class UXFragmentsPage extends AppContent {

  searchForm                 = `${htmlElements.form}.FragmentSearchForm`;
  searchCodeInput            = `${htmlElements.input}#fragmentcode[name="code"]`;
  widgetFilter               = `${htmlElements.select}[name="widgetType"]`;
  pluginFilter               = `${htmlElements.select}[name="pluginCode"]`;
  addBtn                     = `${htmlElements.button}[type=button].FragmentListContent__add`;
  spinner                    = `${htmlElements.div}.spinner.spinner-md`;

  static openPage(button) {
    cy.fragmentsController().then(controller => controller.intercept({method: 'GET'}, 'fragmentsPageLoadingGET', '?*'));
    cy.get(button).click();
    cy.wait(['@fragmentsPageLoadingGET']);
  }

  getSearchForm() {
    return this.get()
               .find(this.searchForm);
  }

  getSearchCodeInput() {
    return this.getSearchForm()
               .find(this.searchCodeInput);
  }

  getWidgetFilter() {
    return this.getSearchForm()
               .find(this.widgetFilter);
  }

  getPluginFilter() {
    return this.getSearchForm()
               .find(this.pluginFilter);
  }

  getSearchSubmitButton() {
    return this.getSearchForm()
               .find(`${htmlElements.button}[type=submit]`);
  }

  clickSearchSubmitButton() {
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

  getTableRow(code) {
    return this.getTableRows()
               .find(`${htmlElements.button}#${code}-actions`)
               .closest(htmlElements.tr);
  }

  getTableHeaders() {
    return this.getTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr)
               .find(htmlElements.th);
  }

  getPagination() {
    return new Pagination(this);
  }

  navigateToNextPage() {
    this.getPagination().getNextButton().then(button => UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }


  navigateToPreviousPage() {
    this.getPagination().getPreviousButton().then(button => UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

  navigateToFirstPage() {
    this.getPagination().getFirstPageButton().then(button => UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

  navigateToLastPage() {
    this.getPagination().getLastPageButton().then(button => UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');

  }

  getAddButton() {
    return this.get()
               .find(this.addBtn);
  }

  getKebabMenu(code) {
    return new FragmentsKebabMenu(this, code);
  }

  openAddFragmentPage() {
    this.getAddButton().click();
    return cy.wrap(new AppPage(FragmentsPage)).as('currentPage');
  }
}

class FragmentsKebabMenu extends KebabMenu {


  getDropdown() {
    return this.get().find(`${htmlElements.ul}[role="menu"]`);
  }

  getEdit() {
    return this.get()
               .find(`[${DATA_ID}=edit-${this.code}]`)
               .eq(0);
  }

  getClone() {
    return this.get()
               .find(`[${DATA_ID}=clone-${this.code}]`);
  }

  getDetails() {
    return this.get()
               .find(`.FragmentListMenuAction__menu-item-details`);

  }

  getDelete() {
    return this.get()
               .find(`.FragmentListMenuAction__menu-item-delete`);
  }

  openEdit() {
    this.getEdit().click();
    return cy.wrap(new AppPage(FragmentsPage)).as('currentPage');
  }

  openClone() {
    this.getClone().click();
    return cy.wrap(new AppPage(FragmentsPage)).as('currentPage');
  }

  openDetails() {
    this.getDetails().click();
    return cy.wrap(new AppPage(DetailsPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}
