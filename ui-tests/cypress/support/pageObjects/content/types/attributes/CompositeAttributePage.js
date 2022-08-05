import {htmlElements} from '../../../WebElement';

import AppContent from '../../../app/AppContent';

import AppPage from '../../../app/AppPage';

import EditPage            from '../EditPage';
import AttributePage       from './AttributePage';
import NestedAttributePage from './NestedAttributePage';
import KebabMenu from '../../../app/KebabMenu';

export default class CompositeAttributePage extends AppContent {

  addAttributeButton = `${htmlElements.button}.ContentTypeForm__add`;
  submitButton       = `${htmlElements.button}[type=submit]`;
  attributeSelect    = `${htmlElements.select}.RenderSelectInput`;

  // TODO: investigate when and how the API call is or is not performed
  //static openPage(button, code) {
    //cy.contentTypeAttributesController().then(controller => controller.intercept({ method: 'GET' }, 'compositeAttributePageLoadingGET', `/${code}/attribute/*`));
  static openPage(button) {
    cy.get(button).click();
    //cy.wait('@compositeAttributePageLoadingGET');
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
    cy.wait(1000);  //TODO: find a better way to wait for the button to be actionable
    return new AttributeKebabMenu(this, code);
  }

  openAddAttributePage(contentTypeCode, attributeType) {
    this.getAttributeTypeSelect().then(input => this.select(input, attributeType));
    this.getAddAttributeButton().then(button => AttributePage.openPageFromComposite(button, contentTypeCode));
    return cy.wrap(new AppPage(AttributePage)).as('currentPage');
  }

  continue(attribute = '', contentTypeCode) {
    this.getSubmitButton().then(button => {
      switch (attribute) {
        case 'Monolist':
          NestedAttributePage.openPage(button);
          return cy.wrap(new AppPage(NestedAttributePage)).as('currentPage');
        default:
          EditPage.openPageFromAttribute(button, contentTypeCode);
          return cy.wrap(new AppPage(EditPage)).as('currentPage');
      }
    })
  }

}

class AttributeKebabMenu extends KebabMenu {

  moveUp   = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-move-up`;
  moveDown = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-move-down`;
  delete   = `${htmlElements.li}.ContTypeAttributeListMenuAction__menu-item-delete`;

  constructor(parent, code) {
    super(parent);
    this.code = code;
  }

  get() {
    return this.parent.getTableRow(this.code)
               .find(`${htmlElements.div}.dropdown.dropdown-kebab-pf`);
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

  clickMoveUp() {
    this.getMoveUp().click();
  }

  clickMoveDown() {
    this.getMoveDown().click();
  }

  clickDelete() {
    return this.getDelete().then(button => this.parent.click(button));
  }

}
