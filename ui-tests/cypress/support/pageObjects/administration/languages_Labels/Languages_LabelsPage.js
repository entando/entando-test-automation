import Content from '../../app/Content';
import { htmlElements } from '../../WebElement';
import DeleteDialog from '../../app/DeleteDialog';
import AddLabelPage from './AddLabelPage';
import AppPage from '../../app/AppPage';

export default class Languages_LabelsPage extends Content {

  labelsTabLink = `${htmlElements.a}[role=menuitem]`;
  labelSearchFormField = `${htmlElements.input}[name=key]#text`;
  labelSearchFormArea = `${htmlElements.form}.LabelSearchForm`;
  searchFormSubmit = `${htmlElements.button}.btn-primary`;
  displayedLabelRow = `${htmlElements.tr}.LabelsTable__label-row`;
  displayedLabelsTable = `${htmlElements.table}.LabelsTable__table`;
  displayedLabelsTab = `${htmlElements.div}[id=labels-tabs-pane-0]`;
  labelsAddButton = `${htmlElements.button}[type=button].LabelsAndLanguagesPage__add-label`;
  languageNavigation = `${htmlElements.ul}[role=tablist].nav-tabs`;
  labelPaginationForm = `${htmlElements.form}.content-view-pf-pagination`;
  labelPaginationInput = `${htmlElements.input}[type=text].pagination-pf-page`;
  

  //LANGUAGES

  getLanguagesTabLink() {
    return this.getContents().find(this.labelsTabLink).eq(0);
  }

  getLabelsTabLink() {
    return this.getContents().find(this.labelsTabLink).eq(1);
  }

  getLanguageArea() {
    cy.wait(1000); //Wait until the page loads
    return this.get()
      .children(htmlElements.div)
      .children(htmlElements.div).eq(2);
  }

  getAddLanguageForm() {
    return this.getLanguageArea()
      .find(htmlElements.form);
  }

  getLanguageDropdown() {
    return this.getAddLanguageForm()
      .find(`${htmlElements.select}[name=language]`);
  }

  getAddLanguageSubmit() {
    return this.getAddLanguageForm()
      .find(`${htmlElements.button}[type=submit]`);
  }

  addLanguage(code) {
    this.getLanguageDropdown().select(code);
    this.getAddLanguageSubmit().click();
  }

  getLanguageTable() {
    return this.getLanguageArea()
      .find(`${htmlElements.table}.ActiveLangTable__table`);
  }

  getDeleteLanguageByIndex(index) {
    return this.getLanguageTable()
      .find(`${htmlElements.tr}.ActiveLangTable__tr`).eq(index)
      .find(`${htmlElements.button}.ActiveLangTable__delete-tag-btn`)
  }

  clickDeleteLanguageByIndex(index) {
    this.getDeleteLanguageByIndex(index).click();
    this.parent.getDialog().setBody(DeleteDialog);
  }

  //LABELS

  getLabelSearchFormArea() {
    return this.getContents().find(this.labelSearchFormArea)
  }

  getLabelSearchForm() {
    return this.getLabelSearchFormArea().find(this.labelSearchFormField)
  }

  getSearchSubmitButton() {
    return this.getLabelSearchFormArea().find(this.searchFormSubmit)
  }

  getAddLabelButton() {
    return this.getContents().find(this.labelsAddButton);
  }

  openAddLabel() {
    this.getAddLabelButton().click();
    return new AppPage(AddLabelPage);
  }

  getDisplayedLabelsTab() {
    return this.getContents().find(this.displayedLabelsTab)
  }

  getDisplayedLabelsTable() {
    return this.getDisplayedLabelsTab().find(this.displayedLabelsTable)
  }

  getDisplayedLabelsCount() {
    return this.getDisplayedLabelsTable().find(this.displayedLabelRow)
  }

  getActiveLanguageSelector() {
    return this.getContents().find(this.languageNavigation)
  }

  getLabelPaginationForm() {
    return this.getContents().find(this.labelPaginationForm)
  }

  getLabelPaginationTextArea() {
    return this.getLabelPaginationForm().find(this.labelPaginationInput)
  }
}
