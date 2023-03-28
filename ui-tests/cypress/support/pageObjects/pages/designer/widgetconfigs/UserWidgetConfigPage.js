import WidgetConfigPage from '../WidgetConfigPage';
import {htmlElements}   from '../../../WebElement';
import DesignerPage     from '../DesignerPage';
import AppPage          from '../../../app/AppPage';

export default class UserWidgetConfigPage extends WidgetConfigPage {

  static openPage(code, page, pos) {
    super.loadPage(null, `/widget/config/${code}/page/${page}/frame/${pos+4}`, false, true);
  }

  getSaveButton() {
    return this.get().find(`${htmlElements.button}[type=submit].btn-primary`)
  }

  getUserWidgetConfigurations(widgetConfig) {
    return this.get().find(widgetConfig);
  }

  confirmConfig(code) {
    this.getSaveButton().then(button => DesignerPage.confirmConfig(button, code, false));
    return cy.wrap(new AppPage(DesignerPage)).as('currentPage');
  }

}
