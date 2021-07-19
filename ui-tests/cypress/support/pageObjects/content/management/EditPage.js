import {htmlElements} from "../../WebElement";
import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import ManagementPage from "./ManagementPage";
import DropDownButton from "./DropDownButton";

export default class EditPage extends Content {

  contentDescriptionInput = `${htmlElements.input}#description`;

  getDescriptionInput() {
    return this.getContents()
               .find(this.contentDescriptionInput);
  }

  getSaveDropDownButton() {
    return new DropDownButton(this);
  }

  getSaveDropDownListItems() {
    return this.getSaveDropDownButton().open();
  }

  getSaveAction() {
    // 0 is the Save action number
    return this.getSaveDropDownListItems().get(0);
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
