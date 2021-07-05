import {TEST_ID_KEY, htmlElements, WebElement} from "../WebElement.js";

export default class Navbar extends WebElement {

  get() {
    return this.parent.get().children(htmlElements.nav);
  }

}