import {htmlElements, WebElement} from '../WebElement.js';

import AppTour  from './AppTour.js';
import {Dialog} from './Dialog';
import Navbar   from './Navbar.js';
import Menu     from './Menu.js';

export default class AdminPage extends WebElement {

  root      = `${htmlElements.div}.container-fluid`;
  page      = `${htmlElements.div}[id="main"]`;
  toastList = `${htmlElements.div}.toast-notifications-list-pf`;

  constructor(content) {
    super();
    this.appTour = new AppTour();
    this.dialog  = new Dialog();
    this.menus   = new Menus(this);
    this.content = new content(this);
  }

  get() {
    return this.parent.get()
               .children(htmlElements.body);
  }

  getAppTour() {
    return this.appTour;
  }

  getDialog() {
    return this.dialog;
  }

  getToastList() {
    return this.parent.get()
               .children(htmlElements.body)
               .children(this.root)
               .children(this.toastList);
  }

  getNavbar() {
    return this.menus.getNavbar();
  }

  getMenu() {
    return this.menus.getMenu();
  }

  getContent() {
    return this.content;
  }

  closeAppTour() {
    this.getAppTour()
        .closeAndConfirm();
  }

}

class Menus extends WebElement {

    menus = `${htmlElements.div}.safari-menu-fix`;
  
    constructor(parent) {
      super(parent);
      this.navbar = new Navbar(this);
      this.menu   = new Menu(this);
    }
  
    get() {
      return this.parent.get()
                 .children(this.menus);
    }
  
    getNavbar() {
      return this.navbar;
    }
  
    getMenu() {
      return this.menu;
    }
  
}