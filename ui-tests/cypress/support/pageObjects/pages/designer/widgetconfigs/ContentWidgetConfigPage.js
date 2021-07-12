import {TEST_ID_KEY, htmlElements, WebElement} from "../../../WebElement.js";

import Modal from '../../../app/Modal';

import WidgetConfigPage from "../WidgetConfigPage.js";

export class ContentListSelectModal extends Modal {
  getContentListTable() {
    return this.getModalBody()
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
    return this.getModalFooter()
              .contains('Choose');
  }
}

export default class ContentWidgetConfigPage extends WidgetConfigPage {
  
  getAddContentButton() {
    return this.getMainContainer().contains('Add existing content');
  }

  getSelectContentModal() {
    return new ContentListSelectModal(
      this.get().getModalDialogByTitle('Select one content item').closest('.modal-dialog')
    );
  }
}