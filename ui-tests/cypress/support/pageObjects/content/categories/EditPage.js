import {TEST_ID_KEY, htmlElements, WebElement} from "../../WebElement";
import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import CategoriesPage from "./CategoriesPage";

export default class EditPage extends Content {

  titleItInput = `${htmlElements.input}[name="titles.it"][${TEST_ID_KEY}=form_RenderTextInput_input]`;
  titleEnInput = `${htmlElements.input}[name="titles.en"][${TEST_ID_KEY}=form_RenderTextInput_input]`;
  codeInput = `${htmlElements.input}[name="code"][${TEST_ID_KEY}=form_RenderTextInput_input]`;
  saveButton = `${htmlElements.button}[${TEST_ID_KEY}=common_CategoryForm_Button]`;

  getTitleItInput() {
    return this.getContents()
               .find(this.titleItInput);
  }

  getTitleEnInput() {
    return this.getContents()
               .find(this.titleEnInput);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  typeTitleIt(input) {
    this.getTitleItInput().type(input);
  }

  typeTitleEn(input) {
    this.getTitleEnInput().type(input);
  }

  clearTitleIt() {
    this.getTitleItInput().clear();
  }

  clearTitleEn() {
    this.getTitleEnInput().clear();
  }
  typeCode(input) {
    this.getCodeInput().type(input);
  }

  submitForm() {
    this.getSaveButton().click();
  }

  editCategory(titleEn, titleIt, append = false) {
    if (!append){
      this.clearTitleEn();
      this.clearTitleIt();
    }
    this.typeTitleIt(titleIt);
    this.typeTitleEn(titleEn);
    this.submitForm();
    cy.wait(1000);
    return new AppPage(CategoriesPage);
  }

}
