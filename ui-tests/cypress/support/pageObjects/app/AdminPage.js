import {htmlElements} from '../WebElement.js';

import AbstractPage   from './AbstractPage';
import Menus          from './Menus';

export default class AdminPage extends AbstractPage {

  toastList = `${htmlElements.div}.toast-notifications-list-pf`;


  constructor(content) {
    super();
    this.menus   = new Menus(this, true);
    this.content = new content(this);
  }

  get() {
    return this.parent.get()
               .children(htmlElements.body);
  }

  getNavbar() {
    return this.menus.getNavbar();
  }

  getMenu() {
    return this.menus.getMenu();
  }

  getToastList() {
    return this.parent.get()
               .children(htmlElements.body)
               .children(this.toastList);
  }

}
