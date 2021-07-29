import {htmlElements} from "../../WebElement";

import Content from "../../app/Content";

import AppPage from "../../app/AppPage";

import AddAttributePage from "./AddAttributePage";
import EditPage         from "./EditPage";

export default class CompositeAttributePage extends Content {

  attributeTypeSelect = `${htmlElements.select}[name=type]`;
  addAttributeButton  = `${htmlElements.button}.ContentTypeForm__add`;
  continueButton      = `${htmlElements.button}.ContentTypeAttributeForm__continue-btn`;

  getAttributeTypeSelect() {
    return this.getContents()
               .find(this.attributeTypeSelect);
  }

  getAddAttributeButton() {
    return this.getContents()
               .find(this.addAttributeButton);
  }

  getContinueButton() {
    return this.getContents()
               .find(this.continueButton);
  }

  selectAttribute(value) {
    this.getAttributeTypeSelect().select(value);
  }

  getAttributesTable() {
    return this.getContents()
               .find(htmlElements.table);
  }

  addAttribute(attributeCode) {
    this.selectAttribute(attributeCode);
    this.getAddAttributeButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    return new AppPage(AddAttributePage);
  }

  continue() {
    this.getContinueButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    return new AppPage(EditPage);
  }

}
