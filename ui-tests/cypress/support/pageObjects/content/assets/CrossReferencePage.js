import {htmlElements} from '../../WebElement.js';

import AdminContent from '../../app/AdminContent';

export default class CrossReferencePage extends AdminContent {

  static openPage(button) {
    super.loadPage(button, '/jacms/Resource/trash.action');
  }

  getAlert() {
    return this.get()
               .find(`${htmlElements.div}.alert`);
  }

  getAlertText() {
    return this.getAlert()
               .children(htmlElements.p);
  }

}
