import { htmlElements } from '../../../WebElement';

import {Dialog} from '../../../app/Dialog';

import WidgetConfigPage from '../WidgetConfigPage';

export class ContentListSelectModal extends Dialog {
  getContentListTable() {
    return this.getBody()
      .children('.Contents__body')
      .children(htmlElements.div).eq(1)
      .children(htmlElements.div)
      .children('.Contents__table')
      .children(htmlElements.table);
  }

  getTableRows() {
    return this.getContentListTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getCheckboxFromTitle(contentTitle) {
    return this.getTableRows()
              .contains(contentTitle)
              .closest(htmlElements.tr)
              .children('td').eq(0)
              .children('input[type=checkbox]');
  }

  getChooseButton() {
    return this.getFooterActionByLabel('Choose');
  }
}

export default class ContentWidgetConfigPage extends WidgetConfigPage {
  
  getAddContentButton() {
    return this.getMainContainer().contains('Add existing content');
  }

  getChangeContentButton() {
    return this.getMainContainer().contains('Change content');
  }

  getContentListTable() {
    return this.getBody()
      .children('.Contents__body')
      .children(htmlElements.div).eq(1)
      .children(htmlElements.div)
      .children('.Contents__table')
      .children(htmlElements.table);
  }

  getTableRows() {
    return this.getContentListTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getCheckboxFromTitle(contentTitle) {
    return this.getTableRows()
              .contains(contentTitle)
              .closest(htmlElements.tr)
              .children('td').eq(0)
              .children('input[type=checkbox]');
  }

  getChooseButton() {
    return this.getFooterActionByLabel('Choose');
  }

  getSelectContentModal() {
    return new ContentListSelectModal();
  }
}
