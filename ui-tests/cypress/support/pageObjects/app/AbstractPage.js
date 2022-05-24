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

  getContent() {
    return this.content;
  }

  closeAppTour() {
    this.getAppTour()
        .closeAndConfirm();
  }

}
