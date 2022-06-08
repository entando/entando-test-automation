import {htmlElements} from '../../../WebElement';

import {DialogContent} from '../../../app/Dialog';

import WidgetConfigPage from '../WidgetConfigPage';
import AdminPage        from '../../../app/AdminPage';
import AddContentPage   from '../../../content/management/AddPage';

export class ContentListSelectModal extends DialogContent {

  contentsTable = `${htmlElements.table}[role="table"].Contents__table-element`;

  getTableRows() {
    return cy.get(`${this.contentsTable} ${htmlElements.tbody} ${htmlElements.tr}`);
  }

  getCheckboxFromTitle(contentTitle) {
    return this.getTableRows()
               .contains(contentTitle)
               .closest(htmlElements.tr)
               .children('td').eq(0)
               .children('input[type=checkbox]');
  }
}

export default class ContentWidgetConfigPage extends WidgetConfigPage {

  addButtonArea  = `${htmlElements.div}.SingleContentConfigFormBody__addButtons`;
  buttonClass    = `${htmlElements.button}.btn.btn-primary`;
  buttonDropdown = `${htmlElements.div}.dropdown.btn-group-primary`;
  modelIdSelect  = `${htmlElements.select}[name="modelId"]`;

  static openPage(code) {
    cy.contentTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'contentModelsPageLoadingGET', '?*'));
    cy.contentTypesController().then(controller => controller.intercept({method: 'GET'}, 'contentTypesPageLoadingGET', '?*'));
    cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'pagePageLoadingGET', `/${code}?status=draft`));
    cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'pageDraftWidgetsPageLoadingGET', `/${code}/widgets?status=draft`));
    cy.pagesController().then(controller => controller.intercept({method: 'GET'}, 'pagePublishedWidgetsPageLoadingGET', `/${code}/widgets?status=published`));
    cy.wait(['@contentModelsPageLoadingGET', '@contentTypesPageLoadingGET', '@pagePageLoadingGET', '@pageDraftWidgetsPageLoadingGET', '@pagePublishedWidgetsPageLoadingGET']);
  }

  static openDesignerWidgets(button, code) {
    cy.widgetsController().then(controller => controller.intercept({method: 'GET'}, 'widgetPageLoadingGET', `/${code}`));
    cy.get(button).click();
    cy.wait('@widgetPageLoadingGET');
  }
  getAddButtonsArea() {
    return this.getInnerPanel().find(this.addButtonArea);
  }

  getAddContentButton() {
    return this.getAddButtonsArea().children(this.buttonClass);
  }

  getAddNewButtonDropdown() {
    return this.getAddButtonsArea().children(this.buttonDropdown);
  }

  getButtonAddByContentTypeName(ctype) {
    // FIXME: find a way to avoid using `contains`
    return this.getAddNewButtonDropdown()
               .children(htmlElements.ul)
               .children(htmlElements.li)
               .contains(ctype);
  }

  clickNewContentWith(ctype) {
    this.getAddNewButtonDropdown().click();
    this.getButtonAddByContentTypeName(ctype).click();
    return new AdminPage(AddContentPage);
  }

  clickAddContentButton() {
    this.getAddContentButton().click();
    this.setDialogBodyWithClass(ContentListSelectModal);
    return cy.get('@currentPage');
  }

  getChangeContentButton() {
    return this.getAddContentButton();
  }

  getModelIdSelect() {
    return this.getInnerPanel()
               .find(this.modelIdSelect);
  }

  clickChangeContentButton() {
    this.getChangeContentButton().click();
    this.setDialogBodyWithClass(ContentListSelectModal);
    return cy.get('@currentPage');
  }

}
