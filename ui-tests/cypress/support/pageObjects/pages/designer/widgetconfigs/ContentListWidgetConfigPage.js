import { htmlElements } from '../../../WebElement';

import WidgetConfigPage from '../WidgetConfigPage';

export default class ContentListWidgetConfigPage extends WidgetConfigPage {

  getContentListTableBody() {
    return this.getMainContainer().find('.Contents__body');
  }

  getContentListTableRowWithTitle(title) {
    return this.getContentListTableBody().find('td').contains(title).siblings();
  }

  getModelIdDropdownByIndex(idx) {
    return this.getMainContainer().find(`[name="contents[${idx}].modelId"]`);
  }
}
