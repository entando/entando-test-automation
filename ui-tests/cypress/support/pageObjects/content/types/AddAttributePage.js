import {htmlElements} from "../../WebElement";

import Content        from "../../app/Content";

import AppPage        from "../../app/AppPage";

import EditPage       from "./EditPage";

export default class AddAttributePage extends Content {

  codeInput           = `${htmlElements.input}[name=code]`;
  nestedAttributeType = `${htmlElements.select}[name="nestedAttribute.type"]`;
  continueButton      = `${htmlElements.button}.ContentTypeAttributeForm__continue-btn`;

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getNestedAttributeType() {
    return this.getContents()
               .find(this.nestedAttributeType);
  }

  getContinueButton() {
    return this.getContents()
               .find(this.continueButton);
  }

  typeCode(value) {
    this.getCodeInput().type(value);
  }

  continue() {
    this.getContinueButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    return new AppPage(EditPage);
  }

}
