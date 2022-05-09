import {htmlElements} from '../../WebElement.js';

import AdminContent    from '../../app/AdminContent';
import AdminPage       from '../../app/AdminPage.js';
import KebabMenu       from '../../app/KebabMenu.js';
import Pagination      from '../../app/Pagination.js';
import TemplateForm    from './TemplateForm.js';
import DeleteAdminPage from '../../app/DeleteAdminPage';

export default class TemplatesPage extends AdminContent {

  main      = `${htmlElements.div}[id="main"]`;
  form      = `${htmlElements.form}[id="search"]`;
  addButton = `${htmlElements.a}[class="btn btn-primary pull-right mb-5"]`;
  filterRow = `${htmlElements.form}[class="form-horizontal"]`;
  searchBtn = `${htmlElements.button}[class="btn btn-primary"]`;

  //FIXME AdminConsole is not built on REST APIs
  static openPage(button) {
    cy.contentTemplatesAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'contentTemplatesPageLoadingGET', '/list.action'));
    cy.get(button).click();
    cy.wait('@contentTemplatesPageLoadingGET');
  }

  getMain() {
    return this.get()
               .children(this.main);
  }

  getSearchArea() {
    return this.getMain()
               .find(this.filterRow);
  }

  getForm() {
    return this.getMain()
               .children(this.form);
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
    return new Pagination(this, TemplatesPage);
  }

  getAddButton() {
    return this.get()
               .children(this.main)
               .find(this.addButton);
  }

  clickSearch() {
    this.getSearchButton().then(button => {
      cy.contentTemplatesAdminConsoleController().then(controller => controller.intercept({method: 'POST'}, 'contentTemplatesSearchPOST', '/search.action'));
      this.click(button);
      cy.wait('@contentTemplatesSearchPOST');
    });
    return cy.get('@currentPage');
  }

  openAddTemplatePage() {
    this.getAddButton().then(button => TemplateForm.openPage(button));
    return cy.wrap(new AdminPage(TemplateForm)).as('currentPage');
  }
}

class TemplatesKebabMenu extends KebabMenu {

  get() {
    return this.parent.getTableRows()
               .contains(htmlElements.td, this.code)
               .closest(htmlElements.tr);
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
    this.getEdit().then(button => TemplateForm.openEdit(button, this.code));
    return cy.wrap(new AdminPage(TemplateForm)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().then(button => DeleteAdminPage.openDeleteContentTemplatePage(button, this.code));
    const deletePage = new AdminPage(DeleteAdminPage);
    deletePage.getContent().setOrigin(this.parent.parent);
    return cy.wrap(deletePage).as('currentPage');
  }

}
