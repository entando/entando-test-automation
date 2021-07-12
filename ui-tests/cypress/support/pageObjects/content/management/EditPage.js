import {htmlElements} from "../../WebElement";
import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import ManagementPage from "./ManagementPage";

export default class EditPage extends Content {

  alertMessageDiv = `.alert`;
  contentDescriptionInput = `${htmlElements.input}#description`;
  contentSaveButton = `${htmlElements.button}#saveopts`;
  contentSaveButtonUl = `${htmlElements.ul}`;
  contentSaveButtonWrapper = `${htmlElements.div}.StickySave__row--top`;
  contentSaveButtonSaveAction = `${htmlElements.li}`;

  getAlertMessage() {
    return this.getRoot().find(this.alertMessageDiv);
  }

  getDescriptionInput() {
    return this.getContents()
               .find(this.contentDescriptionInput);
  }

  getSaveButton() {
    this.getContents().find(this.contentSaveButton).click();
    return this.getContents().get(this.contentSaveButtonWrapper).find(this.contentSaveButtonUl).eq(0)
      .find(this.contentSaveButtonSaveAction).eq(0);
  }

  typeDescription(input) {
    this.getDescriptionInput().type(input);
  }

  submitForm() {
    this.getSaveButton().click();
  }

  clearDescription() {
    this.getDescriptionInput().clear();
  }

  editContent(description, append = false) {
    if (!append) {
      this.clearDescription();
    }
    this.typeDescription(description);
    this.submitForm();
    cy.wait(1000);
    return new AppPage(ManagementPage);
  }

}
