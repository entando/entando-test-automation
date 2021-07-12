import {TEST_ID_KEY, htmlElements, WebElement} from "../../WebElement.js";

import Content from "../../app/Content.js";

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

  clickSaveButton() {
    this.getSaveButton().click();
    return new AppPage(DesignerPage);
  }
}
