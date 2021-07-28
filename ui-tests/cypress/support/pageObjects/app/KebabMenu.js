import {DATA_TESTID, htmlElements, WebElement} from "../WebElement";

export default class KebabMenu extends WebElement {

  constructor(parent, code) {
    super(parent);
    this.code = code;
  }

  get() {
    return this.parent.getTableRows()
               .find(`[${DATA_TESTID}=${this.code}-actions]`)
               .children(htmlElements.div);
  }

  open() {
    this.get()
        .children(htmlElements.button)
        .click();
    return this;
  }

}
