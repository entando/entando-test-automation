import { DATA_TESTID, htmlElements, WebElement } from '../../WebElement';

import Content from '../../app/Content';
import AppPage from '../../app/AppPage';
import ContentWidgetConfigPage from './widgetconfigs/ContentWidgetConfigPage';
import ContentListWidgetConfigPage from './widgetconfigs/ContentListWidgetConfigPage';
import ContentQueryWidgetConfigPage from './widgetconfigs/ContentQueryWidgetConfigPage';
import MFEWidgetForm from '../../components/mfeWidgets/MFEWidgetForm';

export default class DesignerPage extends Content {

  grid = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Grid]`;
  container = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Row]`;
  contents = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Col]`;
  configTabs = `${htmlElements.ul}[${DATA_TESTID}=config_ToolbarPageConfig_Tabs]`;
  designerDiv = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_div]`;
  widgetItem = `${htmlElements.div}[${DATA_TESTID}=config_WidgetGroupingItem_div]`;
  frameMenuItem = `${htmlElements.a}[${DATA_TESTID}=config_WidgetFrame_MenuItem]`;
  frameMenuLink = `${htmlElements.a}[${DATA_TESTID}=config_WidgetFrame_Link]`;
  buttonToolbar = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_ButtonToolbar][role=toolbar]`;
  buttonViewPublished = `${htmlElements.button}[${DATA_TESTID}=config_PageConfigPage_Button].PageConfigPage__btn--viewPublishedPage`;
  pageStatusIcon = `i[${DATA_TESTID}=common_PageStatusIcon_i]`;
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
    EDIT: 'Edit',
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
    SEARCH_RESULT: {
      name: 'Search Results',
      code: 'search_result',
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

  initWindowOpenChecker() {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen').callsFake(url => {
          cy.visit(url);
      });
    });
  }

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

  getInnerContent() {
    return this.getContents()
      .children(`${htmlElements.div}#basic-tabs`)
      .children(htmlElements.div)
      .children(`${this.pageGridTab}#basic-tabs-pane-1`)
      .children(this.designerDiv);
  }

  getTitle() {
    return this.getInnerContent()
               .children(this.designerDiv).eq(0)
               .children(htmlElements.h1);
  }

  getTopControlsArea() {
    return this.getInnerContent()
              .children(`${this.container}.PageConfigPage__toolbar-row`)
              .children(this.contents);
  }

  getTopRightControls() {
    return this.getTopControlsArea()
              .children(this.buttonToolbar);
  }

  getViewPublishedButton() {
    return this.getTopRightControls()
              .find(this.buttonViewPublished);
  }

  getViewPublishedWindow() {
    return cy.get('@windowOpen');
  }

  viewPublished() {
    this.getViewPublishedButton().click();
    return new WebElement();
  }

  getPageGrid() {
    return this.getInnerContent()
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
    const { CMS_WIDGETS } = DesignerPage;
    switch (forWidget.code) {
      case CMS_WIDGETS.CONTENT_LIST.code:
        return ContentListWidgetConfigPage;
      case CMS_WIDGETS.CONTENT_QUERY.code:
        return ContentQueryWidgetConfigPage;
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
      .find(this.getDropQueryString(frameName)).contains(frameName)
      .parent().find(htmlElements.button);
  }

  openKebabMenuByFrame(frameName) {
    this.getKebabMenuByFrame(frameName).click();
  }

  getKebabMenuItem(menuName, isLink = false) {
    return this.getContents()
      .find(isLink ? this.frameMenuLink : this.frameMenuItem)
      .filter(':visible').contains(menuName);
  }

  getFrameAction(action) {
    const menuLinks = [DesignerPage.FRAME_ACTIONS.DETAILS, DesignerPage.FRAME_ACTIONS.EDIT];
    return this.getKebabMenuItem(action, menuLinks.includes(action));
  }

  clickActionOnFrame(action, widget) {
    this.getFrameAction(action).click();
    switch (action) {
      case DesignerPage.FRAME_ACTIONS.SETTINGS:
        return new AppPage(this.gatherWidgetConfigPage(widget));
      case DesignerPage.FRAME_ACTIONS.SAVE_AS:
      case DesignerPage.FRAME_ACTIONS.EDIT:
        return new AppPage(MFEWidgetForm);
      case DesignerPage.FRAME_ACTIONS.DELETE:
      case DesignerPage.FRAME_ACTIONS.DETAILS:
      default:
        return null;
    }
  }

  getPageStatus() {
    return this.getContents().find(this.pageStatusIcon).invoke('attr', 'title');
  }

  publishPageDesign() {
    return this.getContents()
      .find('.PageConfigPage__bottom-options')
      .contains(/^Publish$/)
      .click();
  }
}
