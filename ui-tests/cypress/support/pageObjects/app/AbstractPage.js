import {WebElement} from '../WebElement';

import AppTour      from './AppTour';

export default class AbstractPage extends WebElement {

  constructor() {
    super();
    this.appTour = new AppTour();
  }

  getAppTour() {
    return this.appTour;
  }

  getDialog() {
    return this.dialog;
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

}
