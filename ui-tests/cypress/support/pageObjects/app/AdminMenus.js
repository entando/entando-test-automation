import Menus from './Menus';

import Menu   from './Menu';
import Navbar from './Navbar';

export default class AdminMenus extends Menus {

  constructor(parent) {
    super(parent);
    this.navbar = new Navbar(this);
    this.menu   = new Menu(this);
  }

  get() {
    return this.parent.get();
  }

}
