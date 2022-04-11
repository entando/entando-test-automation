import {htmlElements} from '../../WebElement';

import EmailConfigurationPage from './EmailConfigurationPage';

import AppPage from '../../app/AppPage';

import SenderManagementPage from './SenderManagementPage';

export default class SMTPServerPage extends EmailConfigurationPage {

  formGroup = `${htmlElements.div}.form-group`;

  switch       = `${htmlElements.div}.SwitchRenderer`;
  switchButton = `${htmlElements.div}.bootstrap-switch`;

  toolButton = `${htmlElements.div}.btn-toolbar.pull-right`;

  static openPage(button) {
    cy.smtpServerController().then(controller => controller.intercept({method: 'GET'}, 'smtpServerPageLoadingGET'));
    cy.get(button).click();
    cy.wait('@smtpServerPageLoadingGET');
  }

  openSenderManagement() {
    this.getSenderManagementTab().then(button => SenderManagementPage.openPage(button));
    return cy.wrap(new AppPage(SenderManagementPage)).as('currentPage');
  }

  openSMTPServer() {
    this.getSMTPServerTab().then(button => SMTPServerPage.openPage(button));
    return cy.wrap(new AppPage(SMTPServerPage)).as('currentPage');
  }

  getForm() {
    return this.getContents().find(this.formGroup);
  }

  getSwitch() {
    return this.getContents()
               .find(this.switch);
  }

  getActiveSwitch() {
    return this.getSwitch().eq(0);
  }

  getActiveSwitchLabel() {
    return this.getActiveSwitch()
               .children(htmlElements.div).eq(0);
  }

  getActiveSwitchSwitch() {
    return this.getActiveSwitch()
               .find(this.switchButton);
  }

  getDebugSwitch() {
    return this.getSwitch().eq(1);
  }

  getDebugSwitchLabel() {
    return this.getDebugSwitch()
               .children(htmlElements.div).eq(0);
  }

  getDebugSwitchSwitch() {
    return this.getDebugSwitch()
               .find(this.switchButton);
  }

  getHostInput() {
    return this.getForm().find(`${htmlElements.input}[name="host"]`);
  }

  getPortInput() {
    return this.getForm().find(`${htmlElements.input}[name="port"]`);
  }

  getSecurityRender() {
    return this.getForm().eq(4)
               .find(`${htmlElements.div}.btn-group`);
  }

  getCheckServerIdSwitch() {
    return this.getSwitch().eq(2);
  }

  getCheckServerIdSwitchLabel() {
    return this.getCheckServerIdSwitch()
               .children(htmlElements.div).eq(0);
  }

  getCheckServerIdSwitchSwitch() {
    return this.getCheckServerIdSwitch()
               .find(this.switchButton);
  }

  getTimeOutInput() {
    return this.getForm().find(`${htmlElements.input}[name="timeout"]`);
  }

  getUserNameInput() {
    return this.getForm().find(`${htmlElements.input}[name="username"]`);
  }

  getPasswordInput() {
    return this.getForm().find(`${htmlElements.input}[name="password"]`);
  }

  getToolButtons() {
    return this.getContents().find(this.toolButton);
  }

  getTestConfigurationButton() {
    return this.getToolButtons().children(htmlElements.button).eq(0);
  }

  getSendTestEmailButton() {
    return this.getToolButtons().children(htmlElements.button).eq(1);
  }

  getSaveButton() {
    return this.getToolButtons().children(`${htmlElements.button}[type=submit]`);
  }

  save() {
    this.getSaveButton().click();
    return cy.get('@currentPage');
  }

}
