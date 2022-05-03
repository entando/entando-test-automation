import {htmlElements} from '../../WebElement.js';

import AppContent from '../../app/AppContent.js';

import AppPage         from '../../app/AppPage.js';
import UXFragmentsPage from './UXFragmentsPage.js';

export default class FragmentsPage extends AppContent {

  codeInput             = `${htmlElements.input}[name="code"]`;
  guiCodeInput          = `${htmlElements.textarea}[name="guiCode"]`;
  guiCodeSelector       = `${htmlElements.a}[id="basic-tabs-tab-1"]`;
  defaultGuiSelector    = `${htmlElements.a}[id="basic-tabs-tab-2"]`;
  saveBtn               = `${htmlElements.button}[type=button]#saveopts`;
  saveOption            = `${htmlElements.a}#regularSaveButton`;
  saveAndContinueOption = `${htmlElements.a}#continueSaveButton`;
  cancelBtn             = `${htmlElements.button}[class="pull-right btn btn-default"]`;


  getBreadCrumb() {
    return this.get()
               .find(`.BreadcrumbItem`).eq(1);
  }

  openBreadCrumb() {
    this.getBreadCrumb().then(button => UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

  getCodeInput() {
    return this.get()
               .find(this.codeInput);
  }

  getGuiCodeInput() {
    return this.get()
               .find(this.guiCodeInput);
  }

  getGuiCodeSelector() {
    return this.get()
               .find(this.guiCodeSelector);

  }

  getDefaultGuiCodeSelector() {
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

  getSaveAndContinueOption() {
    return this.get()
               .find(this.saveAndContinueOption);
  }

  getCancelBtn() {
    return this.get()
               .find(this.cancelBtn);
  }

  clickSave() {
    this.getSaveBtn()
        .then(button => button.click())
        .then(() => this.getSaveOption().click());
    return cy.get('@currentPage');
  }

  save() {
    this.getSaveBtn().click();
    this.getSaveOption().then(button => UXFragmentsPage.openPage(button));
    return cy.wrap(new AppPage(UXFragmentsPage)).as('currentPage');
  }

  saveAndContinue(code = null) {
    this.getSaveBtn().click();
    this.getSaveAndContinueOption()
        .then(button => {
          if (code) {
            cy.fragmentsController().then(controller => controller.intercept({method: 'PUT'}, 'fragmentsPageLoadingPUT', `/${code}`));
          } else {
            cy.fragmentsController().then(controller => controller.intercept({method: 'POST'}, 'fragmentsPageLoadingPOST'));
          }
          cy.get(button).click();
          if (code) cy.wait('@fragmentsPageLoadingPUT');
          else cy.wait('@fragmentsPageLoadingPOST');
        });
    return cy.get('@currentPage');
  }

}
