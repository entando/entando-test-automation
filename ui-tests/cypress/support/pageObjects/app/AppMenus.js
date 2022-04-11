import Menus from './Menus';

import Navbar from './Navbar';
import Menu   from './Menu';

export default class AppMenus extends Menus {

  constructor(parent) {
    super(parent);
    this.navbar = new Navbar(this);
    this.menu   = new Menu(this);
  }

  get() {
    return this.parent.get()
               .children(this.menus);
  }

}
