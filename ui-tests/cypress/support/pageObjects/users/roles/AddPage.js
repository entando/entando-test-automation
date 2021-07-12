import {TEST_ID_KEY, htmlElements, WebElement} from "../../WebElement";

import Content from "../../app/Content.js";

import AppPage from "../../app/AppPage.js";

import RolesPage from "./RolesPage.js";

export default class AddPage extends Content {

  nameInput = `${htmlElements.input}[name="name"][${TEST_ID_KEY}=form_RenderTextInput_input]`;
  codeInput = `${htmlElements.input}[name="code"][${TEST_ID_KEY}=form_RenderTextInput_input]`;
  saveButton = `${htmlElements.button}[${TEST_ID_KEY}=RoleForm__saveButton]`;

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

  typeName(input) {
    this.getNameInput().type(input);
  }

  typeCode(input) {
    this.getCodeInput().type(input);
  }

  clearCode() {
    this.getCodeInput().clear();
  }

  submitForm() {
    this.getSaveButton().click();
  }

  addRole(name, code, append = false) {
    this.typeName(name);
    if (!append) {
      this.clearCode();
    }
    this.typeCode(code);
    this.submitForm();
    cy.wait(1000);
    return new AppPage(RolesPage);
  }

}