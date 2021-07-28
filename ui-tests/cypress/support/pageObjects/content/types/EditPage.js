import {htmlElements} from "../../WebElement";

import Content from "../../app/Content.js";

import AppPage from "../../app/AppPage.js";

import AddAttributePage  from "./AddAttributePage";
import EditAttributePage from "./EditAttributePage";
import TypesPage         from "./TypesPage.js";

export default class EditPage extends Content {

  nameInput           = `${htmlElements.input}[name=name]`;
  codeInput           = `${htmlElements.input}[name=code]`;
  saveButton          = `${htmlElements.button}.AddContentTypeFormBody__save--btn`;
  attributeTypeSelect = `${htmlElements.select}[name=type]`;
  addAttributeButton  = `${htmlElements.button}.ContentTypeForm__add`;
  editAttributeOption = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-edit`;

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

  typeName(value) {
    this.getNameInput().type(value);
  }

  clearName() {
    this.getNameInput().clear();
  }

  getAttributeTypeSelect() {
    return this.getContents()
               .find(this.attributeTypeSelect);
  }

  getAddAttributeButton() {
    return this.getContents()
               .find(this.addAttributeButton);
  }

  addAttribute(attributeCode) {
    this.getAttributeTypeSelect().select(attributeCode);
    this.getAddAttributeButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    return new AppPage(AddAttributePage);
  }

  getAttributesTable() {
    return this.getContents()
               .find(htmlElements.table);
  }

  getAttributesTableRowAction(code) {
    return this.getAttributesTable()
               .find(`${htmlElements.button}#${code}-actions`);
  }

  editAttribute(code) {
    this.getAttributesTableRowAction(code)
        .click();
    cy.wait(500); // TODO: find a way to avoid waiting for arbitrary time periods

    this.getAttributesTable()
        .find(this.editAttributeOption)
        .filter(":visible")
        .click();

    return new AppPage(EditAttributePage);
  }

  save() {
    this.getSaveButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    return new AppPage(TypesPage);
  }

}
