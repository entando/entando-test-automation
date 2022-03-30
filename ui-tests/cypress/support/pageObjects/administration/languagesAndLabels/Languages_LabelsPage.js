import AddLabelPage   from './AddLabelPage';
import AppPage        from '../../app/AppPage';
import Content        from '../../app/Content';
import DeleteDialog   from '../../app/DeleteDialog';
import {htmlElements} from '../../WebElement';
import KebabMenu      from '../../app/KebabMenu';

export default class Languages_LabelsPage extends Content {

  languageNavigation = `${htmlElements.ul}[role=tablist].nav-tabs`;
  languageForm       = `${htmlElements.form}.LanguageForm`;
  languageTable      = `${htmlElements.table}.ActiveLangTable__table`;

  labelsTabLink        = `${htmlElements.a}[role=menuitem]`;
  labelSearchFormField = `${htmlElements.input}[name=key]#text`;
  labelSearchFormArea  = `${htmlElements.form}.LabelSearchForm`;
  searchFormSubmit     = `${htmlElements.button}.btn-primary`;
  displayedLabelRow    = `${htmlElements.tr}.LabelsTable__label-row`;
  displayedLabelsTable = `${htmlElements.table}.LabelsTable__table`;
  displayedLabelsTab   = `${htmlElements.div}[id=labels-tabs-pane-0]`;
  labelsAddButton      = `${htmlElements.button}[type=button].LabelsAndLanguagesPage__add-label`;
  labelPaginationForm  = `${htmlElements.form}.content-view-pf-pagination`;
  labelPaginationInput = `${htmlElements.input}[type=text].pagination-pf-page`;
  labelForwardButtons  = `${htmlElements.ul}.pagination-pf-forward`;
  labelBackButtons     = `${htmlElements.ul}.pagination-pf-back`;
  
  getLanguagesTabLink() {
    return this.getContents().find(this.labelsTabLink).eq(0);
  }

  getLabelsTabLink() {
    return this.getContents().find(this.labelsTabLink).eq(1);
  }

  //LANGUAGES

  getAddLanguageForm() {
    return this.get().find(this.languageForm);
  }

  getLanguageDropdown() {
    return this.getAddLanguageForm()
      .find(`${htmlElements.select}[name=language]`);
  }

  getSelectedLanguageFromDropdown() {
    return this.getAddLanguageForm()
      .find(`${htmlElements.select}[name=language] option:selected`);
  }

  getLanguageFromDropdownByCode(code) {
    return this.getLanguageDropdown()
      .children(`${htmlElements.option}[value=${code}]`);
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
    return this.get().find(this.languageTable);
  }

  getLanguageTableHeaders() {
    return this.getLanguageTable().children(htmlElements.thead).find(htmlElements.th);
  }

  getLanguageTableRows() {
    return this.getLanguageTable()
      .find(`${htmlElements.tr}.ActiveLangTable__tr`);
  }

  getLanguageRowByIndex(index) {
    return this.getLanguageTableRows()
      .eq(index);
  }

  getDeleteLanguageByIndex(index) {
    return this.getLanguageRowByIndex(index)
      .find(`${htmlElements.button}.ActiveLangTable__delete-tag-btn`);
  }

  clickDeleteLanguageByIndex(index) {
    this.getDeleteLanguageByIndex(index).click();
    this.parent.getDialog().setBody(DeleteDialog);
  }

  //LABELS

  getLabelSearchFormArea() {
    return this.getContents().find(this.labelSearchFormArea);
  }

  getLabelSearchForm() {
    return this.getLabelSearchFormArea().find(this.labelSearchFormField);
  }

  getSearchSubmitButton() {
    return this.getLabelSearchFormArea().find(this.searchFormSubmit);
  }

  getAddLabelButton() {
    return this.getContents().find(this.labelsAddButton);
  }

  openAddLabel() {
    this.getAddLabelButton().click();
    return new AppPage(AddLabelPage);
  }

  getDisplayedLabelsTab() {
    return this.getContents().find(this.displayedLabelsTab);
  }

  getDisplayedLabelsTable() {
    return this.getDisplayedLabelsTab().find(this.displayedLabelsTable);
  }

  getLabelsTableHeaders() {
    return this.getDisplayedLabelsTable().children(htmlElements.thead).find(htmlElements.th);
  }


  getDisplayedLabelsCount() {
    return this.getDisplayedLabelsTable().find(this.displayedLabelRow);
  }

  getActiveLanguageSelector() {
    return this.getContents().find(this.languageNavigation);
  }

  getLabelPaginationForm() {
    return this.getContents().find(this.labelPaginationForm);
  }

  getLabelPaginationTextArea() {
    return this.getLabelPaginationForm().find(this.labelPaginationInput);
  }

  getActionsButtonByCode(code) {
    return this.getDisplayedLabelsCount()
      .find(`${htmlElements.button}#${code}-actions`);
  }

  getLabelRowByCode(code) {
    return this.getActionsButtonByCode(code)
      .closest(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new LabelsKebabMenu(this, code);
  }

  getLabelForwardButtons() {
    return this.getLabelPaginationForm().find(this.labelForwardButtons);
  }

  getLabelNextButton() {
    return this.getLabelForwardButtons().children().eq(0);
  }

  getLabelLastPageButton() {
    return this.getLabelForwardButtons().children().eq(1);
  }

  getLabelBackButtons() {
    return this.getLabelPaginationForm().find(this.labelBackButtons);
  }

  getLabelPreviousButton() {
    return this.getLabelBackButtons().children().eq(1);
  }

  getLabelFirstPageButton() {
    return this.getLabelBackButtons().children().eq(0);
  }

  navigateToLabelListPage(page) {
    this.getLabelPaginationTextArea().clear();
    this.getLabelPaginationTextArea().type(`${page}{enter}`);
  }
}

class LabelsKebabMenu extends KebabMenu {

  get() {
    return this.parent.getLabelRowByCode(this.code)
      .find(htmlElements.div);
  }

  getDropdown() {
    return this.get()
      .find(`${htmlElements.ul}.dropdown-menu`);
  }

  getEdit() {
    return this.get()
      .find(`${htmlElements.li}[data-id=edit-${this.code}]`);
  }

  getDelete() {
    return this.get()
      .find(`${htmlElements.li}.LabelListMenuAction__menu-item-delete`);
  }

  openEdit() {
    this.getEdit().click();
    return new AppPage(AddLabelPage);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
  }

}
