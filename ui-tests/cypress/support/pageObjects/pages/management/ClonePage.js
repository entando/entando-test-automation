import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import AppPage        from '../../app/AppPage';
import ManagementPage from './ManagementPage';
import DesignerPage   from '../designer/DesignerPage';

export default class AddPage extends AppContent {

  titleInput          = `${htmlElements.input}[name="titles.{lang}"]`;
  codeInput           = `${htmlElements.input}[name=code]`;
  pageTreeSelector    = `${htmlElements.table}.PageTreeSelector`;
  selectArea          = `${htmlElements.span}.PageTreeSelector__select-area`;
  saveAndDesignButton = `${htmlElements.button}.PageForm__save-and-configure-btn`;
  saveButton          = `${htmlElements.button}.PageForm__save-btn`;

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
               .find(this.pageTreeSelector);
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
        .find(this.selectArea)
        .click();
  }

  clearCode() {
    this.getCodeInput().clear();
  }

  clickSaveAndDesign() {
    this.getSaveAndDesignButton().click();
    return new AppPage(DesignerPage);
  }

  clickSave() {
    this.getSaveButton().click();
    return new AppPage(ManagementPage);
  }
}
