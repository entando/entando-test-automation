import {htmlElements} from '../WebElement.js';

import AbstractPage from './AbstractPage';

import AppMenus from './AppMenus';

export default class AppPage extends AbstractPage {


  root      = `${htmlElements.div}#root`;
  page      = `${htmlElements.div}.InternalPage`;
  toastList = `${htmlElements.div}.toast-notifications-list-pf`;

  constructor(content) {
    super();
    this.menus   = new AppMenus(this);
    this.content = new content(this);
  }

  get() {
    return this.parent.get()
               .children(htmlElements.body)
               .children(this.root)
               .children(this.page);
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
               .children(this.root)
               .children(this.toastList);
  }

}
