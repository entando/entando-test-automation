import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import ManagementPage from './ManagementPage.js';

export default class EditProfilePage extends AppContent {

  profileTypeSelect   = `${htmlElements.select}[name=typeCode].RenderSelectInput`;
  usernameInput       = `${htmlElements.input}[name=id]#id`;
  fullNameInput       = `${htmlElements.input}[name=fullname]#fullname`;
  emailInput          = `${htmlElements.input}[name=email]#email`;
  profilePictureInput = `${htmlElements.input}[name=profilepicture]#profilepicture`;
  saveButton          = `${htmlElements.button}[type=submit].btn-primary`;

  getProfileTypeSelect() {
    return this.getContents()
               .find(this.profileTypeSelect);
  }

  getUsernameInput() {
    return this.getContents()
               .find(this.usernameInput);
  }

  getFullNameInput() {
    return this.getContents()
               .find(this.fullNameInput);
  }

  getEmailInput() {
    return this.getContents()
               .find(this.emailInput);
  }

  getProfilePictureInput() {
    return this.getContents()
               .find(this.profilePictureInput);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  selectProfileType(value) {
    this.getProfileTypeSelect().select(value);
  }

  typeFullName(input) {
    this.getFullNameInput().type(input);
  }

  typeEmail(input) {
    this.getEmailInput().type(input);
  }

  typeProfilePicture(input) {
    this.getProfilePictureInput().type(input);
  }

  submitForm() {
    this.getSaveButton().click();
  }

  editUser(profileType, fullName, email, profilePicture) {
    if (profileType) {
      this.selectProfileType(profileType);
    }
    this.typeFullName(fullName);
    this.typeEmail(email);
    if (profileType) {
      this.typeProfilePicture(profilePicture);
    }
    this.submitForm();
    return new AppPage(ManagementPage);
  }

}
