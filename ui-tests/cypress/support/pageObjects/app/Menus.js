import {htmlElements, WebElement} from '../WebElement';
import Navbar                     from './Navbar';
import Menu                       from './Menu';

export default class Menus extends WebElement {

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