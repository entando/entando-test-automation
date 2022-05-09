import {htmlElements} from '../../../WebElement';

import AdminContent from '../../../app/AdminContent';

import AdminPage from '../../../app/AdminPage';

import EditPage               from '../EditPage';
import NestedAttributePage    from './NestedAttributePage';
import CompositeAttributePage from './CompositeAttributePage';

export default class AttributePage extends AdminContent {

  codeInput           = `${htmlElements.input}#attributeName`;
  nameInput           = `${htmlElements.input}#attributeDescription`;
  nestedAttributeType = `${htmlElements.select}#listNestedType`;
  continueButton      = `${htmlElements.button}.btn.btn-primary.pull-right`;

  //FIXME AdminConsole is not built on REST APIs
  static openPage(button, code) {
    cy.contentTypesAdminConsoleController().then(controller => controller.intercept({ method: 'GET' }, 'attributePageLoadingGET', `/Attribute/addAttribute.action?attributeTypeCode=${code}`));
    cy.get(button).click();
    cy.wait('@attributePageLoadingGET');
  }

  //FIXME AdminConsole is not built on REST APIs
  static openPageFromEdit(button, code) {
    cy.contentTypesAdminConsoleController().then(controller => controller.intercept({ method: 'GET' }, 'attributePageLoadingGET', `/Attribute/editAttribute.action?attributeName=${code}`));
    cy.get(button).click();
    cy.wait('@attributePageLoadingGET');
  }

  //FIXME AdminConsole is not built on REST APIs
  static openPageFromComposite(button) {
    cy.contentTypesAdminConsoleController().then(controller => controller.intercept({ method: 'POST' }, 'attributePageLoadingPOST', `/CompositeAttribute/saveCompositeAttribute.action`));
    cy.get(button).click();
    cy.wait('@attributePageLoadingPOST');
  }

  getContents() {
    return this.get()
               .find(`${htmlElements.form}[method="post"]`);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getNameInput() {
    return this.getContents()
               .find(this.nameInput);
  }

  getNestedAttributeType() {
    return this.getContents()
               .find(this.nestedAttributeType);
  }

  getContinueButton() {
    return this.getContents()
               .find(this.continueButton);
  }

  continue(attribute = '', isComposite = false) {
    this.getContinueButton().then(button => {
      switch (attribute) {
        case 'List':
        case 'Monolist':
          NestedAttributePage.openPage(button);
          return cy.wrap(new AdminPage(NestedAttributePage)).as('currentPage');
        case 'Composite':
          CompositeAttributePage.openPage(button);
          return cy.wrap(new AdminPage(CompositeAttributePage)).as('currentPage');
        default:
          if (isComposite) {
            CompositeAttributePage.openPage(button);
            return cy.wrap(new AdminPage(CompositeAttributePage)).as('currentPage');
          } else {
            EditPage.openPageFromAttribute(button);
            return cy.wrap(new AdminPage(EditPage)).as('currentPage');
          }
      }
    });
  }

}
