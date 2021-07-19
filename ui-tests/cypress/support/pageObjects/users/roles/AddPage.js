import {DATA_TESTID, htmlElements} from "../../WebElement";

import Content from "../../app/Content.js";

import AppPage from "../../app/AppPage.js";

import RolesPage from "./RolesPage.js";

export default class AddPage extends Content {

  nameInput = `${htmlElements.input}[name="name"][${DATA_TESTID}=form_RenderTextInput_input]`;
  codeInput = `${htmlElements.input}[name="code"][${DATA_TESTID}=form_RenderTextInput_input]`;
  permissions = `${htmlElements.fieldset}[${DATA_TESTID}=common_RoleForm_fieldset]`;
  cancelButton = `${htmlElements.button}[${DATA_TESTID}=RoleForm__cancelButton]`;
  saveButton = `${htmlElements.button}[${DATA_TESTID}=RoleForm__saveButton]`;

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getPermissions() {
    return this.getContents()
               .find(this.permissions);
  }

  getPermissionsTitle() {
    return this.getContents()
               .find(this.permissions)
               .children(htmlElements.legend);
  }

  getPermissionsGrid() {
    return this.getContents()
               .find(this.permissions)
               .children(htmlElements.div)
               .children(htmlElements.div);
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
