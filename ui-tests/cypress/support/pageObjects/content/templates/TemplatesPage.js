import {htmlElements} from '../../WebElement.js';

import Content           from '../../app/Content.js';
import AdminPage         from '../../app/AdminPage.js';
import KebabMenu         from '../../app/KebabMenu.js';
import Pagination        from '../../app/Pagination.js';
import TemplateForm                       from './TemplateForm.js';
import DeleteAdminPage from '../../app/DeleteAdminPage';

export default class TemplatesPage extends Content {

  main = `${htmlElements.div}[id="main"]`;
  addButton = `${htmlElements.a}[class="btn btn-primary pull-right mb-5"]`;

  filterRow = `${htmlElements.form}[class="form-horizontal"]`;
  searchBtn = `${htmlElements.button}[class="btn btn-primary"]`;

  getSearchArea() {
    return this.get()
               .children(this.main)
               .find(this.filterRow);
  }

  getSearchInput() {
    return this.getSearchArea()
               .find(htmlElements.select);
  }

  getSearchButton() {
    return this.getSearchArea()
               .find(this.searchBtn);
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
    return this.getTable()
               .contains(htmlElements.td, code)
               .closest(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new TemplatesKebabMenu(this, code);
  }

  getFootArea() {
    return this.get()
               .find(this.filterRow).eq(1);
  }

  getPagination() {
    return new Pagination(this);
  }

  getAddButton() {
    return this.get()
               .children(this.main)
               .find(this.addButton);
  }

  searchType(value) {
    this.getSearchInput().select(value);
  }

  clickSearch() {
    this.getSearchButton().click();
  }

  clickAddButton() {
    this.getAddButton().click();
    return new AdminPage(TemplateForm);
  }
}

class TemplatesKebabMenu extends KebabMenu {

  get() {
    return this.parent.getTableRows()
                      .contains(htmlElements.td, this.code)
                      .closest(htmlElements.tr)
  }

  open() {
    this.get()
        .find(`${htmlElements.button}[class="btn btn-menu-right dropdown-toggle"]`)
        .click();
    return this;
  }


  getEdit() {
    return this.get()
               .contains(htmlElements.li, 'Edit');
  }

  getDelete() {
    return this.get()
               .contains(htmlElements.li, 'Delete');

  }

  openEdit() {
    this.getEdit().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AdminPage(TemplateForm);
  }

  clickDelete() {
    this.getDelete().click();
    cy.wait(1000);
    return new AdminPage(DeleteAdminPage);
  }

}
