import {htmlElements} from '../WebElement.js';

import Content from './Content';

export default class AdminContent extends Content {

  get() {
    return this.parent.get();
  }

  getContents() {
    return this.get().children(`${htmlElements.div}.container-fluid`);
  }

  getBreadCrumb() {
    return this.getContents().children(htmlElements.ol);
  }

  getTitle() {
    return this.getContents().children(htmlElements.h1);
  }

  getAlertMessage() {
    return this.getContents().find(`${htmlElements.div}.alert`);
  }

}
