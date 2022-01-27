import {htmlElements, WebElement} from '../WebElement';

export default class KebabMenu extends WebElement {

  constructor(parent, code) {
    super(parent);
    this.code = code;
  }

  get() {
    return this.parent.getTableRows()
               .find(`${htmlElements.button}#${this.code}-actions`)
               .closest(htmlElements.div);
  }

  open() {
    cy.wait(1000); //wait for the kebab menu to load
    this.get()
        .children(htmlElements.button)
        .click();
    return this;
  }

}
