import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import EditPage from './EditPage';

export default class AddPage extends AppContent {

  codeInput  = `${htmlElements.input}[name=code]`;
  nameInput  = `${htmlElements.input}[name=name]`;
  saveButton = `${htmlElements.button}.ProfileTypeForm__save-btn`;

  static openPage(button) {
    cy.profileTypeAttributesController().then(controller => controller.intercept({method: 'GET'}, 'addPageLoadingGET', '?page=1&pageSize=0'));
    cy.get(button).click();
    cy.wait('@addPageLoadingGET');
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

  save(code) {
    this.getSaveButton().then(button => EditPage.openPage(button, code));
    return cy.wrap(new AppPage(EditPage)).as('currentPage');
  }

  addAndSaveProfileType(code, name) {
    this.getNameInput().then(input => this.type(input, name));
    this.getCodeInput().then(input => this.type(input, code));
    return this.save(code);
  }

}
