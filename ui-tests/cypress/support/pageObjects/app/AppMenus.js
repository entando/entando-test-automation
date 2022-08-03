import Menus from './Menus';

import AppNavbar      from './AppNavbar';
import AppMenu        from './AppMenu';
import {htmlElements} from '../WebElement';

export default class AppMenus extends Menus {

  constructor(parent) {
    super(parent);
    this.navbar = new AppNavbar(this);
    this.menu   = new AppMenu(this);
  }

  get() {
    return this.parent.get().children(`${htmlElements.div}.MfeMenuContainer`);
  }

}
