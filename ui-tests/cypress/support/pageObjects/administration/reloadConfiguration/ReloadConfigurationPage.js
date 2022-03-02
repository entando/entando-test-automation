import Content from '../../app/Content.js';
import {htmlElements} from '../../WebElement.js';

export default class ReloadConfigurationPage extends Content {

  reloadConfigurationButton = `${htmlElements.button}[type=button].ReloadConfig__reload-button`;

  getReloadButton(){
    return this.getContents().find(this.reloadConfigurationButton);
  }

}
