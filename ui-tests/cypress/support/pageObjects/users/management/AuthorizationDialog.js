import {DATA_TESTID, htmlElements} from '../../WebElement';

import {DialogContent} from '../../app/Dialog';

export default class AuthorizationDialog extends DialogContent {

  group = `${htmlElements.select}[name="group"]`;
  role  = `${htmlElements.select}[name="roles"]`;

  getGroup() {
    return this.get()
               .find(this.group);
  }

  getRole() {
    return this.get()
               .find(this.role);
  }

  selectGroup(value) {
    this.getGroup().select(value);
  }

  selectRole(value) {
    this.getRole().select(value);
  }

}
