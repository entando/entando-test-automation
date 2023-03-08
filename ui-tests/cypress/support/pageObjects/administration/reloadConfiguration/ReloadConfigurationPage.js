import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent';

export default class ReloadConfigurationPage extends AppContent {

  static openPage(button, confirm = false) {
    !confirm ? super.loadPage(button, '/reloadConfiguration') : super.loadPage(button, '/reloadConfiguration/confirm');
  }

  getReloadButton() {
    return this.getContents().find(`${htmlElements.button}[type=button].ReloadConfig__reload-button`);
  }

  getReloadConfirmation() {
    return this.getContents().find(`${htmlElements.div}.ReloadConfirm`);
  }

  getSectionRootFromBreadCrumb() {
    return this.getBreadCrumb().children(htmlElements.li).eq(1);
  }

  clickSectionRootFromBreadCrumb() {
    this.getSectionRootFromBreadCrumb().then(button => ReloadConfigurationPage.openPage(button));
    return cy.get('@currentPage');
  }

  reload() {
    this.getReloadButton().then(button => ReloadConfigurationPage.openPage(button, true));
    return cy.get('@currentPage');
  }

}
