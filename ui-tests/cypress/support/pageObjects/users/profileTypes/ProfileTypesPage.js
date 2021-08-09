import { htmlElements } from '../../WebElement.js';

import Content   from '../../app/Content.js';
import AppPage      from '../../app/AppPage.js';

import AddPage  from './AddPage.js';
import EditPage from './EditPage.js';

export default class ProfileTypesPage extends Content {

  addButton = `${htmlElements.button}.ProfileType__add`;
  editAction = `${htmlElements.li}.ProfileTypeListMenuAction__menu-item-edit`;
  deleteAction = `${htmlElements.li}.ProfileTypeListMenuAction__menu-item-delete`;

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

  getTableRowActions(code) {
    return this.getTableRow(code)
               .find(htmlElements.button);
  }

  getAddButton() {
    return this.getContents()
               .find(this.addButton);
  }

  openAddProfileTypePage() {
    this.getAddButton().click();
    return new AppPage(AddPage);
  }

  openEditProfileTypePage(code) {
    this.getTableRowActions(code)
        .click();
    
    this.getTableRow(code)
        .find(this.editAction)
        .click();

    cy.wait(1000); //TODO find a better way to identify when the page loaded

    return new AppPage(EditPage);
  }

  deleteProfileType(code) {
    this.getTableRowActions(code)
        .click();

    this.getTableRow(code)
        .find(this.deleteAction)
        .click();
    
    cy.wait(1000); //TODO find a better way to identify when the page loaded

    this.parent
        .getDialog()
        .getConfirmButton()
        .click();
  }

}
