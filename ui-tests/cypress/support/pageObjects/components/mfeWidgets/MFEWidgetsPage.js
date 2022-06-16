import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import AppPage       from '../../app/AppPage';
import MFEWidgetForm from './MFEWidgetForm';
import DeleteDialog  from '../../app/DeleteDialog';
import BrowserPage   from '../../administration/fileBrowser/BrowserPage';

export default class MFEWidgetsPage extends AppContent {

  maincontent = `${htmlElements.div}.container-fluid`;
  rowlayout   = `${htmlElements.div}.row`;

  static openPage(button) {
    cy.widgetsController().then(controller => controller.intercept({method: 'GET'}, 'MFEAndWidgetsPageLoadingGET', '?*'));
    cy.get(button).click();
    cy.wait('@MFEAndWidgetsPageLoadingGET');
    // FIXME/TODO a call to /system/report keeps getting fired detaching the elements from the page
    cy.wait(1000);
  }

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
               .find(`${htmlElements.button}#WidgetListRow-dropown-${code}`).closest(htmlElements.div);
  }

  openEditFromKebabMenu(code) {
    this.getKebabMenuOfWidget(code).click();
    this.getListArea().find(`${htmlElements.li}.WidgetListRow__menu-item-edit > a`).filter(':visible').then(button => MFEWidgetForm.openPage(button, code));
    return cy.wrap(new AppPage(MFEWidgetForm)).as('currentPage');
  }

  clickDeleteFromKebabMenu(code) {
    this.getKebabMenuOfWidget(code).click();
    this.getListArea().find(`${htmlElements.li}.WidgetListRow__menu-item-delete > a`).filter(':visible').click();
    this.parent.getDialog().setBody(DeleteDialog);
    this.parent.getDialog().getBody().setLoadOnConfirm(BrowserPage);
    return cy.get('@currentPage');
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
    this.getAddButton().then(button => MFEWidgetForm.openPage(button));
    return cy.wrap(new AppPage(MFEWidgetForm)).as('currentPage');
  }

}
