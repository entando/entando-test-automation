import {DATA_TESTID, htmlElements} from '../../WebElement.js';

import Content   from '../../app/Content.js';
import KebabMenu from '../../app/KebabMenu';

import AppPage      from '../../app/AppPage.js';
import DeleteDialog from '../../app/DeleteDialog';

import AddPage  from './AddPage.js';
import EditPage from './EditPage.js';

export default class TypesPage extends Content {

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
               .find(`[${DATA_TESTID}=${code}-actions]`)
               .closest(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new TypesKebabMenu(this, code);
  }

  getAddButton() {
    return this.getContents()
               .find(this.addButton);
  }

  openAddContentTypePage() {
    this.getAddButton().click();
    return new AppPage(AddPage);
  }

}

class TypesKebabMenu extends KebabMenu {

  edit   = `${htmlElements.li}.ContentTypeList__menu-item-edit`;
  reload = `${htmlElements.li}.ContentTypeList__menu-item-reload`;
  delete = `${htmlElements.li}.ContentTypeList__menu-item-delete`;

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
    return new AppPage(EditPage);
  }

  clickReload() {
    this.getReload().click();
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
