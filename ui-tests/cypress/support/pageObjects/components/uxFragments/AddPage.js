import AppPage from '../../app/AppPage.js';
import Content from '../../app/Content.js';
import { htmlElements } from '../../WebElement.js';
import UXFragmentsPage from './UXFragments.js';

export default class AddPage extends Content {

  codeInput = `${htmlElements.input}[name="code"]`;
  guiCodeInput = `${htmlElements.textarea}[name="guiCode"]`;
  saveBtn = `${htmlElements.button}[type=button]#saveopts`;
  saveOption = `${htmlElements.a}#regularSaveButton`;

  getCodeInput() {
    return this.get()
               .find(this.codeInput);
  }

  getGuiCodeInput() {
    return this.get()
               .find(this.guiCodeInput);
  }

  getSaveBtn() {
    return this.get()
               .find(this.saveBtn);
  }

  getSaveOption() {
    return this.get()
               .find(this.saveOption);
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
    return new AppPage(UXFragmentsPage);
  }

}
