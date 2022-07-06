import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import DesignerPage from './DesignerPage';
import AppPage      from '../../app/AppPage';

export default class WidgetConfigPage extends AppContent {

  getContents() {
    return this.get().children(`${htmlElements.div}.InternalPage`);
  }

  getContentsHeader() {
    return this.getContents().children(`${htmlElements.div}.WidgetConfigPage__header`);
  }

  getSaveButton() {
    return this.getContentsHeader().find(`${htmlElements.button}.AddContentTypeFormBody__save--btn`);
  }

  getContentsBody() {
    return this.getContents()
               .children(`${htmlElements.div}.WidgetConfigPage__body`)
               .children(`${htmlElements.div}.container-fluid`);
  }

  getMainContainer() {
    return this.getContentsBody().children(htmlElements.div).eq(3);
  }

  getInnerPanel() {
    return this.getMainContainer().find(`${htmlElements.div}.PageConfigPage__panel-body`);
  }

  setDialogBodyWithClass(component) {
    this.parent.getDialog().setBody(component);
  }

  confirmConfig(code) {
    this.getSaveButton().then(button => DesignerPage.openPage(button, code));
    return cy.wrap(new AppPage(DesignerPage)).as('currentPage');
  }

}
