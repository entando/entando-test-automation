import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';


import AppPage         from '../../app/AppPage';
import DesignerPage    from '../../pages/designer/DesignerPage';
import MFEWidgetsPage  from './MFEWidgetsPage';
import {DialogContent} from '../../app/Dialog';

export default class MFEWidgetForm extends AppContent {

  cloneMode = false;

  pageTopControl        = `${htmlElements.div}.WidgetPage__top`;
  formConfigSection     = `${htmlElements.div}.WidgetForm__container`;
  formInfoSection       = `${htmlElements.div}.WidgetForm__info`;
  configTabs            = `${htmlElements.div}#basic-tabs ${htmlElements.ul}[role=tablist]`;
  iconFieldContainer    = `${htmlElements.div}.IconUploader__container`;
  iconUploadInput       = `${htmlElements.input}[type="file"]`;
  iconFieldInnerDiv     = `${htmlElements.div}`;
  iconList              = `${htmlElements.div}.IconLibrary__icon-list`;
  enTitleInput          = `${htmlElements.input}[name="titles.en"]`;
  itTitleInput          = `${htmlElements.input}[name="titles.it"]`;
  codeInput             = `${htmlElements.input}[name="code"]`;
  groupInput            = `${htmlElements.div}.DropdownTypeahead ${htmlElements.div}.rbt`;
  customUiInput         = `textarea[name="customUi"].RenderTextAreaInput-textarea`;
  saveDropdownContainer = `${htmlElements.div}.FragmentForm__dropdown`;
  saveDropdownButton    = `${htmlElements.button}#saveopts`;
  saveReplaceButton     = `${htmlElements.button}[type=submit]`;
  regularSaveButton     = `${htmlElements.a}#regularSaveButton`;
  continueSaveButton    = `${htmlElements.a}#continueSaveButton`;
  formLabelSpan         = `${htmlElements.span}.FormLabel`;

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

  getIconChooseButton() {
    return this.getFormBody()
               .find(this.iconFieldContainer)
               .children(this.iconFieldInnerDiv).eq(1)
               .children(htmlElements.button).eq(0);
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
      switch (field) {
        case 'name':
          this.getTitleInput().clear();
          this.getTitleInput().type(payload[field]);
          this.getTitleInput('it').clear();
          this.getTitleInput('it').type(payload[field]);
          break;
        case 'names.en':
          this.getTitleInput().clear();
          this.getTitleInput().type(payload[field]);
          break;
        case 'names.it':
          this.getTitleInput('it').clear();
          this.getTitleInput('it').type(payload[field]);
          break;
        case 'code':
          this.getCodeInput().clear();
          this.getCodeInput().type(payload[field]);
          break;
        case 'group':
          this.getGroupDropdown().click();
          this.getGroupDropdown().contains(payload[field]).click({ force: true });
          break;
        case 'customUi':
          this.getCustomUiInput().type(payload[field]);
          break;
        case 'iconUpload':
          this.getIconUpload().selectFile(payload[field], {force: true});
          break;
        case 'iconChoose':
          this.getIconChooseButton().click();
          this.parent.getDialog().setBody(DialogContent);
          this.parent.getDialog().getBody()
              .get().find(this.iconList).contains(payload[field]).click();
          this.parent.getDialog().confirm();
          break;
      }
    });
  }

  fillWidgetForm(
      name     = 'My Widget',
      code     = 'my_widget',
      customUi = '<h1>Just a basic widget</h1>',
      group    = 'Administrators'
  ) {
    this.editFormFields({iconUpload: 'cypress/fixtures/icon/Entando.svg', name, code, group, customUi});
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

  submitContinueForm() {
    this.getSaveDropdownButton().click();
    this.getContinueSaveButton().click();
  }
}
