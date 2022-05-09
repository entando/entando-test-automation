import AdminContent   from '../../app/AdminContent';
import {htmlElements} from '../../WebElement.js';
import Pagination     from '../../app/Pagination.js';

export default class VersioningPage extends AdminContent {
  searchForm      = `${htmlElements.form}[id="search"]`;
  searchDescInput = `${htmlElements.input}.form-control`;

  static openPage(button) {
    cy.versioningController()
      .then(controller =>
          controller.intercept({method: 'GET'}, 'contentVersioningPageLoadingGET', '/list.action'));
    cy.get(button).click();
    cy.wait('@contentVersioningPageLoadingGET');
  }

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
               .find(`${htmlElements.button}.btn`);
  }

  submitSearch() {
    this.getSearchSubmitButton()
        .then(button => {
          cy.versioningController()
            .then(controller =>
                controller.intercept({method: 'POST'}, 'submitSearch', '/search.action'));
          cy.get(button).click();
          cy.wait('@submitSearch');
        });
    return cy.get('@currentPage');
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
    return new Pagination(this, VersioningPage);
  }

}
