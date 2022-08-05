import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';
import KebabMenu    from '../../app/KebabMenu';

import AppPage    from '../../app/AppPage.js';

import TypesPage     from './TypesPage.js';
import AttributePage from './attributes/AttributePage';
import DeleteDialog from '../../app/DeleteDialog';

export default class EditPage extends AppContent {

  codeInput           = `${htmlElements.input}[name=code]`;
  nameInput           = `${htmlElements.input}[name=name]`;
  saveButton          = `${htmlElements.button}.AddContentTypeFormBody__save--btn`;
  attributeTypeSelect = `${htmlElements.select}[name=type]`;
  addAttributeButton  = `${htmlElements.button}.ContentTypeForm__add`;

  static openPage(button, code) {
    cy.contentTypesController().then(controller => controller.intercept({ method: 'GET' }, 'editContentTypePageLoadingGET', `/${code}`, 1));
    cy.get(button).click();
    cy.wait('@editContentTypePageLoadingGET');
  }

  static openPageFromAttribute(button, code) {
    cy.contentTypesController().then(controller => controller.intercept({ method: 'GET' }, 'editContentTypePageLoadingGET', `/${code}`, 1));
    cy.contentTypeAttributesController().then(controller => controller.intercept({ method: 'GET' }, 'contentTypeAttributesLoadingGET', '?page=1&pageSize=0', 1));
    cy.get(button).click();
    cy.wait(['@editContentTypePageLoadingGET', '@contentTypeAttributesLoadingGET']);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getAttributeTypeSelect() {
    return this.getContents()
               .find(this.attributeTypeSelect);
  }

  getAddAttributeButton() {
    return this.getContents()
               .find(this.addAttributeButton);
  }

  getAttributesTable() {
    return this.getContents()
               .find(htmlElements.table);
  }

  getTableRows() {
    return this.getAttributesTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getTableRow(code) {
    return this.getTableRows()
               .contains(htmlElements.tr, code);
  }

  getKebabMenu(code) {
    cy.wait(1000);  //TODO: find a better way to wait for the button to be actionable
    return new AttributeKebabMenu(this, code);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  openAddAttributePage(code, attributeType) {
    this.getAttributeTypeSelect().then(input => this.select(input, attributeType));
    this.getAddAttributeButton().then(button => AttributePage.openPage(button, code));
    return cy.wrap(new AppPage(AttributePage)).as('currentPage');
  }

  save() {
    this.getSaveButton().then(button => TypesPage.openPage(button));
    return cy.wrap(new AppPage(TypesPage)).as('currentPage');
  }

}

class AttributeKebabMenu extends KebabMenu {

  edit     = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-edit`;
  moveUp   = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-move-up`;
  moveDown = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-move-down`;
  delete   = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-delete`;

  getEdit() {
    return this.get()
               .find(this.edit);
  }

  getMoveUp() {
    return this.get()
               .find(this.moveUp);
  }

  getMoveDown() {
    return this.get()
               .find(this.moveDown);
  }

  getDelete() {
    return this.get()
               .find(this.delete);
  }

  openEdit(typeCode) {
    this.getEdit().then(button => AttributePage.openPage(button, typeCode));
    return cy.wrap(new AppPage(AttributePage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}
