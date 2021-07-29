import {DATA_TESTID, htmlElements, WebElement} from "../../WebElement";

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

  getKebabMenu(code) {
    return new AttributeKebabMenu(this, code);
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

class AttributeKebabMenu extends WebElement {

  moveUp   = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-move-up`;
  moveDown = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-move-down`;
  delete   = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-delete`;

  constructor(parent, code) {
    super(parent);
    this.code = code;
  }

  get() {
    return this.parent.getAttributesTable()
               .find(`${htmlElements.div}[${DATA_TESTID}=${this.code}-actions]`)
               .children(htmlElements.div);
  }

  open() {
    this.get()
        .children(htmlElements.button)
        .click();
    return this;
  }

  getMoveUp() {
    return this.get()
               .find(this.moveUp);
  }

  getMoveDown() {
    return this.get()
               .find(this.moveDown);
  }

  getDelete() {
    return this.get()
               .find(this.delete);
  }

  clickMoveUp() {
    this.getMoveUp().click();
  }

  clickMoveDown() {
    this.getMoveDown().click();
  }

  clickDelete() {
    this.getDelete().click();
  }

}
