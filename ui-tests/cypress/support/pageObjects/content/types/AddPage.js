import {htmlElements} from '../../WebElement';

import AdminContent from '../../app/AdminContent';

import AdminPage from '../../app/AdminPage.js';

import TypesPage from './TypesPage';

export default class AddPage extends AdminContent {

  codeInput  = `${htmlElements.input}#entityTypeCode`;
  nameInput  = `${htmlElements.input}#entityTypeDescription`;
  saveButton = `${htmlElements.button}[name="entandoaction:saveEntityType"]`;

  static openPage(button) {
    super.loadPage(button, '/Entity/initAddEntityType.action');
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  save() {
    this.getSaveButton().then(button => TypesPage.openPage(button));
    return cy.wrap(new AdminPage(TypesPage)).as('currentPage');
  }

  addAndSaveContentType(code, name) {
    this.getCodeInput().then(input => this.type(input, code));
    this.getNameInput().then(input => this.type(input, name));
    return this.save();
  }

}
