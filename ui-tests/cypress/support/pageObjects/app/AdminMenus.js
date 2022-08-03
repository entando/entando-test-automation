import Menus from './Menus';

import AdminMenu   from './AdminMenu';
import AdminNavbar from './AdminNavbar';

export default class AdminMenus extends Menus {

  constructor(parent) {
    super(parent);
    this.navbar = new AdminNavbar(this);
    this.menu   = new AdminMenu(this);
  }

  get() {
    return this.parent.get();
  }

}
