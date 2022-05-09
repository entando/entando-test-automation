import {DATA_ID, htmlElements} from '../../WebElement.js';

import AppContent    from '../../app/AppContent.js';
import AppPage       from '../../app/AppPage.js';
import FragmentsPage from './FragmentsPage';
import KebabMenu     from '../../app/KebabMenu.js';
import DeleteDialog  from '../../app/DeleteDialog.js';
import DetailsPage   from '../../components/uxFragments/DetailsPage.js';
import Pagination    from '../../app/Pagination';

export default class UXFragmentsPage extends AppContent {

  searchForm      = `${htmlElements.form}.FragmentSearchForm`;
  searchCodeInput = `${htmlElements.input}#fragmentcode[name="code"]`;
  widgetFilter    = `${htmlElements.select}[name="widgetType"]`;
  pluginFilter    = `${htmlElements.select}[name="pluginCode"]`;
  addBtn          = `${htmlElements.button}[type=button].FragmentListContent__add`;
  spinner         = `${htmlElements.div}.spinner.spinner-md`;

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

  static openActionButton(button, code = null) {
    cy.fragmentsController().then(controller => controller.intercept({method: 'GET'}, 'actionsPageLoadingGET', `/${code}`));
    cy.get(button).click();
    cy.wait('@actionsPageLoadingGET');
  }

  static searchButton(button) {
    cy.fragmentsController().then(controller => controller.intercept({method: 'GET'}, 'resultsLoadingGET', '?sort*'));
    cy.get(button).click();
    cy.wait('@resultsLoadingGET');
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
    this.getSearchSubmitButton().then(button => UXFragmentsPage.searchButton(button));
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
    return new Pagination(this, UXFragmentsPage);
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

  openEdit(code) {
    this.getEdit().then(button => UXFragmentsPage.openActionButton(button, `${code}`));
    return cy.wrap(new AppPage(FragmentsPage)).as('currentPage');
  }

  openClone(code) {
    this.getClone()
        .then(button => UXFragmentsPage.openActionButton(button, `${code}`));
    return cy.wrap(new AppPage(FragmentsPage)).as('currentPage');
  }

  openDetails(code) {
    this.getDetails()
        .then(button => UXFragmentsPage.openActionButton(button, `${code}`));
    return cy.wrap(new AppPage(DetailsPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}
