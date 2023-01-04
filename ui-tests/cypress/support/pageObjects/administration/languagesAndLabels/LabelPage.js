import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import AppPage from '../../app/AppPage';

import SystemLabelsPage       from './SystemLabelsPage';
import LanguagesAndLabelsPage from './LanguagesAndLabelsPage';

export default class LabelPage extends AppContent {

  static openPage(button, code = null) {
    if (code) cy.labelsController().then(controller => controller.intercept({method: 'GET'}, 'addLabelPageLoadingGET', `/${code}`));
    cy.languagesController().then(controller => controller.intercept({method: 'GET'}, 'languagesPageLoadingGET', '?*'));
    cy.labelsController().then(controller => controller.intercept({method: 'GET'}, 'systemLabelsPageLoadingGET', '?*'));
    cy.get(button).click();
    if (code) cy.wait(['@addLabelPageLoadingGET', '@languagesPageLoadingGET', '@systemLabelsPageLoadingGET']);
    else cy.wait(['@languagesPageLoadingGET', '@systemLabelsPageLoadingGET']);
  }

  getForm() {
    return this.get().find(htmlElements.form);
  }

  getCodeInput() {
    return this.getForm().find(`${htmlElements.input}[name=key]`);
  }

  getLanguageTextArea(code) {
    return this.getForm().find(`${htmlElements.textarea}[name="titles.${code}"]`);
  }

  getSaveButton() {
    return this.getForm().find(`${htmlElements.button}[type=submit]`);
  }

  navigateToLanguagesAndLabelsFromBreadcrumb() {
    this.getBreadCrumb().children(htmlElements.li).eq(1)
        .then(button => LanguagesAndLabelsPage.openPage(button));
    return cy.wrap(new AppPage(SystemLabelsPage)).as('currentPage');
  }

  clickSaveButton() {
    this.getSaveButton().click();
    return cy.get('@currentPage');
  }

  save() {
    this.getSaveButton().then(button => LanguagesAndLabelsPage.openPage(button));
    return cy.wrap(new AppPage(SystemLabelsPage)).as('currentPage');
  }

}
