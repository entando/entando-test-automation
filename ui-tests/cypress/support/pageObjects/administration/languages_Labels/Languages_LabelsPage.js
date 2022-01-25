import Content from '../../app/Content.js';
import { DATA_TESTID, htmlElements } from '../../WebElement.js';
import DeleteDialog from '../../app/DeleteDialog.js';
export default class Languages_LabelsPage extends Content {
  getLanguageLabelTabArea() {
    return this.get()
      .find(`[${DATA_TESTID}=list_LabelsAndLanguagesPage_ul]`);
  }

  getLanguagesTab() {
    return this.getLanguageLabelTabArea()
      .children('li').eq(0).children('a');
  }

  getLabelsTab() {
    return this.getLanguageLabelTabArea()
      .children('li').eq(1).children('a');
  }

  chooseLanguagesTab() {
    return this.getLanguagesTab().click();
  }

  chooseLabelsTab() {
    return this.getLabelsTab().click();
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
}
