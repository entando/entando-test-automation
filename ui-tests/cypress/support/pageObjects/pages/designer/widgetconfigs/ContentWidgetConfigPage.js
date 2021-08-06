import { htmlElements } from '../../../WebElement';

import { DialogContent } from '../../../app/Dialog';

import WidgetConfigPage from '../WidgetConfigPage';
import AppPage from '../../../app/AppPage';
import AddContentPage from '../../../content/management/AddPage';

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

  addButtonArea = `${htmlElements.div}.SingleContentConfigFormBody__addButtons`;
  buttonClass = `${htmlElements.button}.btn.btn-primary`;
  buttonDropdown = `${htmlElements.div}.dropdown.btn-group-primary`;
  modelIdSelect = `${htmlElements.select}[name="modelId"]`;

  getAddButtonsArea() {
    return this.getInnerPanel().find(this.addButtonArea);
  }
  
  getAddContentButton() {
    return this.getAddButtonsArea().children(this.buttonClass);
  }

  getAddNewButtonDropdown() {
    return this.getAddButtonsArea().children(this.buttonDropdown);
  }

  getButtonAddByContentTypeName(ctype) {
    return this.getAddNewButtonDropdown()
      .children(htmlElements.ul)
      .children(htmlElements.li)
      .contains(ctype);
  }

  clickNewContentWith(ctype) {
    this.getAddNewButtonDropdown().click();
    this.getButtonAddByContentTypeName(ctype);
    return new AppPage(AddContentPage);
  }

  clickAddContentButton() {
    this.getAddContentButton().click();
    this.setDialogBodyWithClass(ContentListSelectModal);
  }

  getChangeContentButton() {
    return this.getAddContentButton();
  }

  getModelIdSelect() {
    return this.getInnerPanel()
      .find(this.modelIdSelect);
  }

  clickChangeContentButton() {
    this.getChangeContentButton().click();
    this.setDialogBodyWithClass(ContentListSelectModal);
  }
}
