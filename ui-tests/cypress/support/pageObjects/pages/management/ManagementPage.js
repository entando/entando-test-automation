import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import AddPage      from './AddPage.js';
import DeleteDialog from '../../app/DeleteDialog';
import KebabMenu    from '../../app/KebabMenu';
import ClonePage    from './ClonePage';
import DesignerPage from '../designer/DesignerPage';

export default class ManagementPage extends AppContent {

  static openPage(button) {
    cy.languagesController().then(controller => controller.intercept({method: 'GET'}, 'languagesPageLoadingGET', '?*'));
    cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'homepagePageLoadingGET', '/homepage?status=draft'));
    cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'homepageChildrenPageLoadingGET', '?parentCode=homepage'));
    cy.get(button).click();
    cy.wait(['@languagesPageLoadingGET', '@homepagePageLoadingGET', '@homepageChildrenPageLoadingGET']);
  }

  static searchPage(button, searchType, value) {
    if (searchType === 'code') cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'searchPageLoadingGET', `/search?sort=code&direction=ASC&pageCodeToken=${value}&page=1&pageSize=100`));
    else if (searchType === 'name') cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'searchPageLoadingGET', `/search?sort=code&direction=ASC&title=${value.replace(' ', '+')}&page=1&pageSize=100`));
    else throw new Error('Specify a valid search type!');
    cy.get(button).click();
    cy.wait('@searchPageLoadingGET');
  }

  reloadPage() {
    cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'homepageChildrenPageLoadingGET', '?parentCode=homepage'));
    cy.reload();
    cy.wait('@homepageChildrenPageLoadingGET');
    return cy.get('@currentPage');
  }

  getSearchForm() {
    return this.getContents().find(`${htmlElements.form}.PageSearchForm`);
  }

  getSearchOption() {
    return this.getSearchForm().find(`${htmlElements.button}.PageSearchForm__filter-searchby-dropdown`);
  }

  getSearchInput() {
    return this.getSearchForm().find(`${htmlElements.input}[id=pagecode]`);
  }

  getSearchButton() {
    return this.getSearchForm().find(`${htmlElements.button}[type="submit"]`);
  }

  getTableContainer() {
    return this.get().find(`${htmlElements.div}.DDTable`).children(htmlElements.table);
  }

  getTableRows() {
    return this.getTableContainer().children(htmlElements.tbody).children(htmlElements.tr);
  }

  getTableRow(pageTitle) {
    return this.getTableRows().contains(htmlElements.tr, pageTitle);
  }

  getKebabMenu(pageTitle) {
    return new PagesKebabMenu(this, pageTitle);
  }

  getSearchTable() {
    return this.get().find(`${htmlElements.div}.PageListSearchTable `).find(htmlElements.table);
  }

  getSearchTableRows() {
    return this.getSearchTable().children(htmlElements.tbody).children(htmlElements.tr);
  }

  getAddButton() {
    return this.get().find(`${htmlElements.button}.app-tour-step-5`);
  }

  selectSearchOption(optionOrder) {
    this.getSearchOption().click();
    this.getSearchOption()
        .siblings(htmlElements.ul)
        .children(htmlElements.li).eq(optionOrder)
        .click();
    return cy.get('@currentPage');
  }

  clickSearchButton(searchType, value) {
    this.getSearchButton().then(button => ManagementPage.searchPage(button, searchType, value));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

  toggleRowSubPages(pageTitle) {
    this.getTableRow(pageTitle)
        .find(`${htmlElements.span}.PageTree__icons-label`)
        .click();
    cy.waitForStableDOM();
    return cy.get('@currentPage');
  }

  getPageNameFromIndex(index) {
    return this.getTableRows().eq(index).find(`${htmlElements.span}.PageTree__page-name`);
  }

  dragRow(source, target, pos = 'top') {
    this.getTableRow(target).then(row => {
      this.getTableRow(source)
          .children(htmlElements.td).eq(0)
          .children(`${htmlElements.button}.PageTree__drag-handle`)
          .drag(row, {force: true, position: pos});
      this.parent.getDialog().setBody(DeleteDialog); //TODO validate for what else this dialog is used and rename it accordingly
    });
    return cy.get('@currentPage');
  }

  openAddPagePage() {
    this.getAddButton().then(button => AddPage.openPage(button));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

}

class PagesKebabMenu extends KebabMenu {

  get() {
    return this.parent.getTableRow(this.code)
               .find(`${htmlElements.div}[role="none"]`)
               .children(htmlElements.div);
  }

  open() {
    this.get()
        .children(`${htmlElements.button}[id="WidgetListRow-dropown"]`)
        .click();
    return this;
  }

  getAdd() {
    return this.get().find('.PageTreeActionMenuButton__menu-item-add');
  }

  getEdit() {
    return this.get().find('.PageTreeActionMenuButton__menu-item-edit');
  }

  getDesign() {
    return this.get().find('.PageTreeActionMenuButton__menu-item-configure');
  }

  getClone() {
    return this.get().find('.PageTreeActionMenuButton__menu-item-clone');
  }

  getPublish() {
    return this.get().find('.PageTreeActionMenuButton__menu-item-publish');
  }

  getUnpublish() {
    return this.get().find('.PageTreeActionMenuButton__menu-item-unpublish');
  }

  getDetails() {
    return this.get().find('.PageTreeActionMenuButton__menu-item-details');
  }

  getDelete() {
    return this.get().find('.PageTreeActionMenuButton__menu-item-delete');
  }

  getPreview() {
    return this.get().find('.PageTreeActionMenuButton__menu-item-preview');
  }

  getViewPublishedPage() {
    return this.get().find('.PageTreeActionMenuButton__menu-item-viewPublishedPage');
  }


  openAdd() {
    this.getAdd().then(button => AddPage.openPage(button));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

  openEdit(code) {
    this.getEdit().then(button => AddPage.openPage(button, code));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

  openDesigner(code) {
    this.getDesign().then(button => DesignerPage.openPage(button, code));
    return cy.wrap(new AppPage(DesignerPage)).as('currentPage');
  }

  clickClone(code) {
    this.getClone().then(button => ClonePage.openPage(button, code));
    return cy.wrap(new AppPage(ClonePage)).as('currentPage');
  }

  clickPublish() {
    this.getPublish().click();
    this.parent.parent.getDialog().setBody(DeleteDialog); //TODO validate for what else this dialog is used and rename it accordingly
    return cy.get('@currentPage');
  }

  clickUnpublish() {
    this.getUnpublish().click();
    this.parent.parent.getDialog().setBody(DeleteDialog); //TODO validate for what else this dialog is used and rename it accordingly
    return cy.get('@currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}
