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

  getPageGrid() {
    return this.getContents()
      .children(htmlElements.div)
      .children(htmlElements.div)
      .children(this.pageGridTab)
      .children(this.designerDiv)
      .children(this.designerDiv).eq(1)
      .children(this.pageGridMain);
  }

  getDropQueryString(frameName) {
    return `${htmlElements.div}[${DATA_TESTID}=WidgetFrame__${frameName.replace(/\s/g, '_')}]`;
  }

  getSidebarTab(title) {
    return this.getSidebar()
      .children(this.configTabs).contains(title);
  }

  getSidebarContent() {
    return this.getSidebar()
      .children(htmlElements.div)
      .children(htmlElements.div);
  }

  getWidgetItemByWidgetName(name) {
    return this.getSidebarContent()
      .children(this.widgetGroupings)
      .children(this.widgetGroupings).eq(1)
      .children(this.widgetGrouping).contains(name);
  }

  getPageTreeItem(title) {
    return this.getSidebarContent()
      .children(htmlElements.div)
      .children(this.pageTreeTable)
      .children(this.pageTreeTbody)
      .children(this.pageTreeRow).contains(title);
  }

  gatherWidgetConfigPage(forWidget) {
    const { CMS_WIDGETS, PAGE_WIDGETS, SYSTEM_WIDGETS } = DesignerPage;
    switch (forWidget.code) {
      case CMS_WIDGETS.CONTENT.code:
      default:
        return ContentWidgetConfigPage;
    }
  }

  dragWidgetToFrame(widget, frameName) {
    this.getWidgetItemByWidgetName(widget.name)
      .drag(this.getDropQueryString(frameName), { position: 'center', force: true });
    
    const WidgetConfigPage = this.gatherWidgetConfigPage(widget);

    return new AppPage(WidgetConfigPage);
  }

  getKebabMenuByFrame(frameName) {
    return this.getContents()
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
