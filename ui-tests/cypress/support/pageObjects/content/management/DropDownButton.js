import {htmlElements, WebElement} from '../../WebElement.js';
import ActionItems                from './ActionItems';

export default class DropDownButton extends WebElement {

  contentSaveButton = `${htmlElements.button}#saveopts`;

  get() {
    return this.parent.get()
               .children()
               .find(this.contentSaveButton);
  }

  open() {
    this.get().click();
    return new ActionItems();
  }

}
