import {htmlElements} from '../../../WebElement';

import AppContent from '../../../app/AppContent';

import AppPage from '../../../app/AppPage';

import EditPage from '../EditPage';

export default class NestedAttributePage extends AppContent {

  continueButton = `${htmlElements.button}[type="submit"].btn.btn-primary.pull-right`;

  static openPage(button, code, attributeCode) {
    cy.contentTypeAttributesController().then(controller => controller.intercept({ method: 'GET' }, 'nestedAttributePageLoadingGET', `/${code}/attribute/${attributeCode}`, 2));
    cy.get(button).click();
    cy.wait(['@nestedAttributePageLoadingGET', '@nestedAttributePageLoadingGET']);
  }

  getContinueButton() {
    return this.getContents()
               .find(this.continueButton);
  }

  continue(code) {
    this.getContinueButton().then(button => EditPage.openPageFromAttribute(button, code));
    return cy.wrap(new AppPage(EditPage)).as('currentPage');
  }

}
