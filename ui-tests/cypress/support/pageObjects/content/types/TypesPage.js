import {htmlElements} from '../../WebElement.js';

import AdminContent from '../../app/AdminContent.js';
import KebabMenu    from '../../app/KebabMenu';

import AdminPage    from '../../app/AdminPage.js';

import AddPage  from './AddPage.js';
import EditPage from './EditPage.js';
import DeleteAdminPage from '../../app/DeleteAdminPage.js';

export default class TypesPage extends AdminContent {

  addButton = `${htmlElements.a}.btn.btn-primary.pull-right.mb-5`;

  static openPage(button) {
    super.loadPage(button, '/Entity/initViewEntityTypes.action');
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
               .find(`${htmlElements.form}[id="initViewEntityTypes"]`)
               .find(this.addButton);
  }

  openAddContentTypePage() {
    this.getAddButton().then(button => AddPage.openPage(button));
    return cy.wrap(new AdminPage(AddPage)).as('currentPage');
  }

}

class TypesKebabMenu extends KebabMenu {

  edit   = `${htmlElements.a}[href*="initEditEntityType.action"]`;
  reload = `${htmlElements.a}[href*="reloadEntityTypeReferences.action"]`;
  delete = `${htmlElements.a}[href*="trashEntityType.action"]`;

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
    this.getEdit().then(button => EditPage.openPage(button));
    return cy.wrap(new AdminPage(EditPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().then(button => DeleteAdminPage.openDeleteContentTypePage(button));
    const deletePage = new AdminPage(DeleteAdminPage);
    deletePage.getContent().setOrigin(this.parent.parent);
    deletePage.getContent().setForm('removeEntityType');
    return cy.wrap(deletePage).as('currentPage');
  }

}
