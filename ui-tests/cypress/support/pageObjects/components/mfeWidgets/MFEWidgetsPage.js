import { DATA_TESTID, htmlElements } from '../../WebElement';

import Content from '../../app/Content';
import AppPage from '../../app/AppPage';
import MFEWidgetForm from './MFEWidgetForm';

export default class MFEWidgetsPage extends Content {

  static WIDGET_ACTIONS = {
    EDIT: 'WidgetListRow__menu-item-edit',
    DELETE: 'WidgetListRow__menu-item-delete',
  };

  maincontent = `${htmlElements.div}[${DATA_TESTID}=list_ListWidgetPage_Grid]`;
  rowlayout = `${htmlElements.div}[${DATA_TESTID}=list_ListWidgetPage_Row]`;

  getContents() {
    return this.get()
      .children(this.maincontent);
  }

  getListArea() {
    return this.getContents()
      .find(this.rowlayout).eq(2);
  }

  getKebabMenuOfWidget(code) {
    return this.getListArea()
      .find(`${htmlElements.div}[${DATA_TESTID}=${code}-actions]`);
  }

  getVisibleMenuItemFromKebab(action) {
    return this.getListArea()
      .find(`${htmlElements.li}.${action} > a`).filter(':visible');
  }

  openKebabMenuByWidgetCode(code, action) {
    this.getKebabMenuOfWidget(code).click();
    this.getVisibleMenuItemFromKebab(action).click();
    switch(action) {
      case MFEWidgetsPage.WIDGET_ACTIONS.EDIT:
        return new AppPage(MFEWidgetForm);
      case MFEWidgetsPage.WIDGET_ACTIONS.DELETE:
      default:
        return null;
    }
  }

  getFooterArea() {
    return this.getContents()
      .children(this.rowlayout).eq(3);
  }

  getAddButton() {
    return this.getFooterArea()
               .find('a[type=button]').contains(/^Add$/);
  }

  openAddWidgetForm() {
    this.getAddButton().click();
    return new AppPage(MFEWidgetForm);
  }
}
