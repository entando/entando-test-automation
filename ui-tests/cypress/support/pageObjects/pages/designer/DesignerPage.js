import {DATA_TESTID, htmlElements, WebElement} from "../../WebElement.js";

import Content from "../../app/Content.js";

export default class DesignerPage extends Content {

  grid = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Grid]`;
  container = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Row]`;
  contents = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Col]`;

  getContents() {
    return this.parent.get()
               .children(this.grid)
               .children(this.container)
               .children(this.content).eq(0);
  }

  getBreadCrumb() {
    return this.getContents()
               .children(htmlElements.ol);
  }

  getTitle() {
    return this.getContents()
               .children(`${htmlElements.div}#basic-tabs`)
               .children(htmlElements.div)
               .children(`${htmlElements.div}#basic-tabs-pane-1`)
               .children(`${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_div]`)
               .children(`${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_div]`)
               .children(htmlElements.h1);
  }

}