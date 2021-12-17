
import { DATA_TESTID, htmlElements } from '../../WebElement';

import Content from '../../app/Content';

import AppPage from '../../app/AppPage';
import ManagementPage from './ManagementPage';
import DesignerPage from '../designer/DesignerPage';

export default class AddPage extends Content {

  titleInput = `${htmlElements.input}[name="titles.{lang}"]`;
  codeInput = `${htmlElements.input}[name=code]`;
  pageTreeSelector = `${htmlElements.div}[${DATA_TESTID}=PageForm__PageTreeSelector]`;
  saveAndDesignButton = `${htmlElements.button}[${DATA_TESTID}="common_PageForm_Button"]`;
  saveButton = `${htmlElements.button}[${DATA_TESTID}="save-page"]`;

  getTitleInput(lang) {
    return this.getContents()
               .find(this.titleInput.replace('{lang}', lang));
  }

  getCodeInput() {
    return this.getContents()
               .find(this.codeInput);
  }

  getPageTreeSelectorTable() {
    return this.getContents()
               .find(this.pageTreeSelector)
               .children(htmlElements.div)
               .children(htmlElements.table);
  }

  getSaveAndDesignButton() {
    return this.getContents()
               .find(this.saveAndDesignButton);
  }

  getSaveButton() {
    return this.getContents()
               .find(this.saveButton);
  }

  typeTitle(value, lang = 'en') {
    this.getTitleInput(lang).type(value);
  }

  typeCode(value) {
    this.getCodeInput().type(value);
  }

  selectPagePlacement(pageOrder) {
    this.getPageTreeSelectorTable()
        .children(htmlElements.tbody)
        .children(htmlElements.tr).eq(pageOrder)
        .click();
  }

  clearCode() {
    this.getCodeInput().clear();
  }

  clickSaveAndDesign() {
    this.getSaveAndDesignButton().click();
    cy.wait(1000); // TODO find a better way to identify when the page loaded
    return new AppPage(DesignerPage);
  }

  clickSave() {
    this.getSaveButton().click();
    cy.wait(1000); // TODO find a better way to identify when the page loaded
    return new AppPage(ManagementPage);
  }
}
