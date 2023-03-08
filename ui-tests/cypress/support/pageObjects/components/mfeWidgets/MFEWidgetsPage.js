import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import AppPage       from '../../app/AppPage';
import MFEWidgetForm from './MFEWidgetForm';
import DeleteDialog  from '../../app/DeleteDialog';

export default class MFEWidgetsPage extends AppContent {

  rowlayout   = `${htmlElements.div}.row`;

  static openPage(button) {
    super.loadPage(button, '/widget');
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
    this.parent.getDialog().getBody().setLoadOnConfirm(MFEWidgetsPage);
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
