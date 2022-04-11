import {htmlElements} from '../../WebElement';

import AdminContent   from '../../app/AdminContent.js';
import KebabMenu from '../../app/KebabMenu';

import AdminPage      from '../../app/AdminPage.js';
import DeleteDialog from '../../app/DeleteDialog';

import TypesPage     from './TypesPage.js';
import AttributePage from './attributes/AttributePage';

export default class EditPage extends AdminContent {

  codeInput           = `${htmlElements.input}[name=code]`;
  nameInput           = `${htmlElements.input}[name=name]`;
  saveButton          = `${htmlElements.button}.AddContentTypeFormBody__save--btn`;
  attributeTypeSelect = `${htmlElements.select}[name=type]`;
  addAttributeButton  = `${htmlElements.button}.ContentTypeForm__add`;

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getAttributeTypeSelect() {
    return this.getContents()
               .find(this.attributeTypeSelect);
  }

  getAddAttributeButton() {
    return this.getContents()
               .find(this.addAttributeButton);
  }

  getAttributesTable() {
    return this.getContents()
               .find(htmlElements.table);
  }

  getTableRows() {
    return this.getAttributesTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableRow(code) {
    return this.getKebabMenu(code)
               .get()
               .parents(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new AttributeKebabMenu(this, code);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  typeName(value) {
    this.getNameInput().type(value);
  }

  clearName() {
    this.getNameInput().clear();
  }

  selectAttribute(value) {
    this.getAttributeTypeSelect().select(value);
  }

  openAddAttributePage(attributeCode) {
    this.selectAttribute(attributeCode);
    this.getAddAttributeButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    return new AdminPage(AttributePage);
  }

  save() {
    this.getSaveButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    return new AdminPage(TypesPage);
  }

}

class AttributeKebabMenu extends KebabMenu {

  edit     = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-edit`;
  moveUp   = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-move-up`;
  moveDown = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-move-down`;
  delete   = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-delete`;

  getEdit() {
    return this.get()
               .find(this.edit);
  }

  getMoveUp() {
    return this.get()
               .find(this.moveUp);
  }

  getMoveDown() {
    return this.get()
               .find(this.moveDown);
  }

  getDelete() {
    return this.get()
               .find(this.delete);
  }

  openEdit() {
    this.getEdit().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AdminPage(AttributePage);
  }

  clickMoveUp() {
    this.getMoveUp().click();
  }

  clickMoveDown() {
    this.getMoveDown().click();
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
