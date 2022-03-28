import {htmlElements} from '../../WebElement.js';

import Content      from '../../app/Content.js';
import AdminPage      from '../../app/AdminPage.js';
import KebabMenu    from '../../app/KebabMenu.js';
import Pagination   from '../../app/Pagination.js';
import DeleteDialog from '../../app/DeleteDialog.js';
import TemplateForm from './TemplateForm.js';

export default class TemplatesPage extends Content {

  filterRow = `${htmlElements.div}.ContentTemplateList__filter.row`;
  searchBtn = `${htmlElements.button}.ContentTemplateList__searchform--button`;

  getSearchArea() {
    return this.get()
               .find(this.filterRow).eq(0);
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
               .find(`#ContentTemplateList-dropdown-${code}`)
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
    return this.getFootArea()
               .find(htmlElements.a);
  }

  typeSearchKeyword(value) {
    this.getSearchInput().type(value);
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
    this.getEdit().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AdminPage(TemplateForm);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
