import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

import DesignerPage from './DesignerPage';
import AppPage      from '../../app/AppPage';

export default class WidgetConfigPage extends AppContent {
  panel      = `${htmlElements.div}.PageConfigPage__panel-body`;
  saveButton = `${htmlElements.button}.AddContentTypeFormBody__save--btn`;

  getMainContainer() {
    return this.get()
               .children(htmlElements.div)
               .children(htmlElements.div).eq(5);
  }

  getInnerPanel() {
    return this.getMainContainer()
               .find(this.panel);
  }

  getSaveButton() {
    return this.getInnerPanel()
               .find(this.saveButton);
  }

  setDialogBodyWithClass(component) {
    this.parent.getDialog().setBody(component);
  }

  confirmConfig() {
    this.getSaveButton().click();
    return new AppPage(DesignerPage);
  }
}
