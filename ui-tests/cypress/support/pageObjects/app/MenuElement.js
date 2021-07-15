import {DATA_TESTID, htmlElements, WebElement} from "../WebElement.js";

export class MenuElement extends WebElement {

  click() {
    this.get().click();
  }

}

export class SubMenu extends MenuElement {

  getHeader() {
    return this.get()
               .children(htmlElements.div)
               .children(htmlElements.div);
  }

  getElements() {
    return this.get()
               .children(htmlElements.div)
               .children(htmlElements.ul);
  }

  getCloseButton() {
    return this.parent.getCollapseButton();
  }

  open() {
    this.click();
    return this;
  }

  close() {
    this.getCloseButton().click();
    return this.parent;
  }

}