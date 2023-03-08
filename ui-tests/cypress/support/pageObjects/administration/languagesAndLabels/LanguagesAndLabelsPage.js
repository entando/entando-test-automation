import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

export default class LanguagesAndLabelsPage extends AppContent {

  languageAndLabelsTabList = `${htmlElements.ul}.nav-tabs`;

  static openPage(button, waitDOM = false) {
    super.loadPage(button, '/labels-languages', false, waitDOM);
  }

  getLanguagesTab() {
    return this.getContents()
               .then(pageContent => pageContent
                   .find(this.languageAndLabelsTabList)
                   .children().eq(0));
  }

  getSystemLabelsTab() {
    return this.getContents()
               .then(pageContent => pageContent
                   .find(this.languageAndLabelsTabList)
                   .children().eq(1));
  }

}
