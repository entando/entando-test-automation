import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent';

import AppPage from '../../app/AppPage';

export default class ReloadConfigurationPage extends AppContent {

  getReloadButton() {
    return this.getContents().find(`${htmlElements.button}[type=button].ReloadConfig__reload-button`);
  }

  getReloadConfirmation() {
    return this.getContents().find(`${htmlElements.div}.ReloadConfirm`);
  }

  reload() {
    this.getReloadButton()
        .then(button => {
          cy.intercept('POST', 'http://test-7-0-0-final-cypress.apps.ent64azure.com/entando-de-app/api/reloadConfiguration').as('reloadConfigurationPOST');
          cy.get(button).click();
          cy.wait('@reloadConfigurationPOST');
        });
    return cy.wrap(new AppPage(ReloadConfigurationPage)).as('currentPage');
  }

}
