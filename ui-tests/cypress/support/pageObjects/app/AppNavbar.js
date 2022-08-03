import {htmlElements} from '../WebElement.js';

import Navbar  from './Navbar';

export default class AppNavbar extends Navbar {

  get() {
    return this.parent.get()
               .children(`${htmlElements.div}.MfeMenuContainer__header-menu-container`)
               .children(htmlElements.nav);
  }

  getNavMenu() {
    return this.get().children(htmlElements.ul);
  }

}
