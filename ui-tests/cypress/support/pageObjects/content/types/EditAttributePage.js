import AppPage from '../../app/AppPage';
import Content from '../../app/Content';
import EditPage from './EditPage';
import { htmlElements } from '../../WebElement';

export default class EditAttributePage extends Content {

  nameInput = `${htmlElements.input}[name="names.en"]`;
  continueButton = `${htmlElements.button}.ContentTypeAttributeForm__continue-btn`;

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  typeName(value) {
    this.getNameInput().type(value);
  }

  clearName() {
    this.getNameInput().clear();
  }

  getContinueButton() {
    return this.getContents()
               .find(this.continueButton);
  }

  continue() {
    this.getContinueButton().click();
    // TODO: find a way to avoid waiting for arbitrary time periods
    cy.wait(1000);
    return new AppPage(EditPage);
  }
}
