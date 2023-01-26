import {htmlElements, WebElement} from '../WebElement';

import AppPage from './AppPage';

export default class Pagination extends WebElement {

  constructor(parent, paginationPage) {
    super(parent);
    this.paginationPage = paginationPage;
  }

  get() {
    return this.parent.getContents().find(`${htmlElements.form}.table-view-pf-pagination`);
  }

  getAreas() {
    return this.get().children(`${htmlElements.div}.form-group`);
  }

  getLeftArea() {
    return this.getAreas().eq(0);
  }

  getPageSizeDropdown() {
    return this.getLeftArea().find(`${htmlElements.button}#pagination-row-dropdown`);
  }

  getRightArea() {
    return this.getAreas().eq(1);
  }

  getItemsCurrent() {
    return this.getRightArea().find(`${htmlElements.span}.pagination-pf-items-current`);
  }

  getItemsTotal() {
    return this.getRightArea().find(`${htmlElements.span}.pagination-pf-items-total`);
  }

  getPreviousButtonsArea() {
    return this.getRightArea().find(`${htmlElements.ul}.pagination-pf-back`);
  }

  getFirstPageButton() {
    return this.getPreviousButtonsArea().find(`${htmlElements.a}[title="First page"]`);
  }

  getPreviousButton() {
    return this.getPreviousButtonsArea().find(`${htmlElements.a}[title="Previous page"]`);
  }

  getInput() {
    return this.getRightArea().find(`${htmlElements.input}.pagination-pf-page`);
  }

  getNextButtonsArea() {
    return this.getRightArea().find(`${htmlElements.ul}.pagination-pf-forward`);
  }

  getNextButton() {
    return this.getNextButtonsArea().find(`${htmlElements.a}[title="Next page"]`);
  }

  getLastPageButton() {
    return this.getNextButtonsArea().find(`${htmlElements.a}[title="Last page"]`);
  }

  getPagesTotal() {
    return this.getRightArea().find(`${htmlElements.span}.pagination-pf-pages`);
  }

  navigateToFirstPage() {
    this.getFirstPageButton().then(button => this.paginationPage.changePage(button));
    return cy.wrap(new AppPage(this.paginationPage)).as('currentPage');
  }

  navigateToPreviousPage() {
    this.getPreviousButton().then(button => this.paginationPage.changePage(button));
    return cy.wrap(new AppPage(this.paginationPage)).as('currentPage');
  }

  navigateToPage(page) {
    this.getInput().clear().then(() => this.paginationPage.goToPage(page));
    return cy.wrap(new AppPage(this.paginationPage)).as('currentPage');
  }

  navigateToNextPage() {
    this.getNextButton().then(button => this.paginationPage.changePage(button));
    return cy.wrap(new AppPage(this.paginationPage)).as('currentPage');
  }

  navigateToLastPage() {
    this.getLastPageButton().then(button => this.paginationPage.changePage(button));
    return cy.wrap(new AppPage(this.paginationPage)).as('currentPage');
  }

}
