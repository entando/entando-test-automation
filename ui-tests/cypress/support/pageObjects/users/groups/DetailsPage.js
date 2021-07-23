import {htmlElements} from "../../WebElement";

import Content from "../../app/Content.js";

export default class DetailsPage extends Content {

  getDetailsTable() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .children(htmlElements.div)
               .children(htmlElements.div);
  }

  getDetailsInfo() {
    return this.getDetailsTable()
               .children(htmlElements.div).eq(0);
  }

  getDetailsRows() {
    return this.getDetailsInfo()
               .children(htmlElements.div);
  }

  getDetailsTabs() {
    return this.getDetailsTable()
               .children(htmlElements.div).eq(1);
  }

}
