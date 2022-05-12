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
    cy.profileTypesController().then(controller => controller.intercept({method: 'GET'}, 'profileTypesPageLoadingGET', `?sort=name&page=1&pageSize=10`));
    cy.profileTypesController().then(controller => controller.intercept({method: 'GET'}, 'profileTypesStatusLoadingGET', 'Status'));
    cy.get(button).click();
    cy.wait(['@profileTypesPageLoadingGET', '@profileTypesStatusLoadingGET']);
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
    return cy.get('@currentPage');
  }

}
