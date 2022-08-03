import {WebElement} from '../WebElement';

export default class Menus extends WebElement {

  getNavbar() {
    return this.navbar;
  }

  getMenu() {
    return this.menu;
  }

}
