import {htmlElements} from "../../../WebElement";

import Content from "../../../app/Content";

import AppPage from "../../../app/AppPage";

import EditPage               from "../EditPage";
import NestedAttributePage    from "./NestedAttributePage";
import CompositeAttributePage from "./CompositeAttributePage";

export default class AttributePage extends Content {

  codeInput           = `${htmlElements.input}[name=code]`;
  nameInput           = `${htmlElements.input}[name="names.{lang}"]`;
  nestedAttributeType = `${htmlElements.select}[name="nestedAttribute.type"]`;
  continueButton      = `${htmlElements.button}.ContentTypeAttributeForm__continue-btn`;

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getNameInput(lang) {
    return this.getContents()
               .find(this.nameInput.replace("{lang}", lang));
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

  typeName(lang, value) {
    this.getNameInput(lang).type(value);
  }

  clearName(lang) {
    this.getNameInput(lang).clear();
  }

  selectNestedAttributeType(value) {
    this.getNestedAttributeType().select(value);
  }

  continue(attribute = "", isComposite = false) {
    this.getContinueButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    switch (attribute) {
      case "List":
      case "Monolist":
        return new AppPage(NestedAttributePage);
      case "Composite":
        return new AppPage(CompositeAttributePage);
      default:
        if (isComposite) {
          return new AppPage(CompositeAttributePage);
        } else {
          return new AppPage(EditPage);
        }
    }
  }

}
