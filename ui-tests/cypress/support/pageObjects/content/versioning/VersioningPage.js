import AppContent     from '../../app/AppContent';
import {htmlElements} from '../../WebElement.js';
import Pagination     from '../../app/Pagination.js';

export default class VersioningPage extends AppContent {
  searchForm = `${htmlElements.form}.VersioningSearchForm__form`;
  searchDescInput = `${htmlElements.input}[name=description]`;

  static openPage(button) {
    cy.versioningController()
      .then(controller =>
          controller.intercept({method: 'GET'}, 'contentVersioningPageLoadingGET', '/contents?page=1&pageSize=*'));
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
               .find(`${htmlElements.button}[type=submit]`);
  }

  submitSearch() {
    this.getSearchSubmitButton()
        .then(button => {
          cy.versioningController()
            .then(controller =>
                controller.intercept({method: 'GET'}, 'submitSearch', '/contents?filters*'));
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
