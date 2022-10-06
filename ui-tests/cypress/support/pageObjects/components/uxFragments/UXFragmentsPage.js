import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import AppPage      from '../../app/AppPage.js';
import KebabMenu    from '../../app/KebabMenu.js';
import Pagination   from '../../app/Pagination';
import DeleteDialog from '../../app/DeleteDialog.js';

import FragmentsPage from './FragmentsPage';
import DetailsPage   from '../../components/uxFragments/DetailsPage.js';

export default class UXFragmentsPage extends AppContent {

  static openPage(button) {
    cy.fragmentsController().then(controller => controller.intercept({method: 'GET'}, 'fragmentsPageLoadingGET', '?*'));
    cy.widgetsController().then(controller => controller.intercept({method: 'GET'}, 'widgetsPageLoadingGET', '?*'));
    cy.get(button).click();
    cy.wait(['@fragmentsPageLoadingGET', '@fragmentsPageLoadingGET', '@widgetsPageLoadingGET']);
  }

  static goToPage(page) {
    cy.fragmentsController().then(controller => controller.intercept({method: 'GET'}, 'fragmentsPageLoadingGET', '?*'));
    cy.realType(`${page}{enter}`);
    cy.wait(['@fragmentsPageLoadingGET']);
  }

  static changePage(button) {
    cy.fragmentsController().then(controller => controller.intercept({method: 'GET'}, 'fragmentsPageLoadingGET', '?*'));
    cy.get(button).click();
    cy.wait(['@fragmentsPageLoadingGET']);
  }

  static searchButton(button) {
    cy.fragmentsController().then(controller => controller.intercept({method: 'GET'}, 'resultsLoadingGET', '?sort*'));
    cy.get(button).click();
    cy.wait('@resultsLoadingGET');
  }

  getSearchForm() {
    return this.get().find(`${htmlElements.form}.FragmentSearchForm`);
  }

  getSearchCodeInput() {
    return this.getSearchForm().find(`${htmlElements.input}#fragmentcode[name="code"]`);
  }

  getWidgetFilter() {
    return this.getSearchForm().find(`${htmlElements.select}[name="widgetType"]`);
  }

  getPluginFilter() {
    return this.getSearchForm().find(`${htmlElements.select}[name="pluginCode"]`);
  }

  getSearchSubmitButton() {
    return this.getSearchForm().find(`${htmlElements.button}[type=submit]`);
  }

  clickSearchSubmitButton() {
    this.getSearchSubmitButton().then(button => UXFragmentsPage.searchButton(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

  getTable() {
    return this.get().find(`${htmlElements.table}.FragmentListTable__table`);
  }

  getTableHeaders() {
    return this.getTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr)
               .find(htmlElements.th);
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

  getPagination() {
    return new Pagination(this, UXFragmentsPage);
  }

  getAddButton() {
    return this.get().find(`${htmlElements.button}[type=button].FragmentListContent__add`);
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

  // FIXME/TODO cypress keeps highlighting the element as detached;
  //  it might be due to the fact app-builder "sometimes" refresh the page to perform additional API calls
  open() {
    cy.wait(500);
    this.get().children(htmlElements.button).then(button => cy.get(button).click());
    return this;
  }

  getEdit() {
    return this.getDropdown()
               .children(`${htmlElements.li}.FragmentListMenuAction__menu-item-edit`);
  }

  getClone() {
    return this.getDropdown()
               .children(`${htmlElements.li}.FragmentListMenuAction__menu-item-clone`);
  }

  getDetails() {
    return this.getDropdown()
               .children(`${htmlElements.li}.FragmentListMenuAction__menu-item-details`);
  }

  getDelete() {
    return this.getDropdown()
               .children(`${htmlElements.li}.FragmentListMenuAction__menu-item-delete`);
  }

  openEdit(code) {
    this.getEdit().then(button => FragmentsPage.openPage(button, code));
    return cy.wrap(new AppPage(FragmentsPage)).as('currentPage');
  }

  openClone(code) {
    this.getClone().then(button => FragmentsPage.openPage(button, code));
    //FIXME / TODO the GUI code filed is not populated on load causing a refresh of the page
    cy.wait(1000);
    return cy.wrap(new AppPage(FragmentsPage)).as('currentPage');
  }

  openDetails(code) {
    this.getDetails().then(button => DetailsPage.openPage(button, code));
    return cy.wrap(new AppPage(DetailsPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}
