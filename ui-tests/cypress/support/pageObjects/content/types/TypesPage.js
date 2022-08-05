import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';
import KebabMenu    from '../../app/KebabMenu';

import AppPage    from '../../app/AppPage.js';

import AddPage  from './AddPage.js';
import EditPage from './EditPage.js';
import DeleteDialog from '../../app/DeleteDialog.js';

export default class TypesPage extends AppContent {

  addButton = `${htmlElements.button}.ContentTypeList__addbutton`;

  static openPage(button) {
    cy.contentTypesController().then(controller => controller.intercept({ method: 'GET' }, 'typesPageLoadingGET', '?page=1&pageSize=10', 1));
    cy.get(button).click();
    cy.wait('@typesPageLoadingGET');
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
    return this.getTableRows()
               .contains(htmlElements.tr, code);
  }

  getKebabMenu(code) {
    return new TypesKebabMenu(this, code);
  }

  getAddButton() {
    return this.getContents()
               .find(this.addButton);
  }

  openAddContentTypePage() {
    this.getAddButton().then(button => AddPage.openPage(button));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

}

class TypesKebabMenu extends KebabMenu {

  edit   = `${htmlElements.li}.ContentTypeList__menu-item-edit`;
  reload = `${htmlElements.li}.ContentTypeList__menu-item-reload`;
  delete = `${htmlElements.li}.ContentTypeList__menu-item-delete`;

  get() {
    return this.parent.getTableRow(this.code)
               .find(`${htmlElements.div}.dropdown.dropdown-kebab-pf`);
  }

  getEdit() {
    return this.get()
               .find(this.edit);
  }

  getReload() {
    return this.get()
               .find(this.reload);
  }

  getDelete() {
    return this.get()
               .find(this.delete);
  }

  openEdit() {
    this.getEdit().then(button => EditPage.openPageFromAttribute(button, this.code));
    return cy.wrap(new AppPage(EditPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    this.parent.parent.getDialog().getBody().setLoadOnConfirm(TypesPage);
    return cy.get('@currentPage');
  }

}
