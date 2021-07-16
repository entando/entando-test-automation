import { TEST_ID_KEY, htmlElements } from '../../WebElement';

import Content from '../../app/Content';
import AppPage from '../../app/AppPage';
import MFEWidgetForm from './MFEWidgetForm';
import Modal from '../../app/Modal';

export default class MFEWidgetsPage extends Content {

  static WIDGET_ACTIONS = {
    EDIT: 'WidgetListRow__menu-item-edit',
    DELETE: 'WidgetListRow__menu-item-delete',
  };

  maincontent = `${htmlElements.div}[${TEST_ID_KEY}=list_ListWidgetPage_Grid]`;
  rowlayout = `${htmlElements.div}[${TEST_ID_KEY}=list_ListWidgetPage_Row]`;

  getContents() {
    return this.get()
      .children(this.maincontent);
  }

  getListArea() {
    return this.getContents()
      .find(this.rowlayout).eq(2);
  }

  getKebabMenuID(widgetCode) {
    return `${htmlElements.div}[${TEST_ID_KEY}=${widgetCode}-actions]`;
  }

  getKebabMenuOfWidget(code) {
    return this.getListArea()
      .find(this.getKebabMenuID(code));
  }

  getVisibleMenuItemFromKebab(action) {
    return this.getListArea()
      .find(`${htmlElements.li}.${action} > a`).filter(':visible');
  }

  openKebabMenuByWidgetCode(code, action) {
    this.getKebabMenuOfWidget(code).click();
    this.getListArea()
      .find(`${htmlElements.li}.${action} > a`).filter(':visible').click();
  }

  getFooterArea() {
    return this.getContents()
      .children(this.rowlayout).eq(3);
  }

  getAddButton() {
    return this.getFooterArea()
               .contains(/^Add$/);
  }

  openAddWidgetForm() {
    this.getAddButton().click();
    return new AppPage(MFEWidgetForm);
  }

  getDeletePromptModal() {
    return new Modal(
      this.get().getModalDialogByTitle('Delete').closest('.modal-dialog'),
    );
  }

}