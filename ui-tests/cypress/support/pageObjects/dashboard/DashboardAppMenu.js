import {MenuElement} from '../app/MenuElement.js';

export default class DashboardAppMenu extends MenuElement {

  get() {
    return this.parent.get().find('[data-id="dashboard"]');
  }

}
