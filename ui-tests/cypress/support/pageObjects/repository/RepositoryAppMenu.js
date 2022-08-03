import {MenuElement} from '../app/MenuElement.js';

export default class RepositoryAppMenu extends MenuElement {

  get() {
    return this.parent.get().find('[data-id="repository"]');
  }

}
