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

  static openPage(button) {
    super.loadPage(button, '/Entity/Attribute/addAttribute.action');
  }

  static openPageFromEdit(button) {
    super.loadPage(button, '/Entity/Attribute/editAttribute.action');
  }

  static openPageFromComposite(button) {
    super.loadPage(button, '/Entity/CompositeAttribute/saveCompositeAttribute.action');
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
