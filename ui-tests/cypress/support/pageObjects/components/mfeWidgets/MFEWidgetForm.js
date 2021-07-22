import 'cypress-file-upload';

import { DATA_TESTID, htmlElements } from '../../WebElement';

import Content from '../../app/Content';


import AppPage from '../../app/AppPage';
import DesignerPage from '../../pages/designer/DesignerPage';
import MFEWidgetsPage from './MFEWidgetsPage';

export default class MFEWidgetForm extends Content {

  cloneMode = false;

  pageTopControl = `${htmlElements.div}.WidgetPage__top`;
  formConfigSection = `${htmlElements.div}.WidgetForm__container`;
  formInfoSection = `${htmlElements.div}.WidgetForm__info`;
  configTabs = `${htmlElements.div}#basic-tabs ${htmlElements.ul}[role=tablist]`;
  iconUploadInput = `${htmlElements.input}[type="file"][${DATA_TESTID}=common_IconUploader_input]`;
  enTitleInput = `${htmlElements.input}[name="titles.en"][${DATA_TESTID}=form_RenderTextInput_input]`;
  itTitleInput = `${htmlElements.input}[name="titles.it"][${DATA_TESTID}=form_RenderTextInput_input]`;
  codeInput = `${htmlElements.input}[name="code"][${DATA_TESTID}=form_RenderTextInput_input]`;
  groupInput = `${htmlElements.div}[${DATA_TESTID}=group-typeahead]`;
  customUiInput = `textarea[name="customUi"][${DATA_TESTID}=form_RenderTextAreaInput_textarea]`;
  saveDropdownContainer = `${htmlElements.div}.FragmentForm__dropdown[${DATA_TESTID}=common_WidgetForm_div]`;
  saveDropdownButton = `${htmlElements.button}[${DATA_TESTID}=common_WidgetForm_DropdownButton]`;
  saveReplaceButton = `${htmlElements.button}[type=submit]`;
  regularSaveButton = `${htmlElements.a}#regularSaveButton`;
  continueSaveButton = `${htmlElements.a}#continueSaveButton`;
  formLabelSpan = `${htmlElements.span}[${DATA_TESTID}=form_FormLabel_span]`;

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

  getSaveDropdown() {
    return this.getTopControl()
      .find(this.saveDropdownContainer);
  }

  getSaveDropdownButton() {
    return this.getSaveDropdown()
        .find(this.saveDropdownButton);
  }

  getSaveDropdownMenu() {
    return this.getSaveDropdown()
        .find('[role=menu]');
  }

  getRegularSaveButton() {
    return this.getSaveDropdownMenu()
        .find(this.regularSaveButton);
  }

  getContinueSaveButton() {
    return this.getSaveDropdownMenu()
        .find(this.continueSaveButton);
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

  editFormFields(payload) {
    const fields = Object.keys(payload);
    fields.forEach((field) => {
      if (payload[field] === '') {
        return;
      }
      switch(field) {
        case 'name':
          this.getTitleInput().clear();
          this.getTitleInput().type(payload[field]);
          this.getTitleInput('it').clear();
          this.getTitleInput('it').type(payload[field]);
          break;
        case 'code':
          this.getCodeInput().clear();
          this.getCodeInput().type(payload[field]);
          break;
        case 'group':
          this.getGroupDropdown().click();
          this.getGroupDropdown().contains(payload[field]).click();
          break;
        case 'customUi':
          this.getCustomUiInput().type(payload[field]);
          break;
        case 'iconUpload':
          this.getIconUpload().attachFile(payload[field]);
          cy.wait(500);
          break;
      }
    });
  }

  fillWidgetForm(
    name = 'My Widget',
    code = 'my_widget',
    customUi = '<h1>Just a basic widget</h1>',
    group = 'Administrators',
  ) {
    this.editFormFields({ iconUpload: 'icon/Entando.svg', name, code, group, customUi });
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
    this.getSaveDropdownButton().click();
    this.getRegularSaveButton().click();
    return new AppPage(MFEWidgetsPage);
  }
}
