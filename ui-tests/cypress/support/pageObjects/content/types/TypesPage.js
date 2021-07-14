import {TEST_ID_KEY, htmlElements, WebElement} from '../../WebElement.js';
import Content from '../../app/Content.js';
import AppPage from '../../app/AppPage.js';
import AddPage from './AddPage.js';
import EditPage from './EditPage.js';

export default class TypesPage extends Content {
  
  editOption = `${htmlElements.li}.ContentTypeList__menu-item-edit`;
  deleteOption= `${htmlElements.li}.ContentTypeList__menu-item-delete`;
  modalDeleteButton = `${htmlElements.button}#DeleteContentTypeModal__button-delete`;

  getAddButton() {
    return this.getContents()
               .find(htmlElements.button)
               .contains('Add');
  }

  getTable() {
    return this.getContents()
               .find(htmlElements.table);
  }

  getTableCell(content) {
    return this.getContents()
               .find(htmlElements.td)
               .contains(content);
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
    cy.wait(500);

    this.getTable()
        .find(this.deleteOption)
        .filter(':visible')
        .click();
    cy.wait(1500);

    this.parent
        .getDialog()
        .find(this.modalDeleteButton)
        .click();
  }
}