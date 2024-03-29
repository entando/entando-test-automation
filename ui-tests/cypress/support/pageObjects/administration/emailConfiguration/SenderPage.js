import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import AppPage from '../../app/AppPage';

import SenderManagementPage from './SenderManagementPage';

export default class SenderPage extends AppContent {

  static openPage(button, code = null) {
    !code ? super.loadPage(button, '/email-config/senders/add') : super.loadPage(button, `/email-config/senders/edit/${code}`);
  }

  getSenderForm() {
    return this.get().find(`${htmlElements.form}`);
  }

  getCodeField() {
    return this.getSenderForm().children(htmlElements.div).eq(0);
  }

  getCodeLabel() {
    return this.getCodeField().find(htmlElements.label);
  }

  getCodeInput() {
    return this.getCodeField().find(htmlElements.input);
  }

  getEmailField() {
    return this.getSenderForm().children(htmlElements.div).eq(1);
  }

  getEmailLabel() {
    return this.getEmailField().find(htmlElements.label);
  }

  getEmailInput() {
    return this.getEmailField().find(htmlElements.input);
  }

  getSaveButton() {
    return this.getSenderForm().children(htmlElements.button);
  }

  save() {
    this.getSaveButton().then(button => SenderManagementPage.openPage(button));
    return cy.wrap(new AppPage(SenderManagementPage)).as('currentPage');
  }

}
