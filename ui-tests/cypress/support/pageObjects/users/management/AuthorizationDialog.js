import {DATA_TESTID, htmlElements} from '../../WebElement';

import {DialogContent} from '../../app/Dialog';

export default class AuthorizationDialog extends DialogContent {

  group = `${htmlElements.select}[${DATA_TESTID}=UserAuthorityModal__groupsField]`;
  role  = `${htmlElements.select}[${DATA_TESTID}=UserAuthorityModal__rolesField]`;

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
