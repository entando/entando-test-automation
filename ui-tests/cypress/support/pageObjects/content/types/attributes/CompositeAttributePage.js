import {htmlElements, WebElement} from '../../../WebElement';

import AdminContent from '../../../app/AdminContent';

import AdminPage from '../../../app/AdminPage';

import EditPage            from '../EditPage';
import AttributePage       from './AttributePage';
import NestedAttributePage from './NestedAttributePage';

export default class CompositeAttributePage extends AdminContent {

  addAttributeButton = `${htmlElements.button}[name="entandoaction:addAttributeElement"]`;
  submitButton       = `${htmlElements.button}[type=submit][value="Submit"]`;
  attributeSelect    = `${htmlElements.select}#attributeTypeCode`;

  //FIXME AdminConsole is not built on REST APIs
  static openPage(button) {
    cy.contentTypesAdminConsoleController().then(controller => controller.intercept({ method: 'GET' }, 'compositeAttributePageLoadingGET', `/CompositeAttribute/entryCompositeAttribute.action`));
    cy.get(button).click();
    cy.wait('@compositeAttributePageLoadingGET');
  }

  getAttributeTypeSelect() {
    return this.getContents()
               .find(this.attributeSelect);
  }

  getAddAttributeButton() {
    return this.getContents()
               .find(this.addAttributeButton);
  }

  getSubmitButton() {
    return this.getContents()
               .find(this.submitButton);
  }

  getAttributesTable() {
    return this.getContents()
               .find(htmlElements.table);
  }

  getTableRow(code) {
    return this.getAttributesTable()
               .contains(htmlElements.tr, code);
  }

  getKebabMenu(code) {
    return new AttributeKebabMenu(this, code);
  }

  openAddAttributePage(attributeCode) {
    this.getAttributeTypeSelect().then(input => this.select(input, attributeCode));
    this.getAddAttributeButton().then(button => AttributePage.openPageFromComposite(button));
    return cy.wrap(new AdminPage(AttributePage)).as('currentPage');
  }

  continue(attribute = '') {
    this.getSubmitButton().then(button => {
      switch (attribute) {
        case 'Monolist':
          NestedAttributePage.openPage(button);
          return cy.wrap(new AdminPage(NestedAttributePage)).as('currentPage');
        default:
          EditPage.openPageFromAttribute(button);
          return cy.wrap(new AdminPage(EditPage)).as('currentPage');
      }
    })
  }

}

class AttributeKebabMenu extends WebElement {

  moveUp   = `${htmlElements.button}[value="Move up"]`;
  moveDown = `${htmlElements.button}[value="Move down]`;
  delete   = `${htmlElements.button}[value="Delete"][title="Delete"]`;

  constructor(parent, code) {
    super(parent);
    this.code = code;
  }

  get() {
    return this.parent.getTableRow(this.code)
               .find(`${htmlElements.div}.dropdown.dropdown-kebab-pf`);
  }

  open() {
    this.get()
        .children(htmlElements.button)
        .click();
    return this;
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

}
