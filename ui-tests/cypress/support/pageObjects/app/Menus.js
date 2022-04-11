import {htmlElements, WebElement} from '../WebElement';

export default class Menus extends WebElement {

  menus = `${htmlElements.div}.safari-menu-fix`;

  getNavbar() {
    return this.navbar;
  }

  getMenu() {
    return this.menu;
  }

}
