import {DATA_TESTID, htmlElements, WebElement} from '../WebElement';

export default class KebabMenu extends WebElement {

  constructor(parent, code) {
    super(parent);
    this.code = code;
  }

  get() {
    return this.parent.getTableRows()
               .find(`${htmlElements.td}.RoleListRow__td`)
               .children();
  }

  open() {
    this.get()
        .children(`#${this.code}-actions`)
        .click();
    return this;
  }

}
