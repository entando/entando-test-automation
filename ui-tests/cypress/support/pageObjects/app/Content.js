import {htmlElements, WebElement} from '../WebElement.js';

export default class Content extends WebElement {

  content = `${htmlElements.div}.container-fluid`;

  alertMessageDiv = `${htmlElements.div}.ErrorsAlert`;

  get() {
    return this.parent.get()
               .children(this.content);
  }

  getContents() {
    return this.get()
               .children(htmlElements.div);
  }

  getBreadCrumb() {
    return this.getContents()
               .children(htmlElements.div).eq(0)
               .children(htmlElements.div)
               .children(htmlElements.ol);
  }

  getTitle() {
    return this.getContents()
               .children(htmlElements.div).eq(1)
               .find(htmlElements.h1);
  }

  getAlertMessage() {
    return this.getContents()
               .find(this.alertMessageDiv);
  }

}
