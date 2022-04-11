import {htmlElements} from '../../WebElement.js';
import AppContent     from '../../app/AppContent';

export default class ReloadConfigurationPage extends AppContent{

  reloadConfigurationButton = `${htmlElements.button}[type=button].ReloadConfig__reload-button`;
  reloadConfirmDiv = `${htmlElements.div}.ReloadConfirm`;

  getReloadButton(){
    return this.getContents().find(this.reloadConfigurationButton);
  }

  clickReloadButton(){
    this.getReloadButton().click();
  }

  getReloadConfirmation(){
    return this.getContents().find(this.reloadConfirmDiv);
  }

}
