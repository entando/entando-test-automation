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
          cy.reloadConfigurationController().then(controller => controller.intercept({method: 'POST'}, 'reloadConfigurationPOST'));
          cy.get(button).click();
          cy.wait('@reloadConfigurationPOST');
        });
    return cy.wrap(new AppPage(ReloadConfigurationPage)).as('currentPage');
  }

}
