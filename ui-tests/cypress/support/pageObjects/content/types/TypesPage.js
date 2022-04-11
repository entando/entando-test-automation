import {htmlElements} from '../../WebElement.js';

import AdminContent from '../../app/AdminContent.js';
import KebabMenu    from '../../app/KebabMenu';

import AdminPage    from '../../app/AdminPage.js';
import DeleteDialog from '../../app/DeleteDialog';

import AddPage  from './AddPage.js';
import EditPage from './EditPage.js';

export default class TypesPage extends AdminContent {

  addButton = `${htmlElements.button}.ContentTypeList__addbutton`;

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
               .find(`#ContentTypeList-dropdown-${code}`)
               .closest(htmlElements.tr);
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
    this.getAddButton().click();
    return new AdminPage(AddPage);
  }

}

class TypesKebabMenu extends KebabMenu {

  edit   = `${htmlElements.li}.ContentTypeList__menu-item-edit`;
  reload = `${htmlElements.li}.ContentTypeList__menu-item-reload`;
  delete = `${htmlElements.li}.ContentTypeList__menu-item-delete`;

  get() {
    return this.parent.getTableRows()
               .find(`#ContentTypeList-dropdown-${this.code}`)
               .closest(htmlElements.div);
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
    this.getEdit().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AdminPage(EditPage);
  }

  clickReload() {
    this.getReload().click();
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
