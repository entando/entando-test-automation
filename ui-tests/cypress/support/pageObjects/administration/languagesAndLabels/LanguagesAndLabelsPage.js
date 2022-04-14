import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

export default class LanguagesAndLabelsPage extends AppContent {

  languageAndLabelsTabList = `${htmlElements.ul}.nav-tabs`;

  //FIXME it should not load both pages landing on a single tab
  static openPage(button) {
    cy.languagesController().then(controller => controller.intercept({method: 'GET'}, 'languagesPageLoadingGET', '?*'));
    cy.labelsController().then(controller => controller.intercept({method: 'GET'}, 'systemLabelsPageLoadingGET', '?*'));
    if (button) cy.get(button).click();
    else cy.realType('{enter}');
    cy.wait(['@languagesPageLoadingGET', '@systemLabelsPageLoadingGET']);
  }

  getLanguagesTab() {
    return this.getContents()
               .then(pageContent => pageContent
                   .find(this.languageAndLabelsTabList)
                   .children().eq(0));
  }

  getSystemLabelsTab() {
    return this.getContents()
               .then(pageContent => pageContent
                   .find(this.languageAndLabelsTabList)
                   .children().eq(1));
  }

}
