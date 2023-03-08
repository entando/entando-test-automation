import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import AppPage        from '../../app/AppPage';
import ManagementPage from './ManagementPage';

export default class ClonePage extends AppContent {

  static openPage(button) {
    super.loadPage(button, `/page/clone`);
  }

  getTitleInput(lang) {
    return this.getContents().find(`${htmlElements.input}[name="titles.${lang}"]`);
  }

  getCodeInput() {
    return this.getContents().find(`${htmlElements.input}[name=code]`);
  }

  getPageTreeSelectorTable() {
    return this.getContents().find(`${htmlElements.table}.PageTreeSelector`);
  }

  getSaveAndDesignButton() {
    return this.getContents().find(`${htmlElements.button}.PageForm__save-and-configure-btn`);
  }

  getSaveButton() {
    return this.getContents().find(`${htmlElements.button}.PageForm__save-btn`);
  }

  selectPagePlacement(pageOrder) {
    this.getPageTreeSelectorTable()
        .children(htmlElements.tbody)
        .children(htmlElements.tr).eq(pageOrder)
        .find(`${htmlElements.span}.PageTreeSelector__select-area`)
        .click();
    return cy.get('@currentPage');
  }

  clickSave() {
    this.getSaveButton().then(button => ManagementPage.openPage(button));
    return cy.wrap(new AppPage(ManagementPage)).as('currentPage');
  }

}
