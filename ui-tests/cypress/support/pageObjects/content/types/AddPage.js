import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import AppPage from '../../app/AppPage.js';

import EditPage from './EditPage';

export default class AddPage extends AppContent {

  codeInput  = `${htmlElements.input}[name=code]`;
  nameInput  = `${htmlElements.input}[name=name]`;
  saveButton = `${htmlElements.button}.AddContentTypeFormBody__save--btn`;

  static openPage(button) {
    cy.contentTypeAttributesController().then(controller => controller.intercept({ method: 'GET' }, 'addContentTypePageLoadingGET', '?page=1&pageSize=0', 1));
    cy.get(button).click();
    cy.wait('@addContentTypePageLoadingGET');
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
    this.getSaveButton().then(button => EditPage.openPageFromAttribute(button, code));
    return cy.wrap(new AppPage(EditPage)).as('currentPage');
  }

  addAndSaveContentType(code, name) {
    this.getCodeInput().then(input => this.type(input, code));
    this.getNameInput().then(input => this.type(input, name));
    return this.save(code);
  }

}
