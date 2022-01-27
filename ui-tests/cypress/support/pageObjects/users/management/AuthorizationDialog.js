import {htmlElements} from '../../WebElement';

import {DialogContent} from '../../app/Dialog';

export default class AuthorizationDialog extends DialogContent {

  group = `${htmlElements.select}[name=group].form-control`;
  role  = `${htmlElements.select}[name=roles].form-control`;

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
