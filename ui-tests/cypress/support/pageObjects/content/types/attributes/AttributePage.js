import {htmlElements} from '../../../WebElement';

import AppContent from '../../../app/AppContent';

import AppPage from '../../../app/AppPage';

import EditPage               from '../EditPage';
import NestedAttributePage    from './NestedAttributePage';
import CompositeAttributePage from './CompositeAttributePage';

export default class AttributePage extends AppContent {

  codeInput           = `${htmlElements.input}[name=code]`;
  nameInput           = `${htmlElements.input}[name="names.{lang}"]`;
  nestedAttributeType = `${htmlElements.select}[name="nestedAttribute.type"]`;
  continueButton      = `${htmlElements.button}.ContentTypeAttributeForm__continue-btn`;

  static openPage(button, code) {
    cy.contentTypeAttributesController().then(controller => controller.intercept({ method: 'GET' }, `contentTypeAttributes-${code}-LoadingGET`, '?page=1&pageSize=0', 2));
    cy.get(button).click();
    cy.wait([`@contentTypeAttributes-${code}-LoadingGET`, `@contentTypeAttributes-${code}-LoadingGET`]);
  }

  static openPageFromComposite(button, code) {
    cy.contentTypeAttributesController().then(controller => controller.intercept({ method: 'GET' }, `contentTypeAttributes-${code}-LoadingGET`, '?page=1&pageSize=0', 1));
    cy.get(button).click();
    cy.wait(`@contentTypeAttributes-${code}-LoadingGET`);
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getNameInput(lang) {
    return this.getContents()
               .find(this.nameInput.replace('{lang}', lang));
  }

  getNestedAttributeType() {
    return this.getContents()
               .find(this.nestedAttributeType);
  }

  getContinueButton() {
    return this.getContents()
               .find(this.continueButton);
  }

  continue(attribute = '', typeCode, isComposite = false) {
    this.getContinueButton().then(button => {
      switch (attribute) {
        case 'List':
        case 'Monolist':
          NestedAttributePage.openPage(button, typeCode, attribute);
          return cy.wrap(new AppPage(NestedAttributePage)).as('currentPage');
        case 'Composite':
          CompositeAttributePage.openPage(button, typeCode);
          return cy.wrap(new AppPage(CompositeAttributePage)).as('currentPage');
        default:
          if (isComposite) {
            CompositeAttributePage.openPage(button, typeCode);
            return cy.wrap(new AppPage(CompositeAttributePage)).as('currentPage');
          } else {
            EditPage.openPageFromAttribute(button, typeCode);
            return cy.wrap(new AppPage(EditPage)).as('currentPage');
          }
      }
    });
  }

}
