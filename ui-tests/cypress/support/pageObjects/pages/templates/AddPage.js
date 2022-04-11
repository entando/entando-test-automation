import AppContent from '../../app/AppContent';
import AppPage from '../../app/AppPage';
import TemplatesPage from '../../pages/templates/TemplatesPage';
import { DATA_TESTID, htmlElements } from '../../WebElement';

export default class AddPage extends AppContent {
  codeInput = `${htmlElements.input}[name="code"]#code`;
  nameInput = `${htmlElements.input}[name="descr"]#descr`;
  codeMirrorDiv = `${htmlElements.div}.form-group`
  codeMirror = '.CodeMirror-code';
  formRowDiv = `${htmlElements.div}.row`;
  cancelButton = `[${DATA_TESTID}=common_PageTemplateForm_Button]`;
  saveDropdownContainer = `${htmlElements.div}.dropdown`;
  saveDropdownButton    = `${htmlElements.button}#saveopts`;
  regularSaveButton     = `${htmlElements.a}#regularSaveButton`;
  continueSaveButton    = `${htmlElements.a}#continueSaveButton`;

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
    this.getJsonConfigInput().type(input, { parseSpecialCharSequences: false });
  }

  clearTemplate() {
    this.getTemplateInput().type('{movetoend}');
    cy.realPress(['Meta', 'A']);
    cy.realType('{backspace}');
  }

  typeTemplate(input) {
    this.clearTemplate();
    this.getTemplateInput().type(input, { parseSpecialCharSequences: false });
  }

  fillForm(data) {
    Object.keys(data).forEach((fieldName) => {
      switch(fieldName) {
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
