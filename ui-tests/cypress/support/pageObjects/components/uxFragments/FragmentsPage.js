import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import AppPage         from '../../app/AppPage.js';
import UXFragmentsPage from './UXFragmentsPage.js';

export default class FragmentsPage extends AppContent {

  static openPage(button, code = null, action = null, waitDOM = false) {
    !code ? super.loadPage(button, '/fragment/add', false, waitDOM) : super.loadPage(button, `/fragment/${action}/${code}`, false, waitDOM);
  }

  getCodeInput() {
    return this.get().find(`${htmlElements.input}[name="code"]`);
  }

  getGuiCodeInput() {
    return this.get().find(`${htmlElements.textarea}[name="guiCode"]`);
  }

  getGuiCodeSelector() {
    return this.get().find(`${htmlElements.a}[id="basic-tabs-tab-1"]`);

  }

  getDefaultGuiCodeSelector() {
    return this.get().find(`${htmlElements.a}[id="basic-tabs-tab-2"]`);
  }

  getSaveButton() {
    return this.get().find(`${htmlElements.button}[type=button]#saveopts`);
  }

  getSaveOption() {
    return this.get().find(`${htmlElements.a}#regularSaveButton`);
  }

  getSaveAndContinueOption() {
    return this.get().find(`${htmlElements.a}#continueSaveButton`);
  }

  getCancelButton() {
    return this.get().find(`${htmlElements.button}[class="pull-right btn btn-default"]`);
  }

  goToFragmentsViaBreadCrumb() {
    this.getBreadCrumb().children(htmlElements.li).eq(1).then(button => UXFragmentsPage.openPage(button, false));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

  openSaveMenu() {
    this.getSaveButton().click();
    return cy.get('@currentPage');
  }

  clickSave() {
    this.getSaveButton().click();
    this.getSaveOption().click();
    return cy.get('@currentPage');
  }

  save() {
    this.getSaveButton().click();
    this.getSaveOption().then(button => UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

  saveAndContinue(code) {
    this.getSaveButton().click();
    this.getSaveAndContinueOption().then(button => FragmentsPage.openPage(button, code, 'edit'));
    return cy.get('@currentPage');
  }

}
