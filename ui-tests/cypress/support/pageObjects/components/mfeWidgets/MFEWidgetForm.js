import 'cypress-file-upload';

import { TEST_ID_KEY, htmlElements } from '../../WebElement';

import Content from '../../app/Content';


import AppPage from '../../app/AppPage';
import DesignerPage from '../../pages/designer/DesignerPage';

export default class MFEWidgetForm extends Content {

  cloneMode = false;

  pageTopControl = `${htmlElements.div}.WidgetPage__top`;
  formConfigSection = `${htmlElements.div}.WidgetForm__container`;
  formInfoSection = `${htmlElements.div}.WidgetForm__info`;
  configTabs = `${htmlElements.div}#basic-tabs ${htmlElements.ul}[role=tablist]`;
  iconUploadInput = `${htmlElements.input}[type="file"][${TEST_ID_KEY}=common_IconUploader_input]`;
  enTitleInput = `${htmlElements.input}[name="titles.en"][${TEST_ID_KEY}=form_RenderTextInput_input]`;
  itTitleInput = `${htmlElements.input}[name="titles.it"][${TEST_ID_KEY}=form_RenderTextInput_input]`;
  codeInput = `${htmlElements.input}[name="code"][${TEST_ID_KEY}=form_RenderTextInput_input]`;
  groupInput = `${htmlElements.div}[${TEST_ID_KEY}=group-typeahead]`;
  customUiInput = `textarea[name="customUi"][${TEST_ID_KEY}=form_RenderTextAreaInput_textarea]`;
  saveReplaceButton = `${htmlElements.button}[type=submit]`;
  formLabelSpan = `${htmlElements.span}[${TEST_ID_KEY}=form_FormLabel_span]`;

  get isCloneMode() {
    return this.cloneMode;
  }

  set isCloneMode(mode) {
    this.cloneMode = mode;
  }

  getFormBody() {
    return this.getContents()
      .find('form');
  }

  getTopControl() {
    return this.getContents()
      .find(this.pageTopControl);
  }

  getFormConfigSection() {
    return this.getFormBody()
      .find(this.formConfigSection);
  }

  getFormInfoArea() {
    return this.getFormBody()
      .find(this.formInfoSection);
  }

  getSaveReplaceButton() {
    return this.getTopControl()
      .find(this.saveReplaceButton);
  }

  submitCloneWidget() {
    this.getSaveReplaceButton().click();
    return new AppPage(DesignerPage);
  }

  getTitleInput(lang = 'en') {
    return this.getFormBody()
      .find(lang === 'it' ? this.itTitleInput : this.enTitleInput);
  }

  getCodeInput() {
    return this.getFormBody()
               .find(this.codeInput);
  }

  getCustomUiInput() {
    return this.getFormBody()
               .find(this.customUiInput);
  }

  getGroupDropdown() {
    return this.getFormBody()
              .find(this.groupInput);
  }

  getConfigTabs() {
    return this.getFormConfigSection()
      .find(this.configTabs);
  }

  getConfigTabConfiguration() {
    return this.getConfigTabs()
      .find(htmlElements.li).eq(1);
  }

  getConfigTabConfigUI() {
    return this.getConfigTabs()
      .find(htmlElements.li).eq(0);
  }

  getIconUpload() {
    return this.getFormBody()
              .find(this.iconUploadInput);
  }

  getSaveButton() {
    return this.getFormBody()
               .find(this.saveButton);
  }

  fillWidgetForm(
    name = 'My Widget',
    code = 'my_widget',
    customUi = '<h1>Just a basic widget</h1>',
    group = 'Administrators',
  ) {
    this.getIconUpload().attachFile('icon/Entando.svg');
    cy.wait(500);
    this.getTitleInput().type(name);
    this.getTitleInput('it').type(name);
    this.getCodeInput().clear();
    this.getCodeInput().type(code);
    this.getGroupDropdown().click();
    this.getGroupDropdown().contains(group).click();
    if (customUi) {
      this.getCustomUiInput().type(customUi);
    }
  }

  getParentTypeLabel() {
    this.getFormInfoArea()
      .contains('Parent Type');
  }

  getParentType() {
    this.getParentTypeLabel()
      .closest(htmlElements.div)
      .next().children(this.formLabelSpan).innerText;
  }

  submitForm() {
    this.getSaveButton().click();
  }
}