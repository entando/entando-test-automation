import { htmlElements } from '../../WebElement.js';
import Content from '../../app/Content.js';
import AppPage from '../../app/AppPage.js';
import AddPage from './AddPage.js';
import EditPage from './EditPage.js';

export default class TypesPage extends Content {
  
  editOption = `${htmlElements.li}.ContentTypeList__menu-item-edit`;
  deleteOption= `${htmlElements.li}.ContentTypeList__menu-item-delete`;
  modalDeleteButton = `${htmlElements.button}#DeleteContentTypeModal__button-delete`;
  addButton = `${htmlElements.button}.ContentTypeList__addbutton`;

  getAddButton() {
    return this.getContents()
               .find(this.addButton);
  }

  getTable() {
    return this.getContents()
               .find(htmlElements.table);
  }

  getTableRow(code) {
    return this.getTable()
               .find(htmlElements.td)
               .contains(code)
               .closest(htmlElements.tr);
  }

  getTableRowAction(code) {
    return this.getTable()
               .find(`${htmlElements.button}#ContentTypeList-dropdown-${code}`);
  }

  addContentType() {
    this.getAddButton().click();
    return new AppPage(AddPage);
  }

  editContentType(code) {
    this.getTableRowAction(code)
        .click();
    // TODO: find a way to avoid waiting for arbitrary time periods
    cy.wait(500);

    this.getTable()
        .find(this.editOption)
        .filter(':visible')
        .click();

    return new AppPage(EditPage);
  }

  deleteContentType(code) {
    this.getTableRowAction(code)
        .click();
    // TODO: find a way to avoid waiting for arbitrary time periods
    cy.wait(500);

    this.getTable()
        .find(this.deleteOption)
        .filter(':visible')
        .click();
    // TODO: find a way to avoid waiting for arbitrary time periods
    cy.wait(1500);

    this.parent
        .getDialog()
        .get()
        .find(this.modalDeleteButton)
        .click();
  }
}
