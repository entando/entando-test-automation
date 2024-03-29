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

  static openPage(button, code = null, action = null, waitDOM = false) {
    !code ? super.loadPage(button, '/page-template/add', true, waitDOM) : super.loadPage(button, `/page-template/${action}/${code}`, false, waitDOM);
  }

  static editAndContinue(button, code) {
    this.openPage(button, code, 'edit');
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

  typeName(value) {
    this.getNameInput().then(input => {
      return this.type(input, value);
    });
  }

  typeCode(value) {
    this.getCodeInput().then(input => {
      return this.type(input, value);
    });
  }

  clearJsonConfig() {
    this.getJsonConfigInput()
        .first()
        .then((editor) => {
          editor[0].CodeMirror.setValue('');
        });
    return cy.get('@currentPage');
  }

  typeJsonConfig(value) {
    this.clearJsonConfig();
    this.getJsonConfigInput().then(input => {
      return this.type(input, value, true, false);
    });
  }

  getJsonConfigValue() {
    return this.getJsonConfigInput()
        .first()
        .then((editor) => {
          return editor[0].CodeMirror.getValue();
        });
  }

  clearTemplate() {
    this.getTemplateInput()
        .first()
        .then((editor) => {
          editor[0].CodeMirror.setValue('');
        });
    return cy.get('@currentPage');
  }

  typeTemplate(value) {
    this.clearTemplate();
    this.getTemplateInput().then(input => {
      return this.type(input, value, true, false);
    });
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

  submitForm(forbidden = false) {
    this.getSaveDropdownButton().click();
    if (!forbidden) {
      this.getRegularSaveButton().then(button => TemplatesPage.openPage(button));
      return cy.wrap(new AppPage(TemplatesPage));
    } else {
      this.getRegularSaveButton().then(button => AddPage.openPage(button));
      return cy.get('@currentPage');
    }

  }

  submitFormAndContinue(code) {
    this.getSaveDropdownButton().click();
    this.getContinueSaveButton().then(button => AddPage.openPage(button, code, 'edit'));
    return cy.get('@currentPage');
  }

  submitEditFormAndContinue(code) {
    this.getSaveDropdownButton().click();
    this.getContinueSaveButton().then(button => AddPage.editAndContinue(button, code));
    return cy.get('@currentPage');
  }

  openTemplatesUsingBreadCrumb() {
    this.getBreadCrumb().children(htmlElements.li).eq(1).then(element => TemplatesPage.openPage(element, false));
    return cy.wrap(new AppPage(TemplatesPage));
  }

}
