import {htmlElements} from '../../WebElement';

import AdminContent from '../../app/AdminContent.js';
import KebabMenu    from '../../app/KebabMenu';

import AdminPage    from '../../app/AdminPage.js';

import TypesPage     from './TypesPage.js';
import AttributePage from './attributes/AttributePage';

export default class EditPage extends AdminContent {

  codeInput  = `${htmlElements.input}#entityTypeCode`;
  nameInput  = `${htmlElements.input}#entityTypeDescription`;
  saveButton = `${htmlElements.button}[name="entandoaction:saveEntityType"]`;
  attributeTypeSelect = `${htmlElements.select}#attributeTypeCode`;
  addAttributeButton  = `${htmlElements.button}[name="entandoaction:addAttribute"]`;

  static openPage(button) {
    super.loadPage(button, '/Entity/initEditEntityType.action');
  }

  static openPageFromAttribute(button) {
    super.loadPage(button, '/jacms/Entity/entryEntityType.action');
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
    return new AttributeKebabMenu(this, code);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  openAddAttributePage(attributeCode) {
    this.getAttributeTypeSelect().then(input => this.select(input, attributeCode));
    this.getAddAttributeButton().then(button => AttributePage.openPage(button));
    return cy.wrap(new AdminPage(AttributePage)).as('currentPage');
  }

  save() {
    this.getSaveButton().then(button => TypesPage.openPage(button));
    return cy.wrap(new AdminPage(TypesPage)).as('currentPage');
  }

}

class AttributeKebabMenu extends KebabMenu {

  edit     = `${htmlElements.button}[name="entandoaction:editAttribute?attributeName=${this.code}"]`;
  moveUp   = `${htmlElements.button}[value="Move up"]`;
  moveDown = `${htmlElements.button}[value="Move down"]`;
  delete   = `${htmlElements.button}[title="Delete"]`;

  get() {
    return this.parent.getTableRow(this.code)
               .find(`${htmlElements.div}.dropdown.dropdown-kebab-pf`);
  }

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

  openEdit() {
    this.getEdit().then(button => AttributePage.openPageFromEdit(button));
    return cy.wrap(new AdminPage(AttributePage)).as('currentPage');
  }

}
