import {htmlElements} from "../../WebElement";

import Content from "../../app/Content";

import AppPage from "../../app/AppPage";

import EditPage                  from "./EditPage";
import EditListAttributePage     from "./EditListAttributePage";
import EditMonolistAttributePage from "./EditMonolistAttributePage";
import CompositeAttributePage    from "./CompositeAttributePage";

export default class EditAttributePage extends Content {

  nameInput      = `${htmlElements.input}[name="names.en"]`;
  continueButton = `${htmlElements.button}.ContentTypeAttributeForm__continue-btn`;

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getContinueButton() {
    return this.getContents()
               .find(this.continueButton);
  }

  typeName(value) {
    this.getNameInput().type(value);
  }

  clearName() {
    this.getNameInput().clear();
  }

  continue(attribute = "") {
    this.getContinueButton().click();
    cy.wait(1000); // TODO: find a way to avoid waiting for arbitrary time periods
    switch (attribute) {
      case "List":
        return new AppPage(EditListAttributePage);
      case "Monolist":
        return new AppPage(EditMonolistAttributePage);
      case "Composite":
        return new AppPage(CompositeAttributePage);
      default:
        return new AppPage(EditPage);
    }
  }

}
