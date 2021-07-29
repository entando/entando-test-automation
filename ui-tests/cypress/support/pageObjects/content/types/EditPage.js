import {DATA_TESTID, htmlElements, WebElement} from "../../WebElement";

import Content from "../../app/Content.js";

import AppPage      from "../../app/AppPage.js";
import DeleteDialog from "../../app/DeleteDialog";

import AddAttributePage  from "./AddAttributePage";
import EditAttributePage from "./EditAttributePage";
import TypesPage         from "./TypesPage.js";

export default class EditPage extends Content {

  nameInput           = `${htmlElements.input}[name=name]`;
  codeInput           = `${htmlElements.input}[name=code]`;
  saveButton          = `${htmlElements.button}.AddContentTypeFormBody__save--btn`;
  attributeTypeSelect = `${htmlElements.select}[name=type]`;
  addAttributeButton  = `${htmlElements.button}.ContentTypeForm__add`;

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
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

  getKebabMenu(code) {
    return new AttributeKebabMenu(this, code);
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

  addAttribute(attributeCode) {
    this.selectAttribute(attributeCode);
    this.getAddAttributeButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    return new AppPage(AddAttributePage);
  }

  save() {
    this.getSaveButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    return new AppPage(TypesPage);
  }

}

class AttributeKebabMenu extends WebElement {

  edit     = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-edit`;
  moveUp   = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-move-up`;
  moveDown = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-move-down`;
  delete   = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-delete`;

  constructor(parent, code) {
    super(parent);
    this.code = code;
  }

  get() {
    return this.parent.getAttributesTable()
               .find(`${htmlElements.div}[${DATA_TESTID}=${this.code}-actions]`)
               .children(htmlElements.div);
  }

  open() {
    this.get()
        .children(htmlElements.button)
        .click();
    return this;
  }

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
    return new AppPage(EditAttributePage);
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
