import {htmlElements} from '../../WebElement.js';

import AppContent      from '../../app/AppContent';
import AppPage         from '../../app/AppPage.js';
import KebabMenu       from '../../app/KebabMenu.js';
import Pagination      from '../../app/Pagination.js';
import TemplateForm    from './TemplateForm.js';
import DeleteDialog from '../../app/DeleteDialog.js';

export default class TemplatesPage extends AppContent {

  filterRow = `${htmlElements.div}.ContentTemplateList__filter.row`;
  addButton = `${htmlElements.button}.ContentTemplateList__addbutton`;
  searchBtn = `${htmlElements.button}.ContentTemplateList__searchform--button`;

  static openPage(button) {
    cy.contentTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'contentTemplatesPageLoadingGET', '?page=1&pageSize=10'));
    cy.get(button).click();
    cy.wait('@contentTemplatesPageLoadingGET');
  }

  getSearchArea() {
    return this.getContents()
               .find(this.filterRow);
  }

  getSearchInput() {
    return this.getSearchArea()
               .find(htmlElements.input);
  }

  getSearchButton() {
    return this.getSearchArea()
               .find(this.searchBtn);
  }

  getTable() {
    return this.getContents()
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
    return this.getContents()
               .find(this.filterRow).eq(1);
  }

  getPagination() {
    return new Pagination(this, TemplatesPage);
  }

  getAddButton() {
    return this.getFootArea()
               .find(this.addButton);
  }

  clickSearch() {
    this.getSearchButton().then(button => {
      cy.contentTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'contentTemplatesSearchGET', '?*'));
      this.click(button);
      cy.wait('@contentTemplatesSearchGET');
    });
    return cy.get('@currentPage');
  }

  openAddTemplatePage() {
    this.getAddButton().then(button => TemplateForm.openPage(button));
    return cy.wrap(new AppPage(TemplateForm)).as('currentPage');
  }
}

class TemplatesKebabMenu extends KebabMenu {

  edit   = `${htmlElements.li}.ContentTemplateList__menu-item-edit`;
  delete = `${htmlElements.li}.ContentTemplateList__menu-item-delete`;

  get() {
    return this.parent.getTableRows()
               .find(`#ContentTemplateList-dropdown-${this.code}`)
               .closest(htmlElements.div);
  }

  getEdit() {
    return this.get()
               .find(this.edit);
  }

  getDelete() {
    return this.get()
               .find(this.delete);
  }

  openEdit() {
    this.getEdit().then(button => TemplateForm.openEdit(button, this.code));
    return cy.wrap(new AppPage(TemplateForm)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    this.parent.parent.getDialog().getBody().setLoadOnConfirm(TemplatesPage);
    return cy.get('@currentPage');
  }

}
