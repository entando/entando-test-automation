import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';
import KebabMenu  from '../../app/KebabMenu.js';

import AppPage      from '../../app/AppPage.js';
import DeleteDialog from '../../app/DeleteDialog.js';
import AddPage      from './AddPage.js';
import EditPage     from './EditPage.js';

export default class ProfileTypesPage extends AppContent {

  addButton = `${htmlElements.button}.ProfileType__add`;

  static openPage(button) {
    super.loadPage(button, '/profiletype', false, true);
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
               .find(`#${code}-actions`)
               .closest(htmlElements.tr);
  }

  getAddButton() {
    return this.getContents()
               .find(this.addButton);
  }

  getKebabMenu(code) {
    return new ProfileTypesKebabMenu(this, code);
  }

  openAddProfileTypePage() {
    this.getAddButton().then(button => AddPage.openPage(button));
    return cy.wrap(new AppPage(AddPage)).as('currentPage');
  }

}

class ProfileTypesKebabMenu extends KebabMenu {

  edit   = `${htmlElements.li}.ProfileTypeListMenuAction__menu-item-edit`;
  delete = `${htmlElements.li}.ProfileTypeListMenuAction__menu-item-delete`;

  get() {
    return this.parent.getTableRows()
               .find(`#${this.code}-actions`)
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
    this.getEdit().then(button => EditPage.openPage(button, this.code));
    return cy.wrap(new AppPage(EditPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().then(button => this.parent.click(button));
    this.parent.parent.getDialog().setBody(DeleteDialog);
    this.parent.parent.getDialog().getBody().setLoadOnConfirm(ProfileTypesPage);
    return cy.get('@currentPage');
  }

}
