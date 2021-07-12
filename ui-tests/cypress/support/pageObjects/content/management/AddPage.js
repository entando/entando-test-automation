import {htmlElements} from "../../WebElement";
import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import ManagementPage from "./ManagementPage";

export default class AddPage extends Content {

  alertMessageDiv = `.alert`;
  contentDescriptionInput = `${htmlElements.input}#description`;
  contentTitleAttrInput = `.RenderTextInput`
  contentAttrsItTab = `${htmlElements.a}#content-attributes-tabs-tab-it`;
  contentTitleAttrInputIt = `attributes[0].values.it`
  contentSaveButton = `${htmlElements.button}#saveopts`;
  contentSaveButtonUl = `${htmlElements.ul}`;
  contentSaveButtonWrapper = `${htmlElements.div}.StickySave__row--top`;
  contentSaveButtonSaveAction = `${htmlElements.li}`;
  contentAttrEnPane = `${htmlElements.div}#content-attributes-tabs-pane-en`;
  contentAttrItPane = `${htmlElements.div}#content-attributes-tabs-pane-it`;

  getAlertMessage() {
    return this.getRoot().find(this.alertMessageDiv);
  }

  getTitleAttrItInput() {
    return this.getContents().get(this.contentAttrItPane)
               .find(this.contentTitleAttrInput).eq(0);
  }

  getTitleAttrEnInput() {
    return this.getContents().get(this.contentAttrEnPane)
               .find(this.contentTitleAttrInput).eq(0);
  }

  getDescriptionInput() {
    return this.getContents()
               .find(this.contentDescriptionInput);
  }

  getItLanguageTab() {
    return this.getContents().find(this.contentAttrsItTab);
  }

  getSaveButton() {
    this.getContents().find(this.contentSaveButton).click();
    return this.getContents().get(this.contentSaveButtonWrapper).find(this.contentSaveButtonUl).eq(0)
      .find(this.contentSaveButtonSaveAction).eq(0);
  }

  typeAttrTitleIt(input) {
    this.getTitleAttrItInput().type(input);
  }

  typeAttrTitleEn(input) {
    this.getTitleAttrEnInput().type(input);
  }

  typeDescription(input) {
    this.getDescriptionInput().type(input);
  }

  clearDescription() {
    this.getDescriptionInput().clear();
  }

  submitForm() {
    this.getSaveButton().click();
  }

  addContent(titleEn, titleIt, description, append = false) {
    if (!append) {
      this.clearDescription();
    }
    this.typeDescription(description);
    this.typeAttrTitleEn(titleEn);
    this.getItLanguageTab().click();
    this.typeAttrTitleIt(titleIt);
    this.submitForm();
    cy.wait(1000);
    return new AppPage(ManagementPage);
  }

}
