import {DATA_TESTID, htmlElements, WebElement} from "../WebElement.js";

export default class Content extends WebElement {

  content = `[${DATA_TESTID}=internal-page_InternalPage_div]`;

  get() {
    return this.parent.get()
               .children(this.content);
  }

  getRoot() {
    return cy.root();
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