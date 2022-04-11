import {htmlElements, WebElement} from '../WebElement';
import Navbar                     from './Navbar';
import Menu                       from './Menu';

export default class Menus extends WebElement {

  menus     = `${htmlElements.div}.safari-menu-fix`;
  adminPage = false;

  constructor(parent, adminPage = false) {
    super(parent);
    this.navbar    = new Navbar(this);
    this.menu      = new Menu(this);
    if(adminPage) this.adminPage = adminPage;
  }

  get() {
    if(this.adminPage) {
      return this.parent.get();
    } else {
      return this.parent.get()
                 .children(this.menus);
    }
  }

  getNavbar() {
    return this.navbar;
  }

  getMenu() {
    return this.menu;
  }

}
