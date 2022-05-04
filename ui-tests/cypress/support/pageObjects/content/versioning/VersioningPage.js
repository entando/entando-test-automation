import AdminContent   from '../../app/AdminContent';
import {htmlElements} from '../../WebElement.js';
import Pagination     from '../../app/Pagination.js';

export default class VersioningPage extends AdminContent {
  searchForm      = `${htmlElements.form}[id="search"]`;
  searchDescInput = `${htmlElements.input}.form-control`;

  static openPage(button) {
    cy.intercept('http://entando7-0.apps.ent64azure.com/entando-de-app/do/jpversioning/Content/Versioning/list.action').as('contentVersioningPageLoadingGET');
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
          cy.intercept('http://entando7-0.apps.ent64azure.com/entando-de-app/do/jpversioning/Content/Versioning/search.action').as('submitSearch');
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
    return new Pagination(this);
  }

}
