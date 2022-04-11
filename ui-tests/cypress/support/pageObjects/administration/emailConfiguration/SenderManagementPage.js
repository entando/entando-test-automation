import {htmlElements} from '../../WebElement';

import EmailConfigurationPage from './EmailConfigurationPage';

import AppPage        from '../../app/AppPage';
import SMTPServerPage from './SMTPServerPage';
import SenderPage     from './SenderPage';
import KebabMenu      from '../../app/KebabMenu';
import DeleteDialog   from '../../app/DeleteDialog';

export default class SenderManagementPage extends EmailConfigurationPage {

  senderAddButton = `${htmlElements.a}[type=button]`;

  static openPage(button) {
    cy.senderController().then(controller => controller.intercept({method: 'GET'}, 'senderManagementPageLoadingGET'));
    cy.get(button).click();
    cy.wait('@senderManagementPageLoadingGET');
  }

  openSenderManagement() {
    this.getSenderManagementTab().then(button => SenderManagementPage.openPage(button));
    return cy.wrap(new AppPage(SenderManagementPage)).as('currentPage');
  }

  openSMTPServer() {
    this.getSMTPServerTab().then(button => SMTPServerPage.openPage(button));
    return cy.wrap(new AppPage(SMTPServerPage)).as('currentPage');
  }

  getSenderMngt() {
    return this.getContents().find(`${htmlElements.div}.EmailConfigSenderMgmt`);
  }

  getSenderTable() {
    return this.getSenderMngt().find(`${htmlElements.table}.table`);
  }

  getSenderTableHeaders() {
    return this.getSenderTable()
               .children(htmlElements.thead)
               .children(htmlElements.tr);
  }

  getSenderTableRows() {
    return this.getSenderTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getSenderTableRow(code) {
    return this.getSenderTableRows()
               .find(`${htmlElements.button}#sender-actions-${code}`)
               .closest(htmlElements.tr);
  }

  getKebabMenu(code) {
    return new SenderKebabMenu(this, code);
  }

  getAddButton() {
    return this.getSenderMngt().find(this.senderAddButton);
  }

  openAddSender() {
    this.getAddButton().click();
    return cy.wrap(new AppPage(SenderPage)).as('currentPage');
  }

}

class SenderKebabMenu extends KebabMenu {

  get() {
    return this.parent.getSenderTableRows()
               .find(`${htmlElements.button}#sender-actions-${this.code}`)
               .parent(`${htmlElements.div}.dropdown-kebab-pf`);
  }

  getDropdown() {
    return this.get().find(`${htmlElements.ul}[role="menu"]`);
  }

  getEdit() {
    return this.getDropdown().children(`${htmlElements.li}.LinkMenuItem`);
  }

  getDelete() {
    return this.getDropdown().children(`${htmlElements.li}[role="presentation"]`);
  }

  openEdit() {
    this.getEdit().then(button => SenderPage.openPage(button, this.code));
    return cy.wrap(new AppPage(SenderPage)).as('currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}
