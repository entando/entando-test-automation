import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent.js';

export default class DetailsPage extends AppContent {

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
