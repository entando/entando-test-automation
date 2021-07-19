import {DATA_TESTID, htmlElements, WebElement} from "../WebElement.js";

import AppTour from "./AppTour.js";
import Dialog from "./Dialog";
import Navbar from "./Navbar.js";
import Menu from "./Menu.js";

export default class AppPage extends WebElement {

  root = `${htmlElements.div}#root`;
  page = `[${DATA_TESTID}=internal-page]`;
  toastList = `${htmlElements.div}.toast-notifications-list-pf`;

  constructor(content) {
    super();
    this.appTour = new AppTour();
    this.dialog = new Dialog();
    this.menus = new Menus(this);
    this.content = new content(this);
  }

  get() {
    return this.parent.get()
               .children(htmlElements.body)
               .children(this.root)
               .children(this.page);
  }

  getAppTour() {
    return this.appTour;
  }

  getDialog() {
    return this.dialog;
  }

  getToastList(){
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

  getModalDialogByTitle(title) {
    return this.get().children('[role=dialog]')
                .children(htmlElements.div)
                .children('.modal-dialog').contains(title);
  }

  closeAppTour() {
    this.getAppTour()
        .closeAndConfirm();
  }

}

class Menus extends WebElement {

  menus = `[${DATA_TESTID}=internal-page_VerticalMenuContainer_div]`;

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