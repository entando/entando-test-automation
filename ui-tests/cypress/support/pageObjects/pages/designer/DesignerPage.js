import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';
import KebabMenu  from '../../app/KebabMenu';

import AppPage from '../../app/AppPage';

import ContentWidgetConfigPage      from './widgetconfigs/ContentWidgetConfigPage';
import ContentListWidgetConfigPage  from './widgetconfigs/ContentListWidgetConfigPage';
import ContentQueryWidgetConfigPage from './widgetconfigs/ContentQueryWidgetConfigPage';
import MFEWidgetForm                from '../../components/mfeWidgets/MFEWidgetForm';
import DetailsPage                  from '../../components/mfeWidgets/DetailsPage';
import {generateRandomNumericId}    from '../../../utils';

export default class DesignerPage extends AppContent {

  // Structure
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

  // Widgets
  widgetList      = `${htmlElements.div}.collapse`;
  widgetGrouping  = `${htmlElements.div}.WidgetGrouping__item-area`;

  // Page tree
  pageTreeTable = `${htmlElements.table}.PageTreeCompact`;
  pageTreeTbody = `${htmlElements.tbody}`;
  pageTreeRow   = `${htmlElements.tr}.PageTreeCompact__row`;

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
    }
  };

  static openPage(button, code = 'homepage') {
    super.loadPage(button, `/page/configuration/${code}`, false, true);
  }

  static confirmConfig(button, code = 'homepage') {
    cy.get('@currentPage').then(page => {
      const randomLabel = generateRandomNumericId();
      cy.time(randomLabel);
      cy.get(button).click();
      cy.validateUrlPathname(`/page/configuration/${code}`);
      cy.validateToast(page);
      cy.waitForStableDOM();
      cy.timeEnd(randomLabel).then(entry => {
        cy.log(`Loaded in ${entry.duration} ms`);
        cy.addToReport(() => ({
          title: this.name === page.content.constructor.name ? `Load time of ${this.name} after action` : `Load time from ${page.content.constructor.name} to ${this.name}`,
          value: `${entry.duration} ms`
        }));
      });
    });
  }

  getMainContainer() {
    return super.getContents().children(this.container);
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
    this.getSidebarPageTreeKebabMenu(code)
        .get().closest(htmlElements.tr).then(button => DesignerPage.openPage(button, code));
    return cy.get('@currentPage');
  }

  clickSidebarPageTreeKebabMenu(code) {
    this.getSidebarPageTreeKebabMenu(code).get().click();
    return this.getSidebarPageTreeKebabMenu(code);
  }

  getSidebarPageTreeKebabMenu(code) {
    return new SidebarPageTreeKebabMenu(this, code);
  }

  dragGridWidgetToFrame(page, oriGridRow, oriGridCol, newGridRow, newGridCol) {
    this.getDesignerGridFrame(newGridRow, newGridCol)
        .then(frame =>
            this.getDesignerGridFrame(oriGridRow, oriGridCol).then(widget => {
              cy.pagesController().then((controller => controller.intercept({method: 'PUT'}, 'widgetAddedToPage', `/${page.code}/widgets/*`)));
              cy.get(widget).drag(frame, {position: 'center'});
              cy.wait('@widgetAddedToPage');
            }));
    return cy.get('@currentPage');
  }

  publishPageDesign(code) {
    this.getBottomToolbar()
        .children(htmlElements.div)
        .children(htmlElements.div).eq(1)
        .children(htmlElements.button).eq(1)
        .then(button => {
          cy.pagesController().then((controller => controller.intercept({method: 'PUT'}, 'pageStatusChanged', `/${code}/status`)));
          cy.get(button).click();
          cy.wait('@pageStatusChanged');
          cy.waitForStableDOM();
        });
    return cy.get('@currentPage');
  }

  clickSidebarTab(tabPos) {
    this.getSidebarTabs()
        .children(htmlElements.li).eq(tabPos)
        .then(button => {
          cy.get(button).click();
          cy.waitForStableDOM();
        });
    return cy.get('@currentPage');
  }

  toggleSidebarWidgetSection(sectionPos) {
    this.getSidebarWidgetSection(sectionPos).click();
    return cy.get('@currentPage');
  }

  dragWidgetToGrid(widgetSection, widgetPos, gridRow, gridCol) {
    this.getDesignerGridFrame(gridRow, gridCol)
        .then(frame => this.getSidebarWidgetSectionWidget(widgetSection, widgetPos).then(widget => {
          cy.get(widget).drag(frame, {position: 'center'});
        }));
  }

  addWidgetToGrid(page, widgetSection, widgetPos, gridRow, gridCol) {
    cy.pagesController().then((controller => controller.intercept({method: 'PUT'}, 'widgetAddedToPage', `/${page.code}/widgets/*`)));
    this.dragWidgetToGrid(widgetSection, widgetPos, gridRow, gridCol);
    cy.wait('@widgetAddedToPage');
    return cy.get('@currentPage');
  }

  dragConfigurableWidgetToGrid(page, widgetSection, widgetPos, gridRow, gridCol, widgetCode) {
    this.dragWidgetToGrid(widgetSection, widgetPos, gridRow, gridCol);
    const WidgetConfigPage = this.gatherWidgetConfigPage(page, widgetCode, widgetPos);
    return cy.wrap(new AppPage(WidgetConfigPage)).as('currentPage');
  }

  gatherWidgetConfigPage(pageCode, widgetCode, widgetPos) {
    const {CMS_WIDGETS} = DesignerPage;
    switch (widgetCode) {
      case CMS_WIDGETS.CONTENT_LIST.code:
        ContentListWidgetConfigPage.openPage(widgetCode, pageCode, widgetPos);
        return ContentListWidgetConfigPage;
      case CMS_WIDGETS.CONTENT_QUERY.code:
        ContentQueryWidgetConfigPage.openPage(widgetCode, pageCode, widgetPos);
        return ContentQueryWidgetConfigPage;
      case CMS_WIDGETS.CONTENT.code:
      default:
        ContentWidgetConfigPage.openPage(widgetCode, pageCode, widgetPos);
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

  gatherWidgetSettings(widgetCode) {
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

  openDetails() {
    this.getDetails().then(button => DetailsPage.openPage(button, this.widgetCode));
    return cy.wrap(new AppPage(DetailsPage)).as('currentPage');
  }

  openEdit() {
    this.getEdit().then(button => MFEWidgetForm.openPage(button, this.widgetCode));
    return cy.wrap(new AppPage(MFEWidgetForm)).as('currentPage');
  }

  openSettings(widgetCode) {
    this.getSettings().click();
    const WidgetConfigPage = this.gatherWidgetSettings(widgetCode);
    cy.waitForStableDOM();
    return cy.wrap(new AppPage(WidgetConfigPage)).as('currentPage');
  }

  openSaveAs(widgetPos, pageCode, widgetConfig) {
    this.getSaveAs().then(button => MFEWidgetForm.openPage(button, this.widgetCode, pageCode, widgetPos, widgetConfig));
    return cy.wrap(new AppPage(MFEWidgetForm)).as('currentPage');
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
