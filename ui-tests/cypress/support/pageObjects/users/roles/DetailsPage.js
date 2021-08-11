import {DATA_TESTID, htmlElements} from '../../WebElement';

import Content from '../../app/Content.js';

export default class DetailsPage extends Content {

  description = `${htmlElements.dl}[${DATA_TESTID}=detail_DetailRoleTable_dl]`;

  getDetailsDescription() {
    return this.getContents()
               .find(this.description);
  }

  getCodeLabel() {
    return this.getDetailsDescription()
               .children(htmlElements.dt).eq(0);
  }

  getCodeValue() {
    return this.getDetailsDescription()
               .children(htmlElements.dd).eq(0);
  }

  getNameLabel() {
    return this.getDetailsDescription()
               .children(htmlElements.dt).eq(1);
  }

  getNameValue() {
    return this.getDetailsDescription()
               .children(htmlElements.dd).eq(1);
  }

  getPermissionsLabel() {
    return this.getDetailsDescription()
               .children(htmlElements.dt).eq(2);
  }

  getPermissionsValue() {
    return this.getDetailsDescription()
               .children(htmlElements.dd).eq(2);
  }

  getReferencedUsersLabel() {
    return this.getDetailsDescription()
               .children(htmlElements.dt).eq(3);
  }

  getReferencedUsersValue() {
    return this.getDetailsDescription()
               .children(htmlElements.dd).eq(3);
  }

}
