import {htmlElements} from '../../WebElement';

import Content from '../../app/Content';

export default class EmailConfigurationPage extends Content {

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
