import Content from '../../app/Content';
import AppPage from '../../app/AppPage';
import TemplatesPage from '../../pages/templates/TemplatesPage';
import { DATA_TESTID, htmlElements } from '../../WebElement';

export default class AddPage extends Content {
  codeInput = `${htmlElements.input}[name="code"][${DATA_TESTID}=formik-field_RenderTextInput_input]`;
  nameInput = `${htmlElements.input}[name="descr"][${DATA_TESTID}=formik-field_RenderTextInput_input]`;
  jsonConfigDiv = `[${DATA_TESTID}=formik-field_JsonCodeEditorRenderer_div]`;
  templateDiv = `[${DATA_TESTID}=formik-field_HtmlCodeEditorRenderer_div]`;
  formRowDiv = `[${DATA_TESTID}=common_PageTemplateForm_Row]`;
  cancelButton = `[${DATA_TESTID}=common_PageTemplateForm_Button]`;
  saveDropdownContainer = `${htmlElements.div}.dropdown]`;
  saveDropdownButton    = `${htmlElements.button}[${DATA_TESTID}=common_PageTemplateForm_DropdownButton]`;
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

  getJsonConfigInput() {
    return this.getFormArea()
               .find(this.jsonConfigDiv)
               .find(htmlElements.textarea);
  }

  getTemplateInput() {
    return this.getFormArea()
               .find(this.templateDiv)
               .find(htmlElements.textarea);
  }

  typeName(input) {
    this.getNameInput().type(input);
  }

  typeCode(input) {
    this.getCodeInput().type(input);
  }

  typeJsonConfig(input) {
    this.getJsonConfigInput().type(input);
  }

  typeTemplate(input) {
    this.getTemplateInput().type(input);
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