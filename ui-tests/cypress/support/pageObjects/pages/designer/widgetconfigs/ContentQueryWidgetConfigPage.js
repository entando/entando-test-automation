import { htmlElements } from '../../../WebElement';

import WidgetConfigPage from '../WidgetConfigPage';

export default class ContentQueryWidgetConfigPage extends WidgetConfigPage {

  getContentTypeField() {
    return this.getMainContainer().find('[name="contentType"]');
  }

  getPublishSettingsAccordButton() {
    return this.getMainContainer().contains(/^Publishing settings$/i);
  }

  getMaxElemForItemDropdown() {
    return this.getMainContainer().find('[name="maxElemForItem"]');
  }


}
