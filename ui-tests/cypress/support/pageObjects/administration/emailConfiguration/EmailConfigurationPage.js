import {htmlElements} from '../../WebElement';

import AppContent from '../../app/AppContent';

export default class EmailConfigurationPage extends AppContent {

  emailConfigurationTabList = `${htmlElements.ul}[role=tablist]`;

  getSenderManagementTab() {
    return this.getContents()
               .find(this.emailConfigurationTabList)
               .children().eq(0);
  }

  getSMTPServerTab() {
    return this.getContents()
               .find(this.emailConfigurationTabList)
               .children().eq(1);
  }

}
