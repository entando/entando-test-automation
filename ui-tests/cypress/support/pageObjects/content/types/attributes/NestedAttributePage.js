import {htmlElements} from '../../../WebElement';

import AdminContent from '../../../app/AdminContent';

import AdminPage from '../../../app/AdminPage';

import EditPage from '../EditPage';

export default class NestedAttributePage extends AdminContent {

  continueButton = `${htmlElements.button}[type="submit"][value="Submit"].btn.btn-primary.pull-right`;

  static openPage(button) {
    super.loadPage(button, '/Entity/ListAttribute/configureListElement.action');
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
