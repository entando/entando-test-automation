import {TEST_ID_KEY, htmlElements, WebElement} from "../WebElement.js";

import {MenuElement} from "../app/MenuElement.js";

export default class RepositoryMenu extends MenuElement {

  get() {
    return this.parent.get()
               .children(htmlElements.ul)
               .children(htmlElements.li).eq(5);
  }

}