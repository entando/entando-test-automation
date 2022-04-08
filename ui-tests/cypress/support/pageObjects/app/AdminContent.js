import {htmlElements} from '../WebElement.js';
import Content                    from './Content';

export default class AdminContent extends Content {


  alertAdminConsole = `${htmlElements.div}.alert`;

  getAlertMessage() {
    return this.getContents()
               .find(this.alertAdminConsole);
  }

}
