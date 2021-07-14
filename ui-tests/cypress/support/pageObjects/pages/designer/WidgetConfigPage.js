import { TEST_ID_KEY, htmlElements } from '../../WebElement';

import Content from '../../app/Content';

import DesignerPage from './DesignerPage';
import AppPage from '../../app/AppPage';

export default class WidgetConfigPage extends Content {
  grid = `${htmlElements.div}[${TEST_ID_KEY}=config_WidgetConfigPage_Grid]`;

  getMainContainer() {
    return this.get()
                .children(this.grid);
  }

  getSaveButton() {
    return this.getMainContainer()
      .contains('Save');
  }

  confirmConfig() {
    this.getSaveButton().click();
    return new AppPage(DesignerPage);
  }
}
