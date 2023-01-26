import {htmlElements} from '../../WebElement';

import LanguagesAndLabelsPage from './LanguagesAndLabelsPage';

import AppPage      from '../../app/AppPage';
import DeleteDialog from '../../app/DeleteDialog';
import KebabMenu    from '../../app/KebabMenu';

import LabelPage     from './LabelPage';
import LanguagesPage from './LanguagesPage';

export default class SystemLabelsPage extends LanguagesAndLabelsPage {

  labelSearchFormArea  = `${htmlElements.form}.LabelSearchForm`;
  labelSearchFormField = `${htmlElements.input}[name=key]#text`;
  searchFormSubmit     = `${htmlElements.button}[type=submit]`;

  labelsAddButton = `${htmlElements.button}[type=button].LabelsAndLanguagesPage__add-label`;

  labelsTable                          = `${htmlElements.div}#labels-tabs`;
  labelsPaginationForm                 = `${htmlElements.form}.content-view-pf-pagination`;
  labelsPaginationFormCurrentPageRange = `${htmlElements.span}.pagination-pf-items-current`;
  labelsPaginationFormLabelsTotal      = `${htmlElements.span}.pagination-pf-items-total`;
  labelsPaginationFormPageSelector     = `${htmlElements.input}[type=text].pagination-pf-page`;
  labelsPaginationFormPageTotal        = `${htmlElements.span}.pagination-pf-pages`;
  labelsPaginationFormForwardButtons   = `${htmlElements.ul}.pagination-pf-forward`;
  labelsPaginationFormPreviousButtons  = `${htmlElements.ul}.pagination-pf-back`;

  static changePage(page) {
    cy.languagesController().then(controller => controller.intercept({method: 'GET'}, 'languagesPageLoadingGET', '?*'));
    cy.labelsController().then(controller => controller.intercept({method: 'GET'}, 'systemLabelsPageLoadingGET', '?*'));
    cy.realType(`${page}{enter}`);
    cy.wait(['@languagesPageLoadingGET', '@systemLabelsPageLoadingGET']);
  }

  static searchPage(button, search) {
    cy.labelsController().then(controller => controller.intercept({method: 'GET'}, 'systemLabelsPageLoadingGET', `?filters%5B0%5D.attribute=key&filters%5B0%5D.operator=like&filters%5B0%5D.value=${search}*`));
    if (button) cy.get(button).click();
    else cy.realType('{enter}');
    cy.wait('@systemLabelsPageLoadingGET');
  }

  openSystemLabels() {
    this.getSystemLabelsTab().click();
    return cy.wrap(new AppPage(SystemLabelsPage)).as('currentPage');
  }

  openLanguages() {
    this.getLanguagesTab().click();
    return cy.wrap(new AppPage(LanguagesPage)).as('currentPage');
  }

  getLabelSearchFormArea() {
    return this.getContents().find(this.labelSearchFormArea);
  }

  getLabelSearchInput() {
    return this.getLabelSearchFormArea().find(this.labelSearchFormField);
  }

  getSearchSubmitButton() {
    return this.getLabelSearchFormArea().find(this.searchFormSubmit);
  }

  getAddLabelButton() {
    return this.getContents().find(this.labelsAddButton);
  }

  getLabelsTable() {
    return this.getContents()
               .find(this.labelsTable)
               .parent();
  }

  getLabelsTableLanguageTabs() {
    return this.getLabelsTable().children(this.labelsTable)
               .children(`${htmlElements.ul}[role=tablist]`);
  }

  getLabelsTableDisplayedLanguageTab() {
    return this.getLabelsTableLanguageTabs()
               .children(`${htmlElements.li}.active`)
               .children(htmlElements.a);
  }

  getLabelsTableTables() {
    return this.getLabelsTable().children(this.labelsTable)
               .children(`${htmlElements.div}.tab-content`);
  }

  getLabelsTableDisplayedTable() {
    return this.getLabelsTableTables()
               .children(`${htmlElements.div}.active`)
               .find(htmlElements.table);
  }

