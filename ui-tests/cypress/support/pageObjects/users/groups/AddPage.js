import {DATA_TESTID, htmlElements} from "../../WebElement";

import Content from "../../app/Content.js";

import AppPage from "../../app/AppPage.js";

import GroupsPage from "./GroupsPage.js";

export default class AddPage extends Content {

  nameInput = `${htmlElements.input}[name="name"][${DATA_TESTID}=form_RenderTextInput_input]`;
  codeInput = `${htmlElements.input}[name="code"][${DATA_TESTID}=form_RenderTextInput_input]`;
  cancelButton = `${htmlElements.button}[${DATA_TESTID}=group-form-cancel]`;
  saveButton = `${htmlElements.button}[${DATA_TESTID}=group-form-save]`;

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getCancelButton() {
    return this.getContents()
               .find(this.cancelButton);
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

  addGroup(name, code, append = false) {
    this.typeName(name);
    if (!append) {
      this.clearCode();
    }
    this.typeCode(code);
    this.submitForm();
    cy.wait(1000);
    return new AppPage(GroupsPage);
  }

}
