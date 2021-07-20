import {TEST_ID_KEY, htmlElements, WebElement} from '../../WebElement';
import Content from '../../app/Content.js';
import AppPage from '../../app/AppPage.js';
import TypesPage from './TypesPage.js';

export default class AddPage extends Content {

  nameInput = `${htmlElements.input}[name=name]`;
  codeInput = `${htmlElements.input}[name=code]`;
  saveButton = `${htmlElements.button}.AddContentTypeFormBody__save--btn`;

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

  save() {
    this.getSaveButton().click();
    // TODO: find a way to avoid waiting for arbitrary time periods
    cy.wait(1000);
    return new AppPage(TypesPage);
  }
}
