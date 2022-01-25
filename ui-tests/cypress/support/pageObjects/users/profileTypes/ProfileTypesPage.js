import {htmlElements} from '../../WebElement.js';

import Content      from '../../app/Content.js';
import AppPage      from '../../app/AppPage.js';
import KebabMenu    from '../../app/KebabMenu.js';
import DeleteDialog from '../../app/DeleteDialog.js';

import AddPage  from './AddPage.js';
import EditPage from './EditPage.js';

export default class ProfileTypesPage extends Content {

  addButton = `${htmlElements.button}.ProfileType__add`;

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
    this.getAddButton().click();
    return new AppPage(AddPage);
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
    this.getEdit().click();
    //cy.wait(1000); //TODO find a better way to identify when the page loaded (fixed with cy.location checking the URL)
    cy.location('pathname').should('include', '/edit');
    return new AppPage(EditPage);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
