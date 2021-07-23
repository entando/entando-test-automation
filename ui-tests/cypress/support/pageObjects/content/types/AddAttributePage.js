import AppPage from '../../app/AppPage';
import Content from '../../app/Content';
import EditPage from './EditPage';
import { htmlElements } from '../../WebElement';

export default class AddAttributePage extends Content {

  codeInput = `${htmlElements.input}[name=code]`;
  continueButton = `${htmlElements.button}.ContentTypeAttributeForm__continue-btn`;

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  typeCode(value) {
    this.getCodeInput().type(value);
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
