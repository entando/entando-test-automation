import {htmlElements} from '../../WebElement';

import LanguagesAndLabelsPage from './LanguagesAndLabelsPage';

import AppPage      from '../../app/AppPage';
import DeleteDialog from '../../app/DeleteDialog';

import SystemLabelsPage from './SystemLabelsPage';

export default class LanguagesPage extends LanguagesAndLabelsPage {

  languageForm  = `${htmlElements.form}.LanguageForm`;
  languageTable = `${htmlElements.table}.ActiveLangTable__table`;

  openSystemLabels() {
    this.getSystemLabelsTab().click();
    return cy.wrap(new AppPage(SystemLabelsPage)).as('currentPage');
  }

  openLanguages() {
    this.getLanguagesTab().click();
    return cy.wrap(new AppPage(LanguagesPage)).as('currentPage');
  }

  getAddLanguageForm() {
    return this.get().find(this.languageForm);
  }

  getLanguagesDropdown() {
    return this.getAddLanguageForm()
               .find(`${htmlElements.select}[name=language]`);
  }

  getSelectedLanguageFromDropdown() {
    return this.getAddLanguageForm()
               .find(`${htmlElements.select}[name=language] option:selected`);
  }

  getLanguageFromDropdownByCode(code) {
    return this.getLanguagesDropdown()
               .children(`${htmlElements.option}[value=${code}]`);
  }

  getAddLanguageButton() {
    return this.getAddLanguageForm()
               .find(`${htmlElements.button}[type=submit]`);
  }

  getLanguageTable() {
    return this.get().find(this.languageTable);
  }

  getLanguageTableHeaders() {
    return this.getLanguageTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getLanguageTableRows() {
    return this.getLanguageTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  //FIXME the code should not be just text
  getLanguageRowByLanguageCode(code) {
    return this.getLanguageTableRows()
               .children(htmlElements.td).contains(code)
               .closest(htmlElements.tr);
  }

  getLanguageRowByIndex(index) {
    return this.getLanguageTableRows().eq(index);
  }

  getDeleteLanguageByLanguageCode(code) {
    return this.getLanguageRowByLanguageCode(code)
               .find(`${htmlElements.button}.ActiveLangTable__delete-tag-btn`);
  }

  getDeleteLanguageByIndex(index) {
    return this.getLanguageRowByIndex(index)
               .find(`${htmlElements.button}.ActiveLangTable__delete-tag-btn`);
  }

  clickAddLanguageButton() {
    this.getAddLanguageButton().click();
    return cy.get('@currentPage');
  }

  clickDeleteLanguageByLanguageCode(code) {
    this.getDeleteLanguageByLanguageCode(code).click();
    this.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

  addLanguage(code) {
    this.getLanguagesDropdown().select(code);
    this.getAddLanguageButton().click();
    return cy.get('@currentPage');
  }

}
