import {WebElement} from '../WebElement';
import AppTour      from './AppTour';
import {Dialog}     from './Dialog';

export default class AbstractPage extends WebElement {

  constructor() {
    super();
    this.appTour = new AppTour();
    this.dialog  = new Dialog();
  }

  getAppTour() {
    return this.appTour;
  }

  getDialog() {
    return this.dialog;
  }
  getContent() {
    return this.content;
  }

  closeAppTour() {
    this.getAppTour()
        .closeAndConfirm();
  }

}
