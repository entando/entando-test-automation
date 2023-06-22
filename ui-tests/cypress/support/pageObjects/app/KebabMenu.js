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

  getDropdown() {
    return this.get()
               .children(`${htmlElements.ul}.dropdown-menu`);
  }

  open(force = false) {
    cy.wait(500);
    this.get()
        .children(htmlElements.button)
        .click({force: force});
    return this;
  }

}
