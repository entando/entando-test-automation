import {DATA_TESTID, htmlElements, WebElement} from '../WebElement';

export default class KebabMenu extends WebElement {

  constructor(parent, code) {
    super(parent);
    this.code = code;
  }

  get() {
    return this.parent.getTableRows()
               .contains(this.code)
               .parent()
  }

  open() {
    this.get()
        .find(htmlElements.button)
        .then((button) => {
          button.click();
        })
    return this;
  }

}
