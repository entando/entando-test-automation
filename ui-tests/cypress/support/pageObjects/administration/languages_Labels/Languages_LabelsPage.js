import Content from '../../app/Content';
import { DATA_TESTID, htmlElements } from '../../WebElement';
import DeleteDialog from '../../app/DeleteDialog';

export default class Languages_LabelsPage extends Content {

  labelsTabLink = `${htmlElements.a}[${DATA_TESTID}=list_LabelsAndLanguagesPage_MenuItem]`;
  labelSearchFormField = `${htmlElements.input}[${DATA_TESTID}=list_LabelSearchForm_Field]`;
  searchFormSubmit = `${htmlElements.button}[${DATA_TESTID}=list_LabelSearchForm_Button]`;
  displayedLabelRow = `${htmlElements.tr}[${DATA_TESTID}=list_LabelsTable_tr]`;
  displayedLabelsTable = `${htmlElements.table}[${DATA_TESTID}=list_LabelsTable_table]`;
  displayedLabelsTab = `${htmlElements.div}[id=labels-tabs-pane-0]`;

  getLanguagesTabLink() {
    return this.getContents().find(this.labelsTabLink).eq(0);
  }

  getLabelsTabLink() {
    return this.getContents().find(this.labelsTabLink).eq(1);
  }

  getLanguageArea() {
    return this.get()
      .find(`[${DATA_TESTID}=list_LanguageForm_div]`);
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
      .find(`[${DATA_TESTID}=list_ActiveLangTable_table]`);
  }

  getDeleteLanguageByCode(code) {
    return this.getLanguageTable()
      .find(`#ActiveLangTable-delete-${code}`);
  }

  clickDeleteLanguageByCode(code) {
    this.getDeleteLanguageByCode(code).click();
    this.parent.getDialog().setBody(DeleteDialog);
  }

  getLanguageTableRow(code) {
    return this.getDeleteLanguageByCode(code)
      .closest(htmlElements.tr);
  }

  getLabelSearchForm() {
    return this.getContents().find(this.labelSearchFormField)
  }

  getSearchSubmitButton() {
    return this.getContents().find(this.searchFormSubmit)
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
}
