import { htmlElements } from '../../../WebElement';

import { DialogContent } from '../../../app/Dialog';

import WidgetConfigPage from '../WidgetConfigPage';

export class ContentListSelectModal extends DialogContent {
  getContentListTable() {
    return this.get()
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
}

export default class ContentWidgetConfigPage extends WidgetConfigPage {
  
  getAddContentButton() {
    return this.getInnerPanel().find('button.btn.btn-primary')
      .contains(/^Add existing content$/);
  }

  clickAddContentButton() {
    this.getAddContentButton().click();
    this.setDialogBodyWithClass(ContentListSelectModal);
  }

  getChangeContentButton() {
    return this.getInnerPanel().find('button.btn.btn-primary')
      .contains(/^Change content$/);
  }

  clickChangeContentButton() {
    this.getChangeContentButton().click();
    this.setDialogBodyWithClass(ContentListSelectModal);
  }
}
