import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import AppPage       from '../../app/AppPage';
import TemplatesPage from '../../pages/templates/TemplatesPage';

export default class AddPage extends AppContent {
  codeInput             = `${htmlElements.input}[name="code"]#code`;
  nameInput             = `${htmlElements.input}[name="descr"]#descr`;
  codeMirrorDiv         = `${htmlElements.div}.form-group`;
  codeMirror            = `${htmlElements.div}.CodeMirror`;
  formRowDiv            = `${htmlElements.div}.row`;
  cancelButton          = `${htmlElements.button}.UserForm__action-button`;
  saveDropdownContainer = `${htmlElements.div}.dropdown`;
  saveDropdownButton    = `${htmlElements.button}#saveopts`;
  regularSaveButton     = `${htmlElements.a}#regularSaveButton`;
  continueSaveButton    = `${htmlElements.a}#continueSaveButton`;
  previewGrid           = `${htmlElements.div}.PageConfigGridCol.PageConfigGridCol--container`;

  static openEditClonePage(button, code) {
    cy.pageTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'templateLoadingGET', `/${code}`));
    if (button) cy.get(button).click();
    else cy.realType('{enter}');
    cy.wait('@templateLoadingGET');
  }

  getFormArea() {
    return this.getContents()
               .find(htmlElements.form);
  }

  getFormFieldRows() {
    return this.getFormArea()
               .children(this.formRowDiv);
  }

  getNameInput() {
    return this.getFormArea()
               .find(this.nameInput);
  }

  getCodeInput() {
    return this.getFormArea()
               .find(this.codeInput);
  }

  getJsonConfigArea() {
    return this.getFormArea()
               .children(htmlElements.div).eq(1)
               .find(this.codeMirrorDiv);
  }

  getJsonConfigInput() {
    return this.getJsonConfigArea()
               .find(this.codeMirror);
  }

  getTemplateInput() {
    return this.getFormArea()
               .children(htmlElements.div).eq(2)
               .find(this.codeMirrorDiv)
               .find(this.codeMirror);
  }

  getPreviewGrid() {
    return this.getFormArea()
               .find(this.previewGrid);
  }

  typeName(input) {
    this.getNameInput().type(input);
  }

  typeCode(input) {
    this.getCodeInput().type(input);
  }

  clearJsonConfig() {
    this.getJsonConfigInput().type('{movetoend}');
    cy.realPress(['Meta', 'A']);
    cy.realType('{backspace}');
  }

  typeJsonConfig(input) {
    this.clearJsonConfig();
    this.getJsonConfigInput().type(input, {parseSpecialCharSequences: false});
  }

  getJsonConfigValue() {
    return this.getJsonConfigInput()
        .first()
        .then((editor) => {
          return editor[0].CodeMirror.getValue();
        });
  }

  clearTemplate() {
    this.getTemplateInput().type('{movetoend}');
    cy.realPress(['Meta', 'A']);
    cy.realType('{backspace}');
  }

  typeTemplate(input) {
    this.clearTemplate();
    this.getTemplateInput().type(input, {parseSpecialCharSequences: false});
  }

  getTemplateValue() {
    return this.getTemplateInput()
        .first()
        .then((editor) => {
          return editor[0].CodeMirror.getValue();
        });
  }

  fillForm(data) {
    Object.keys(data).forEach((fieldName) => {
      switch (fieldName) {
        case 'code':
          this.typeCode(data[fieldName]);
          break;
        case 'descr':
          this.typeName(data[fieldName]);
          break;
        case 'configuration':
          this.typeJsonConfig(data[fieldName]);
          break;
        case 'template':
          this.typeTemplate(data[fieldName]);
          break;
        default:
          break;
      }
    });
  }

  getActionRow() {
    return this.getFormFieldRows().eq(4);
  }

  getCancelButton() {
    return this.getActionRow()
               .find(this.cancelButton);
  }

  getSaveDropdown() {
    return this.getActionRow()
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

  submitForm() {
    this.getSaveDropdownButton().click();
    this.getRegularSaveButton().click();
    return new AppPage(TemplatesPage);
  }

}
