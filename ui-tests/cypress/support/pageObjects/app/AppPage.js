import {TEST_ID_KEY, htmlElements, WebElement} from "../WebElement.js";

import AppTour from "./AppTour.js";
import Navbar from "./Navbar.js";
import Menu from "./Menu.js";

export default class AppPage extends WebElement {

  root = `${htmlElements.div}#root`;
  page = `[${TEST_ID_KEY}=internal-page]`;
  toastList = `${htmlElements.div}.toast-notifications-list-pf`;
  dialog = `${htmlElements.div}[role=dialog]`;

  constructor(content) {
    super();
    this.appTour = new AppTour();
    this.menus = new Menus(this);
    this.content = new content(this);
  }

  get() {
    return this.parent.get()
               .children(htmlElements.body)
               .children(this.root)
               .children(this.page);
  }

  getDialog() {
    return this.parent.get()
               .children(htmlElements.body)
               .children(this.dialog)
  }

  getAppTour() {
    return this.appTour;
  }

  getNavbar() {
    return this.menus.getNavbar();
  }

  getToastList(){
    return this.parent.get()
        .children(htmlElements.body)
        .children(this.root)
        .children(this.toastList);
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

  menus = `[${TEST_ID_KEY}=internal-page_VerticalMenuContainer_div]`;

  constructor(parent) {
    super(parent);
    this.navbar = new Navbar(this);
    this.menu = new Menu(this);
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