  getLabelsTableDisplayedTableHeaders() {
    return this.getLabelsTableDisplayedTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getTableRows() {
    return this.getLabelsTableDisplayedTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableRowByCode(code) {
    return this.getKebabMenu(code).get()
               .closest(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new LabelsKebabMenu(this, code);
  }

  getLabelsTablePaginationForm() {
    return this.getLabelsTable()
               .children(this.labelsPaginationForm);
  }

  getLabelsTablePaginationFormPageSizeDropdown() {
    return this.getLabelsTablePaginationForm()
               .find(`${htmlElements.button}#pagination-row-dropdown`);
  }

  getLabelsTablePaginationFormCurrentPageRange() {
    return this.getLabelsTablePaginationForm()
               .find(this.labelsPaginationFormCurrentPageRange);
  }

  getLabelsTablePaginationFormLabelsTotal() {
    return this.getLabelsTablePaginationForm()
               .find(this.labelsPaginationFormLabelsTotal);
  }

  getLabelsTablePaginationFormPreviousButtons() {
    return this.getLabelsTablePaginationForm().find(this.labelsPaginationFormPreviousButtons);
  }

  getLabelsTablePaginationFormPreviousButton() {
    return this.getLabelsTablePaginationFormPreviousButtons()
               .children(htmlElements.li).eq(1);
  }

  getLabelsTablePaginationFormFirstButton() {
    return this.getLabelsTablePaginationFormPreviousButtons()
               .children(htmlElements.li).eq(0);
  }

  getLabelsTablePaginationFormPageSelector() {
    return this.getLabelsTablePaginationForm()
               .find(this.labelsPaginationFormPageSelector);
  }

  getLabelsTablePaginationFormPageTotal() {
    return this.getLabelsTablePaginationForm()
               .find(this.labelsPaginationFormPageTotal);
  }

  getLabelsTablePaginationFormForwardButtons() {
    return this.getLabelsTablePaginationForm().find(this.labelsPaginationFormForwardButtons);
  }

  getLabelsTablePaginationFormNextButton() {
    return this.getLabelsTablePaginationFormForwardButtons()
               .children(htmlElements.li).eq(0);
  }

  getLabelsTablePaginationFormLastButton() {
    return this.getLabelsTablePaginationFormForwardButtons()
               .children(htmlElements.li).eq(1);
  }

  clickSearchSubmitButton() {
    this.getLabelSearchInput().invoke('val')
        .then(search => this.getSearchSubmitButton().then(button => SystemLabelsPage.searchPage(button, search)));
    return cy.wrap(new AppPage(SystemLabelsPage)).as('currentPage');
  }

  performLabelSearchInput() {
    this.getLabelSearchInput().invoke('val')
        .then(search => SystemLabelsPage.searchPage(null, search));
    return cy.wrap(new AppPage(SystemLabelsPage)).as('currentPage');
  }

  openAddLabel() {
    this.getAddLabelButton().then(button => LabelPage.openPage(button));
    return cy.wrap(new AppPage(LabelPage)).as('currentPage');
  }

  navigateToFirstPage() {
    this.getLabelsTablePaginationFormFirstButton().then(button => LanguagesAndLabelsPage.openPage(button));
    return cy.wrap(new AppPage(SystemLabelsPage)).as('currentPage');
  }

  navigateToPreviousPage() {
    this.getLabelsTablePaginationFormPreviousButton().then(button => LanguagesAndLabelsPage.openPage(button));
    return cy.wrap(new AppPage(SystemLabelsPage)).as('currentPage');
  }

  navigateToPage(page) {
    this.getLabelsTablePaginationFormPageSelector().clear()
        .then(() => SystemLabelsPage.changePage(page));
    return cy.wrap(new AppPage(SystemLabelsPage)).as('currentPage');
  }

  navigateToNextPage() {
    this.getLabelsTablePaginationFormNextButton().then(button => LanguagesAndLabelsPage.openPage(button));
    return cy.wrap(new AppPage(SystemLabelsPage)).as('currentPage');
  }

  navigateToLastPage() {
    this.getLabelsTablePaginationFormLastButton().then(button => LanguagesAndLabelsPage.openPage(button));
    return cy.wrap(new AppPage(SystemLabelsPage)).as('currentPage');
  }

}

class LabelsKebabMenu extends KebabMenu {

  getDropdown() {
    return this.get()
               .children(`${htmlElements.ul}.dropdown-menu`);
  }

  getEdit() {
    return this.getDropdown()
               .children(`${htmlElements.li}.LabelListMenuAction__menu-item-edit`);
  }

  getDelete() {
    return this.getDropdown()
               .children(`${htmlElements.li}.LabelListMenuAction__menu-item-delete`);
  }

  openEdit() {
    this.getEdit().then(button => LabelPage.openPage(button, this.code));
    return cy.wrap(new AppPage(LabelPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}
