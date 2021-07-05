import {TEST_ID_KEY, htmlElements, WebElement} from "../WebElement.js";

export default class Content extends WebElement {

  content = `[${TEST_ID_KEY}=internal-page_InternalPage_div]`;

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
               .children(htmlElements.div)
               .children(htmlElements.div)
               .children(htmlElements.h1);
  }

}