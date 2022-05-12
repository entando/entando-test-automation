import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

import AppPage from '../../app/AppPage.js';

import ManagementPage from './ManagementPage.js';

export default class ViewProfilePage extends AppContent {

  table      = `${htmlElements.table}.table`;
  backButton = `${htmlElements.button}[type=button].btn-primary`;

  static openPage(button, code) {
    cy.usersController().then(controller => controller.intercept({method: 'GET'}, 'viewProfilePageLoadingGET', `/${code}`));
    cy.get(button).click();
    cy.wait('@viewProfilePageLoadingGET');
  }

  getDetailsTable() {
    return this.getContents()
               .find(this.table);
  }

  getTableRows() {
    return this.getDetailsTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getBackButton() {
    return this.getContents()
               .find(this.backButton);
  }

  goBack() {
    this.getBackButton().then(button => ManagementPage.openPage(button));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

}
