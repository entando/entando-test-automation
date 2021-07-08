import {DATA_TESTID, htmlElements, WebElement} from "../../WebElement.js";

import Content from "../../app/Content.js";
import AppPage from "../../app/AppPage.js";
import ContentWidgetConfigPage from "./widgetconfigs/ContentWidgetConfigPage.js";

export default class DesignerPage extends Content {

  grid = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Grid]`;
  container = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Row]`;
  contents = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Col]`;
  configTabs = `${htmlElements.ul}[${DATA_TESTID}=config_ToolbarPageConfig_Tabs]`;
  designerDiv = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_div]`;
  widgetItem = `${htmlElements.div}[${DATA_TESTID}=config_WidgetGroupingItem_div]`;
  frameMenuItem = `${htmlElements.a}[${DATA_TESTID}=config_WidgetFrame_MenuItem]`;
  frameMenuLink = `${htmlElements.a}[${DATA_TESTID}=config_WidgetFrame_Link]`;
  pageGridTab = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Tab]`;
  pageGridMain = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigGridCol_div]`;
  pageGridRow = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigGridRow_div]`;
  pageTreeTable = `${htmlElements.table}[${DATA_TESTID}=common_PageTreeCompact_table]`;
  pageTreeTbody = `${htmlElements.tbody}[${DATA_TESTID}=common_PageTreeCompact_tbody]`;
  pageTreeRow = `${htmlElements.tr}[${DATA_TESTID}=common_PageTreeCompact_tr]`;
  widgetGroupings = `${htmlElements.div}[${DATA_TESTID}=config_WidgetGroupings_div]`;
  widgetGrouping = `${htmlElements.div}[${DATA_TESTID}=config_WidgetGrouping_div]`;
  pageTree = `${htmlElements.span}[${DATA_TESTID}=common_PageTreeCompact_span]`;

  static FRAME_ACTIONS = {
    SAVE_AS: 'Save As',
    DETAILS: 'Details',
    SETTINGS: 'Settings',
    DELETE: 'Delete',
  };

  static CMS_WIDGETS = {
    CONTENT: {
      name: 'Content',
      code: 'content_viewer',
    },
    CONTENT_LIST: {
      name: 'Content List',
      code: 'row_content_viewer_list',
    },
    CONTENT_QUERY: {
      name: 'Content Search Query',
      code: 'content_viewer_list',
    },
    SEARCH_FORM: {
      name: 'Search Form',
      code: 'search_form',
    },
    NEWS_ARCHIVE: {
      name: 'News Archive',
      code: 'NWS_Archive',
    },
    NEWS_LATEST: {
      name: 'News Latest',
      code: 'NWS_Latest',
    },
  };

  static PAGE_WIDGETS = {
    LANGUAGE: {
      name: 'Language',
      code: 'language',
    },
    LOGO: {
      name: 'Logo',
      code: 'logo',
    },
  };

  static SYSTEM_WIDGETS = {
    APIS: {
      name: 'APIs',
      code: 'entando_apis',
    },
    SYS_MSGS: {
      name: 'System Messages',
      code: 'messages_system',
    },
  };

  getMainContainer() {
    return this.get()
                .children(this.grid)
                .children(this.container);
  }

  getContents() {
    return this.getMainContainer()
               .children(this.contents).eq(0);
  }

  getSidebar() {
    return this.getMainContainer()
              .children(this.contents).eq(1)
              .children(htmlElements.div)
              .children(htmlElements.div)
              .children(htmlElements.div);
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
    return `${htmlElements.div}[${DATA_TESTID}=WidgetFrame__${frameName.replace(/\s/g, '_')}]`;
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
