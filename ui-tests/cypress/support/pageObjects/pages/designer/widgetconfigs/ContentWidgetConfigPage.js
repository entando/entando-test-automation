import {TEST_ID_KEY, htmlElements, WebElement} from "../../../WebElement.js";

import WidgetConfigPage from "../WidgetConfigPage.js";

export default class ContentWidgetConfigPage extends WidgetConfigPage {
  
  getAddContentButton() {
    return this.getMainContainer().contains('Add existing content');
  }

  getSelectContentModal() {
    return this.get().getModalDialogByTitle('Select one content item');
  }

}