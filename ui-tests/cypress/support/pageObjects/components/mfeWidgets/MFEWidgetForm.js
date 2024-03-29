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
  customUiInput         = `${htmlElements.textarea}[name="customUi"].RenderTextAreaInput-textarea`;
  configUiInput         = `${htmlElements.div}.CodeMirror`;
  saveDropdownContainer = `${htmlElements.div}.FragmentForm__dropdown`;
  saveDropdownButton    = `${htmlElements.button}#saveopts`;
  saveReplaceButton     = `${htmlElements.button}[type=submit]`;
  regularSaveButton     = `${htmlElements.a}#regularSaveButton`;
  continueSaveButton    = `${htmlElements.a}#continueSaveButton`;
  formLabelSpan         = `${htmlElements.span}.FormLabel`;

  static openPage(button, code = null, pageCode = null, widgetPos = null, widgetConfig = null) {
    if (!pageCode) {
      !code ? super.loadPage(button, '/widget/add') : super.loadPage(button, `/widget/edit/${code}`, false, true);
    } else {
      super.loadPage(button, `/page/${pageCode}/clone/${widgetPos}/widget/${code}/${widgetConfig}`, false, true);
    }
  }

  get isCloneMode() {
    return this.cloneMode;
  }

  set isCloneMode(mode) {
    this.cloneMode = mode;
  }

  getContents() {
    return this.get()
               .children(`${htmlElements.div}.InternalPage`);
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

  submitCloneWidget(code) {
    this.getSaveReplaceButton().then(button => DesignerPage.openPage(button, code));
    return cy.wrap(new AppPage(DesignerPage)).as('currentPage');
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
               .find(`${htmlElements.a}#basic-tabs-tab-4`)
               .parent();
  }

  clickConfigTabConfiguration(){
    this.getConfigTabConfiguration().click();
    return cy.get('@currentPage');
  }

  getConfigTabConfigUi() {
    return this.getConfigTabs()
               .find(`${htmlElements.a}#basic-tabs-tab-2`)
               .parent();
  }

  clickConfigTabConfigUi() {
    this.getConfigTabConfigUi().click();
    cy.waitForStableDOM();
    return cy.get('@currentPage');
  }

  getConfigUiCodeMirror() {
    return this.getFormConfigSection().find(this.configUiInput);
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
      if ((payload[field] ?? '') === '') return;
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
          this.getGroupDropdown().contains(payload[field]).click({force: true});
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
        case 'configUi':
          this.clickConfigTabConfigUi();
          this.getConfigUiCodeMirror().then(input => this.type(input, payload[field], true, false));
          break;
      }
    });
  }

  fillWidgetForm(name = 'My Widget', code = 'my_widget', customUi = '<h1>Just a basic widget</h1>', group = 'Administrators', configUi = null) {
    this.editFormFields({iconUpload: 'cypress/fixtures/icon/Entando.svg', name, code, group, customUi, configUi});
  }

  getParentTypeLabel() {
    return this.getFormInfoArea()
               .contains('Parent Type');
  }

  getParentType() {
    return this.getParentTypeLabel()
               .closest(htmlElements.div)
               .next().children(this.formLabelSpan).innerText;
  }

  getConfigUiValue() {
    return this.getConfigUiCodeMirror()
               .first()
               .then((editor) => {
                 return editor[0].CodeMirror.getValue();
               });
  }

  clickSave() {
    this.getSaveDropdownButton()
        .then(button => button.click())
        .then(() => this.getRegularSaveButton().click());
    return cy.get('@currentPage');
  }

  submitForm() {
    return this.getSaveDropdownButton()
               .then(button => button.click())
               .then(() => {
                 this.getRegularSaveButton().then(button => MFEWidgetsPage.openPage(button));
                 return cy.wrap(new AppPage(MFEWidgetsPage)).as('currentPage');
               });
  }

  submitContinueForm(code) {
    this.getSaveDropdownButton().click();
    this.getContinueSaveButton()
        .then(button => MFEWidgetForm.openPage(button, code));
    return cy.get('@currentPage');
  }
}
