import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import AppPage         from '../../app/AppPage.js';
import UXFragmentsPage from './UXFragments.js';

export default class AddPage extends AppContent {

  codeInput    = `${htmlElements.input}[name="code"]`;
  guiCodeInput = `${htmlElements.textarea}[name="guiCode"]`;
  guiCodeSelector = `${htmlElements.a}[id="basic-tabs-tab-1"]`;
  defaultGuiSelector =`${htmlElements.a}[id="basic-tabs-tab-2"]`;
  saveBtn      = `${htmlElements.button}[type=button]#saveopts`;
  saveOption   = `${htmlElements.a}#regularSaveButton`;
  cancelBtn    = `${htmlElements.button}[class="pull-right btn btn-default"]`;


  getCodeInput() {
    return this.get()
               .find(this.codeInput);
  }

  getGuiCodeInput() {
    return this.get()
               .find(this.guiCodeInput);
  }

  getGuiCodeSelector(){
    return this.get()
        .find(this.guiCodeSelector);

  }
  getDefaultGuiCodeSelector(){
    return this.get()
        .find(this.defaultGuiSelector);
  }

  getSaveBtn() {
    return this.get()
               .find(this.saveBtn);
  }

  getSaveOption() {
    return this.get()
               .find(this.saveOption);
  }

  getCancelBtn(){
    return this.get()
        .find(this.cancelBtn);
  }

  typeCode(value) {
    this.getCodeInput().type(value);
  }

  typeGuiCode(value) {
    this.getGuiCodeInput().type(value);
  }

  clickSaveBtn() {
    this.getSaveBtn().click();
  }

  clickSaveOption() {
    this.getSaveOption().click();
  }

  save() {
    this.clickSaveBtn();
    this.clickSaveOption();
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

}
