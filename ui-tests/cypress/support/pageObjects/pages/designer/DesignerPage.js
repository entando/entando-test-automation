import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content   from '../../app/Content';
import KebabMenu from '../../app/KebabMenu';

import AppPage from '../../app/AppPage';

import ContentWidgetConfigPage      from './widgetconfigs/ContentWidgetConfigPage';
import ContentListWidgetConfigPage  from './widgetconfigs/ContentListWidgetConfigPage';
import ContentQueryWidgetConfigPage from './widgetconfigs/ContentQueryWidgetConfigPage';
import MFEWidgetForm                from '../../components/mfeWidgets/MFEWidgetForm';

export default class DesignerPage extends Content {

  // Structure
  grid      = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Grid]`;
  container = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Row]`;
  contents  = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_Col]`;

  pageDiv = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigPage_div]`;

  pageStatusIcon = `${htmlElements.i}[${DATA_TESTID}=common_PageStatusIcon_i]`;

  // Designer
  basicTabs = `${htmlElements.div}#basic-tabs`;
  paneOne   = `${htmlElements.div}#basic-tabs-pane-1`;
  gridDiv   = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigGrid_div]`;
  gridRow   = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigGridRow_div]`;
  gridCol   = `${htmlElements.div}[${DATA_TESTID}=config_PageConfigGridCol_div]`;

  // Sidebar
  configTabs   = `${htmlElements.ul}[${DATA_TESTID}=config_ToolbarPageConfig_Tabs]`;
  toggleButton = `${htmlElements.button}[${DATA_TESTID}=config_ToolbarPageConfig_Button]`;

  // Widgets
  widgetGroupings = `${htmlElements.div}[${DATA_TESTID}=config_WidgetGroupings_div]`;
  widgetList      = `${htmlElements.div}[${DATA_TESTID}=config_WidgetGrouping_Collapse]`;
  widgetGrouping  = `${htmlElements.div}[${DATA_TESTID}=config_WidgetGrouping_div]`;

  // Page tree
  pageTreeTable = `${htmlElements.table}[${DATA_TESTID}=common_PageTreeCompact_table]`;
  pageTreeTbody = `${htmlElements.tbody}[${DATA_TESTID}=common_PageTreeCompact_tbody]`;
  pageTreeRow   = `${htmlElements.tr}[${DATA_TESTID}=common_PageTreeCompact_tr]`;

  frameMenuItem = `${htmlElements.a}[${DATA_TESTID}=config_WidgetFrame_MenuItem]`;
  frameMenuLink = `${htmlElements.a}[${DATA_TESTID}=config_WidgetFrame_Link]`;

  static FRAME_ACTIONS = {
    SAVE_AS: 'Save As',
    DETAILS: 'Details',
    SETTINGS: 'Settings',
    DELETE: 'Delete',
    EDIT: 'Edit'
  };

  static CMS_WIDGETS = {
    CONTENT: {
      name: 'Content',
      code: 'content_viewer'
    },
    CONTENT_LIST: {
      name: 'Content List',
      code: 'row_content_viewer_list'
    },
    CONTENT_QUERY: {
      name: 'Content Search Query',
      code: 'content_viewer_list'
    },
    SEARCH_FORM: {
      name: 'Search Form',
      code: 'search_form'
    },
    SEARCH_RESULT: {
      name: 'Search Results',
      code: 'search_result'
    },
    NEWS_ARCHIVE: {
      name: 'News Archive',
      code: 'NWS_Archive'
    },
    NEWS_LATEST: {
      name: 'News Latest',
      code: 'NWS_Latest'
    }
  };

  static PAGE_WIDGETS = {
    LANGUAGE: {
      name: 'Language',
      code: 'language'
    },
    LOGO: {
      name: 'Logo',
      code: 'logo'
    }
  };

  static SYSTEM_WIDGETS = {
    APIS: {
      name: 'APIs',
      code: 'entando_apis'
    },
    SYS_MSGS: {
      name: 'System Messages',
      code: 'messages_system'
    }
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

  getBreadCrumb() {
    return this.getContents()
               .children(htmlElements.ol);
  }

  getDesigner() {
    return this.getContents()
               .children(this.basicTabs);
  }

  getDesignerTabs() {
    return this.getDesigner()
               .children(htmlElements.ul);
  }

  getDesignerContent() {
    return this.getDesigner()
               .children(htmlElements.div)
               .children(this.paneOne)
               .children(this.pageDiv);
  }

  getTitle() {
    return this.getDesignerContent()
               .children(this.pageDiv)
               .children(htmlElements.h1);
  }

  getPageStatusIcon() {
    return this.getTitle()
               .children(this.pageStatusIcon);
  }

  getDesignerGrid() {
    return this.getDesignerContent()
               .children(this.gridDiv)
               .children(htmlElements.div);
  }

  getDesignerGridRows() {
    return this.getDesignerGrid()
               .children(this.gridRow);
  }

  getDesignerGridRow(rowPos) {
    return this.getDesignerGridRows()
               .eq(rowPos);
  }

  getDesignerGridRowCols(rowPos) {
    return this.getDesignerGridRow(rowPos)
               .children(this.gridCol);
  }

  getDesignerGridRowCol(rowPos, colPos) {
    return this.getDesignerGridRowCols(rowPos)
               .eq(colPos);
  }

  getBottomToolbar() {
    return this.getContents()
               .children(htmlElements.div).eq(1);
  }

  getSidebar() {
    return this.getMainContainer()
               .children(this.contents).eq(1)
               .children(htmlElements.div)
               .children(htmlElements.div);
  }

  getSidebarToggleButton() {
    return this.getSidebar()
               .children(this.toggleButton);
  }

  getSidebarTabs() {
    return this.getSidebar()
               .children(htmlElements.div)
               .children(this.configTabs);
  }

  getSidebarContent() {
    return this.getSidebar()
               .children(htmlElements.div)
               .children(htmlElements.div)
               .children(htmlElements.div)
               .children(htmlElements.div);
  }

  getSidebarWidgets() {
    return this.getSidebarContent()
               .children(htmlElements.div).eq(1);
  }

  getSidebarWidgetSection(sectionPos) {
    return this.getSidebarWidgets()
               .children(htmlElements.div).eq(sectionPos);
  }

  getSidebarWidgetSectionWidgets(sectionPos) {
    return this.getSidebarWidgetSection(sectionPos)
               .children(this.widgetList)
               .children(this.widgetGrouping);
  }

  getSidebarWidgetSectionWidget(sectionPos, widgetPos) {
    return this.getSidebarWidgetSectionWidgets(sectionPos)
               .children(htmlElements.div).eq(widgetPos);
  }

  getSidebarPageTreeTable() {
    return this.getSidebarContent()
               .children(this.pageTreeTable);
  }

  getSidebarPageTreeTableRows() {
    return this.getSidebarPageTreeTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getSidebarPageTreeTableRow(code) {
    return this.getSidebarPageTreeKebabMenu(code)
               .get()
               .parents(htmlElements.tr);
  }

  getSidebarPageTreeKebabMenu(code) {
    return new PageTreeKebabMenu(this, code);
  }

  clickSidebarTab(tabPos) {
    this.getSidebarTabs()
        .children(htmlElements.li).eq(tabPos)
        .click();
    cy.wait(1000); //TODO find a better way to identify when the sidebar loaded
  }

  selectPageFromSidebarPageTreeTable(code) {
    this.getSidebarPageTreeTableRow(code).click();
    cy.wait(3000); //TODO find a better way to identify when the grid loaded
  }

  dragWidgetToGrid(widgetSection, widgetPos, gridRow, gridCol) {
    this.getDesignerGridRowCol(gridRow, gridCol)
        .then(frame => this.getSidebarWidgetSectionWidget(widgetSection, widgetPos).drag(frame, {position: 'center'}));
  }

  dragGridWidgetToFrame(oriGridRow, oriGridCol, newGridRow, newGridCol) {
    this.getDesignerGridRowCol(newGridRow, newGridCol).children(htmlElements.div)
        .then(frame =>
            this.getDesignerGridRowCol(oriGridRow, oriGridCol).children(htmlElements.div)
                .drag(frame, {force: true, position: 'center'})
        );
    cy.wait(1000); //TODO find a better way to identify when the grid is refreshed
  }

  publishPageDesign() {
    this.getBottomToolbar()
        .children(htmlElements.div)
        .children(htmlElements.div).eq(1)
        .children(htmlElements.button).eq(1)
        .click();
  }

  getDropQueryString(frameName) {
    return `${htmlElements.div}[${DATA_TESTID}=WidgetFrame__${frameName.replace(/\s/g, '_')}]`;
  }

  getWidgetItemByWidgetName(name) {
    return this.getSidebarContent()
               .children(this.widgetGroupings).eq(1)
               .children(this.widgetGrouping).contains(name);
  }

  getPageTreeItem(title) {
    return this.getSidebarContent()
               .children(this.pageTreeTable)
               .children(this.pageTreeTbody)
               .children(this.pageTreeRow)
               .contains(title);
  }

  gatherWidgetConfigPage(forWidget) {
    const {CMS_WIDGETS} = DesignerPage;
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
        .drag(this.getDropQueryString(frameName), {position: 'center', force: true});

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

}

class PageTreeKebabMenu extends KebabMenu {

  get() {
    return this.parent.getSidebarPageTreeTableRows()
               .find(`[aria-labelledby=${this.code}]`)
               .parent();
  }

}
