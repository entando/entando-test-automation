import {htmlElements} from '../WebElement.js';

import Content from './Content';

export default class AppContent extends Content {

  get() {
    return this.parent.get().children(`${htmlElements.div}.container-fluid`);
  }

  getContents() {
    return this.get()
               .children(htmlElements.div);
  }

  getBreadCrumb() {
    return this.getContents()
               .children(`${htmlElements.div}.row`).eq(0)
               .children(htmlElements.div)
               .children(htmlElements.ol);
  }

  getTitle() {
    return this.getContents()
               .children(htmlElements.div).eq(1)
               .find(htmlElements.h1);
  }

  getAlertMessage() {
    return this.getContents().find(`${htmlElements.div}.ErrorsAlert`);
  }

}
