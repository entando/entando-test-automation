import {DATA_TESTID, htmlElements} from "../../WebElement";

import Content from "../../app/Content.js";

import AppPage from "../../app/AppPage.js";

import ManagementPage from "./ManagementPage.js";

export default class AddPage extends Content {

  nameInput            = `${htmlElements.input}[name=username][${DATA_TESTID}=form_RenderTextInput_input]`;
  passwordInput        = `${htmlElements.input}[name=password][${DATA_TESTID}=form_RenderTextInput_input]`;
  passwordConfirmInput = `${htmlElements.input}[name=passwordConfirm][${DATA_TESTID}=form_RenderTextInput_input]`;
  status               = `${htmlElements.div}[${DATA_TESTID}=status-switchField]`;
  saveButton           = `${htmlElements.button}[${DATA_TESTID}=UserForm__saveButton]`;
  cancelButton         = `${htmlElements.button}[${DATA_TESTID}=common_UserForm_Button]`;

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getPasswordInput() {
    return this.getContents()
               .find(this.passwordInput);
  }

  getPasswordConfirmInput() {
    return this.getContents()
               .find(this.passwordConfirmInput);
  }

  getStatus() {
    return this.getContents()
               .find(this.status);
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

  typePassword(input) {
    this.getPasswordInput().type(input);
  }

  typePasswordConfirm(input) {
    this.getPasswordConfirmInput().type(input);
  }

  changeStatus() {
    this.getStatus()
        .children(htmlElements.div)
        .click();
  }

  submitForm() {
    this.getSaveButton().click();
  }

  editUser(password, changeStatus = false, passwordConfirm = password) {
    this.typePassword(password);
    this.typePasswordConfirm(passwordConfirm);
    if (changeStatus) {
      this.changeStatus();
    }
    this.submitForm();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(ManagementPage);
  }

}
