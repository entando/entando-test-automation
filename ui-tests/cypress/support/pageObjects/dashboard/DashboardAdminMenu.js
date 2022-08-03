import {htmlElements} from '../WebElement.js';

import {MenuElement} from '../app/MenuElement.js';

export default class DashboardAdminMenu extends MenuElement {

  get() {
    return this.parent.get()
               .children(htmlElements.ul)
               .children(htmlElements.li).eq(0);
  }

}
