import {DATA_TESTID, htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';
import KebabMenu  from '../../app/KebabMenu';

import AppPage from '../../app/AppPage';

import ContentWidgetConfigPage      from './widgetconfigs/ContentWidgetConfigPage';
import ContentListWidgetConfigPage  from './widgetconfigs/ContentListWidgetConfigPage';
import ContentQueryWidgetConfigPage from './widgetconfigs/ContentQueryWidgetConfigPage';
import MFEWidgetForm                from '../../components/mfeWidgets/MFEWidgetForm';
import DetailsPage                  from '../../components/mfeWidgets/DetailsPage';

export default class DesignerPage extends AppContent {

  // Structure
  grid      = `${htmlElements.div}.container-fluid`;
  container = `${htmlElements.div}.row`;
  contents  = `${htmlElements.div}.PageConfigPage__main`;
  sidebar   = `${htmlElements.div}.PageConfigPage__side-widget`;

  pageDiv = `${htmlElements.div}`;

  pageStatusIcon = `${htmlElements.i}.PageStatusIcon`;

  // Designer
  basicTabs = `${htmlElements.div}#basic-tabs`;
  paneOne   = `${htmlElements.div}#basic-tabs-pane-1`;
  gridDiv   = `${htmlElements.div}.PageConfigGrid`;
  gridRow   = `${htmlElements.div}.PageConfigGridRow`;
  gridCol   = `${htmlElements.div}.PageConfigGridCol`;

  // Sidebar
  configTabs   = `${htmlElements.ul}[role=tablist].nav-tabs`;
  toggleButton = `${htmlElements.button}[${DATA_TESTID}=config_ToolbarPageConfig_Button]`;

  // Widgets
  widgetGroupings = `${htmlElements.div}[${DATA_TESTID}=config_WidgetGroupings_div]`;
  widgetList      = `${htmlElements.div}.collapse`;
  widgetGrouping  = `${htmlElements.div}.WidgetGrouping__item-area`;

  // Page tree
  pageTreeTable = `${htmlElements.table}.PageTreeCompact`;
  pageTreeTbody = `${htmlElements.tbody}`;
  pageTreeRow   = `${htmlElements.tr}.PageTreeCompact__row`;

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
               .children(this.contents);
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

  getDesignerGridFrame(rowPos, colPos) {
    return this.getDesignerGridRowCols(rowPos)
               .eq(colPos);
  }

  getDesignerGridFrameKebabMenu(rowPos, colPos, widgetCode) {
    return new GridFrameKebabMenu(this, rowPos, colPos, widgetCode);
  }

  getBottomToolbar() {
    return this.getContents()
               .children(htmlElements.div).eq(1);
  }

  getSidebar() {
    return this.getMainContainer()
               .children(this.sidebar)
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

  designPageFromSidebarPageTreeTable(code) {
    this.clickSidebarPageTreeKebabMenu(code).clickDesignButton();
  }

  clickSidebarPageTreeKebabMenu(code) {
    this.getSidebarPageTreeKebabMenu(code).get().click();
    return this.getSidebarPageTreeKebabMenu(code);
  }

  getSidebarPageTreeKebabMenu(code) {
    return new SidebarPageTreeKebabMenu(this, code);
  }

  dragGridWidgetToFrame(oriGridRow, oriGridCol, newGridRow, newGridCol) {
    this.getDesignerGridFrame(newGridRow, newGridCol).children(htmlElements.div)
        .then(frame =>
            this.getDesignerGridFrame(oriGridRow, oriGridCol).children(htmlElements.div)
                .drag(frame, {force: true, position: 'center'})
        );
  }

  publishPageDesign() {
    this.getBottomToolbar()
        .children(htmlElements.div)
        .children(htmlElements.div).eq(1)
        .children(htmlElements.button).eq(1)
        .click();
  }

  clickSidebarTab(tabPos) {
    this.getSidebarTabs()
        .children(htmlElements.li).eq(tabPos)
        .click();
  }

  toggleSidebarWidgetSection(sectionPos) {
    this.getSidebarWidgetSection(sectionPos).click();
  }

  dragWidgetToGrid(widgetSection, widgetPos, gridRow, gridCol) {
    this.getDesignerGridFrame(gridRow, gridCol)
        .then(frame => this.getSidebarWidgetSectionWidget(widgetSection, widgetPos).drag(frame, {position: 'center'}));
  }

  dragConfigurableWidgetToGrid(widgetSection, widgetPos, gridRow, gridCol, widgetCode) {
    this.dragWidgetToGrid(widgetSection, widgetPos, gridRow, gridCol);

    const WidgetConfigPage = this.gatherWidgetConfigPage(widgetCode);
    return new AppPage(WidgetConfigPage);
  }

  selectPageFromSidebarPageTreeTable(code) {
    this.getSidebarPageTreeTableRow(code).click();
  }

  gatherWidgetConfigPage(widgetCode) {
    const {CMS_WIDGETS} = DesignerPage;
    switch (widgetCode) {
      case CMS_WIDGETS.CONTENT_LIST.code:
        return ContentListWidgetConfigPage;
      case CMS_WIDGETS.CONTENT_QUERY.code:
        return ContentQueryWidgetConfigPage;
      case CMS_WIDGETS.CONTENT.code:
      default:
        return ContentWidgetConfigPage;
    }
  }

}

class GridFrameKebabMenu extends KebabMenu {

  settings = `${htmlElements.li}.WidgetFrame__settings-btn`;
  saveAs   = `${htmlElements.li}.WidgetFrame__saveAs-btn`;
  delete   = `${htmlElements.li}.WidgetFrame__delete-btn`;

  constructor(parent, row, col, widgetCode) {
    super(parent);
    this.row        = row;
    this.col        = col;
    this.widgetCode = widgetCode;
  }

  get() {
    return this.parent.getDesignerGridFrame(this.row, this.col)
               .children(htmlElements.div)
               .children(htmlElements.div)
               .children(htmlElements.div).eq(1);
  }

  getDetails() {
    return this.get()
               .find(`#detail-widget-${this.widgetCode}`);
  }

  getEdit() {
    return this.get()
               .find(`#edit-widget-${this.widgetCode}`);
  }

  getSettings() {
    return this.get()
               .find(this.settings);
  }

  getSaveAs() {
    return this.get()
               .find(this.saveAs);
  }

  getDelete() {
    return this.get()
               .find(this.delete);
  }

  openDetails() {
    this.getDetails().click();
    return new AppPage(DetailsPage);
  }

  openEdit() {
    this.getEdit().click();
    return new AppPage(MFEWidgetForm);
  }

  openSettings() {
    this.getSettings().click();
    return new AppPage(this.parent.gatherWidgetConfigPage(this.widgetCode));
  }

  openSaveAs() {
    this.getSaveAs().click();
    return new AppPage(MFEWidgetForm);
  }

  clickDelete() {
    this.getDelete().click();
  }

}

class SidebarPageTreeKebabMenu extends KebabMenu {

  get() {
    return this.parent.getSidebarPageTreeTableRows()
               .find(`[aria-labelledby=${this.code}]`)
               .parent();
  }

  getMenuItems() {
    return this.get().find(`${htmlElements.a}[role="menuitem"]`);
  }

  getDesignButton() {
    return this.getMenuItems().eq(1);
  }

  clickDesignButton() {
    this.getDesignButton().click();
  }

}
