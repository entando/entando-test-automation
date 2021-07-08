import {DATA_TESTID, htmlElements, WebElement} from "../../WebElement.js";

import Content from "../../app/Content.js";

export default class DesignerPage extends Content {

  grid = `${htmlElements.div}[${TEST_ID_KEY}=config_PageConfigPage_Grid]`;
  container = `${htmlElements.div}[${TEST_ID_KEY}=config_PageConfigPage_Row]`;
  contents = `${htmlElements.div}[${TEST_ID_KEY}=config_PageConfigPage_Col]`;
  configTabs = `${htmlElements.ul}[${TEST_ID_KEY}=config_ToolbarPageConfig_Tabs]`;
  pageTree = `${htmlElements.span}[${TEST_ID_KEY}=common_PageTreeCompact_span]`;
  widgetItem = `${htmlElements.div}[${TEST_ID_KEY}=config_WidgetGroupingItem_div]`;
  frameMenuItem = `${htmlElements.a}[${TEST_ID_KEY}=config_WidgetFrame_MenuItem]`;
  frameMenuLink = `${htmlElements.a}[${TEST_ID_KEY}=config_WidgetFrame_Link]`;

  static FRAME_ACTIONS = {
    SAVE_AS: 'Save As',
    DETAILS: 'Details',
    SETTINGS: 'Settings',
    DELETE: 'Delete',
  };

  getContents() {
    return this.parent.get()
               .children(this.grid)
               .children(this.container)
               .children(this.content).eq(0);
  }

  getBreadCrumb() {
    return this.getContents()
               .children(htmlElements.ol);
  }

  getTitle() {
    return this.getContents()
               .children(`${htmlElements.div}#basic-tabs`)
               .children(htmlElements.div)
               .children(`${htmlElements.div}#basic-tabs-pane-1`)
               .children(`${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_div]`)
               .children(`${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_div]`)
               .children(htmlElements.h1);
  }

  getWidgetItemByWidgetName(name) {
    return this.parent.get()
      .children(this.widgetItem).contains(name);
  }

  getWidgetItemByWidgetName(name) {
    return this.parent.get()
      .children(this.widgetItem).contains(name);
  }

  getDropQueryString(frameName) {
    return `${htmlElements.div}[${TEST_ID_KEY}=WidgetFrame__${frameName.replace(/\s/g, '_')}]`;
  }

  getSidebarTab(title) {
    return this.parent.get()
      .children(this.configTabs).contains(title);
  }

  getPageTreeItem(title) {
    return this.parent.get()
      .children(this.pageTree).contains(title);
  }

  dragWidgetToFrame(widgetName, frameName) {
    this.getWidgetItemByWidgetName(widgetName)
      .drag(this.getDropQueryString(frameName), { position: 'center', force: true });
  }

  getKebabMenuByFrame(frameName) {
    return this.parent.get()
      .children(this.getDropQueryString(frameName)).contains(frameName)
      .parent().find(htmlElements.button);
  }

  openKebabMenuByFrame(frameName) {
    this.getKebabMenuByFrame(frameName).click();
  }

  getKebabMenuItem(menuName, isLink = false) {
    return this.parent.get()
      .children(isLink ? this.frameMenuLink : this.frameMenuItem)
      .filter(':visible').contains(menuName);
  }

  getFrameAction(action) {
    return this.getKebabMenuItem(action, action === DesignerPage.FRAME_ACTIONS.DETAILS);
  }
}
