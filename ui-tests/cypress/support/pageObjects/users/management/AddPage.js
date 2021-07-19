import {DATA_TESTID, htmlElements} from "../../WebElement";

import Content from "../../app/Content.js";

import AppPage from "../../app/AppPage.js";

import ManagementPage from "./ManagementPage.js";

export default class AddPage extends Content {

  nameInput            = `${htmlElements.input}[name=username][${DATA_TESTID}=form_RenderTextInput_input]`;
  passwordInput        = `${htmlElements.input}[name=password][${DATA_TESTID}=form_RenderTextInput_input]`;
  passwordConfirmInput = `${htmlElements.input}[name=passwordConfirm][${DATA_TESTID}=form_RenderTextInput_input]`;
  profileTypeSelect    = `${htmlElements.select}[name=profileType][${DATA_TESTID}=form_RenderSelectInput_select]`;
  status               = `${htmlElements.fieldset}[${DATA_TESTID}=common_UserForm_fieldset]`;
  saveButton           = `${htmlElements.button}[${DATA_TESTID}=UserForm__saveButton]`;
  otherButtons         = `${htmlElements.button}[${DATA_TESTID}=common_UserForm_Button]`;

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

  getProfileTypeSelect() {
    return this.getContents()
               .find(this.profileTypeSelect);
  }

  getStatus() {
    return this.getContents()
               .find(this.status);
  }

  getCancelButton() {
    return this.getContents()
               .find(this.otherButtons).eq(1);
  }

  getSaveAndEditButton() {
    return this.getContents()
               .find(this.otherButtons).eq(0);
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

  selectProfileType(value) {
    this.getProfileTypeSelect().select(value);
  }

  submitForm() {
    this.getSaveButton().click();
  }

  addUser(username, password, profileType, passwordConfirm = password) {
    this.typeName(username);
    this.typePassword(password);
    this.typePasswordConfirm(passwordConfirm);
    this.selectProfileType(profileType);
    this.submitForm();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AppPage(ManagementPage);
  }

}