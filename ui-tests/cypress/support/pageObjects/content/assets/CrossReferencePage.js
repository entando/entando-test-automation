import {htmlElements} from '../../WebElement.js';

import AdminContent from '../../app/AdminContent';


export default class CrossReferencePage extends AdminContent {


  static openPage(button) {
    cy.assetsAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'deletePageLoadingGet', '/trash.action?*'));
    cy.get(button).click();
    cy.wait('@deletePageLoadingGet');
  }

  getAlert() {
    return this.get()
               .find(`${htmlElements.div}.alert`);
  }

  getAlertText() {
    return this.getAlert()
               .children(htmlElements.p);
  }


}
