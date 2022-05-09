import {htmlElements} from '../../../WebElement';

import AdminContent from '../../../app/AdminContent';

import AdminPage from '../../../app/AdminPage';

import EditPage from '../EditPage';

export default class NestedAttributePage extends AdminContent {

  continueButton = `${htmlElements.button}[type="submit"][value="Submit"].btn.btn-primary.pull-right`;

  //FIXME AdminConsole is not built on REST APIs
  static openPage(button) {
    cy.contentTypesAdminConsoleController().then(controller => controller.intercept({ method: 'GET' }, 'nestedAttributePageLoadingGET', `/ListAttribute/configureListElement.action`));
    cy.get(button).click();
    cy.wait('@nestedAttributePageLoadingGET');
  }

  getContinueButton() {
    return this.getContents()
               .find(this.continueButton);
  }

  continue() {
    this.getContinueButton().then(button => EditPage.openPageFromAttribute(button));
    return cy.wrap(new AdminPage(EditPage)).as('currentPage');
  }

}
