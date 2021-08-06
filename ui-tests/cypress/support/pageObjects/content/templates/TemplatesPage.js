import {DATA_TESTID, htmlElements, WebElement} from "../../WebElement.js";

import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import TemplateForm from "./TemplateForm.js";

export default class TemplatesPage extends Content {

  static TEMPLATE_ACTIONS = {
    EDIT: 'ContentTemplateList__menu-item-edit',
    DELETE: 'ContentTemplateList__menu-item-delete',
  };

  filterRow = `${htmlElements.div}.ContentTemplateList__filter.row`;
  tableArea = `${htmlElements.div}.ContentTemplateList__wrap`;

  getSearchArea() {
    return this.get()
      .find(this.filterRow).eq(0);
  }

  getListArea() {
    return this.get()
      .find(this.tableArea);
  }

  getKebabMenuButtonOfWidget(code) {
    return this.getListArea()
      .find(`${htmlElements.button}#ContentTemplateList-dropdown-${code}`);
  }

  openKebabMenuByWidgetCode(code, action) {
    this.getKebabMenuButtonOfWidget(code).click()
      .closest('div.dropdown')
      .find(`${htmlElements.li}.${action}`).filter(':visible')
      .click();
    switch(action) {
      case TemplatesPage.TEMPLATE_ACTIONS.EDIT:
        return new AppPage(TemplateForm);
      default:
        return null;
    }
  }

  getFootArea() {
    return this.get()
      .find(this.filterRow).eq(1);
  }

  getAddButton() {
    return this.getFootArea()
      .find(htmlElements.a);
  }

  clickAddButton() {
    this.getAddButton();
    return new AppPage(TemplateForm);
  }
}