import {htmlElements} from '../WebElement.js';

import AbstractPage from './AbstractPage';

import AdminMenus from './AdminMenus';
import {AdminDialog}   from './AdminDialog';

export default class AdminPage extends AbstractPage {

  toastList = `${htmlElements.div}.toast-notifications-list-pf`;


  constructor(content) {
    super();
    this.menus   = new AdminMenus(this);
    this.content = new content(this);
    this.dialog  = new AdminDialog();
  }

  get() {
    return this.parent.get()
               .children(htmlElements.body);
  }
  getDialog() {
    return this.dialog;
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
