import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content from '../../app/Content';

import DesignerPage from './DesignerPage';
import AppPage      from '../../app/AppPage';

export default class WidgetConfigPage extends Content {
  grid  = `${htmlElements.div}[${DATA_TESTID}=config_WidgetConfigPage_Grid]`;
  panel = `${htmlElements.div}[${DATA_TESTID}=config_WidgetConfigPage_Panel]`;

  getMainContainer() {
    return this.get()
               .children(this.grid);
  }

  getInnerPanel() {
    return this.getMainContainer()
               .find(this.panel);
  }

  getSaveButton() {
    return this.getInnerPanel()
               .find('.btn.btn-primary').contains(/^Save$/);
  }

  setDialogBodyWithClass(component) {
    this.parent.getDialog().setBody(component);
  }

  confirmConfig() {
    this.getSaveButton().click();
    return new AppPage(DesignerPage);
  }
}
