import {htmlElements} from "../../WebElement";
import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import ManagementPage from "./ManagementPage";
import DropDownButton from "./DropDownButton";
import ContentWidgetConfigPage from "../../pages/designer/widgetconfigs/ContentWidgetConfigPage";

export default class AddPage extends Content {

  fromContentWidgetConfig = false;
  contentDescriptionInput = `${htmlElements.input}#description`;
  contentGroupFormBody = `${htmlElements.div}.GroupsFormBody.EditContentForm__outer-fieldset`;
  contentGroupInput = `${htmlElements.div}.DropdownTypeahead`;
  contentTitleAttrInput = `.RenderTextInput`
  contentAttrsItTab = `${htmlElements.a}#content-attributes-tabs-tab-it`;
  contentTitleAttrInputIt = `attributes[0].values.it`
  contentAttrEnPane = `${htmlElements.div}#content-attributes-tabs-pane-en`;
  contentAttrItPane = `${htmlElements.div}#content-attributes-tabs-pane-it`;
  groupsFormSection = `${htmlElements.div}.GroupsFormBody`;

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

  getGroupDropdown() {
    return this.getContents()
              .find(this.contentGroupFormBody)
              .find(this.contentGroupInput).eq(0)
              .children(htmlElements.div).eq(1);
  }

  getItLanguageTab() {
    return this.getContents().find(this.contentAttrsItTab);
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

  getOwnerGroup() {
    return this.getContents()
               .get(this.groupsFormSection)
               .find(htmlElements.input)
               .eq(0);
  }

  getSaveApproveAction() {
    return this.getSaveDropDownListItems().get(2);
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

  clearOwnerGroup() {
    this.getOwnerGroup().clear();
  }

  submitForm() {
    this.getSaveAction().click();
  }

  submitApproveForm() {
    this.getSaveApproveAction().click();
  }

  addContentFromContentWidgetConfig(titleEn, titleIt, description, useApprove = false, group = 'Free Access', append = false) {
    this.fromContentWidgetConfig = true;
    return this.addContent(titleEn, titleIt, description, useApprove, group, append);
  }

  addContent(titleEn, titleIt, description, useApprove = false, group = 'Free Access', append = false) {
    this.getGroupDropdown().click({ scrollBehavior: 'center' });
    cy.wait(500);
    this.getGroupDropdown().contains(group).click({ scrollBehavior: 'center' });
    if (!append) {
      this.clearDescription();
    }

    this.typeDescription(description);
    this.typeAttrTitleEn(titleEn);
    this.getItLanguageTab().click();
    this.typeAttrTitleIt(titleIt);

    if (useApprove) {
      this.submitApproveForm();
    } else {
      this.submitForm();
    }

    cy.wait(1000);
    return new AppPage(this.fromContentWidgetConfig ? ContentWidgetConfigPage : ManagementPage);
  }

}
