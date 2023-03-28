import {htmlElements} from '../WebElement.js';

import AbstractPage from './AbstractPage';

import AppMenus from './AppMenus';
import {Dialog}                   from './Dialog';
import {BundleInstallationDialog} from '../repository/hub/RepositoryPage';

export default class AppPage extends AbstractPage {

  constructor(content, bundleInstallation = false) {
    super();
    this.menus   = new AppMenus(this);
    this.content = new content(this);
    if (bundleInstallation === true) this.dialog = new BundleInstallationDialog();
    else this.dialog = new Dialog();
    this.parent.get()
        .children(htmlElements.body)
        .children(`${htmlElements.div}#root`)
        .children(`${htmlElements.div}.shell-preload`, {timeout: 180000})
        .should('not.exist');
  }

  get() {
    return this.parent.get()
               .children(htmlElements.body)
               .children(`${htmlElements.div}#root`)
               .children(`${htmlElements.div}.layout-pf-fixed`);
  }

  getToastList() {
    return this.getContent().get().children(`${htmlElements.div}.toast-notifications-list-pf`);
  }

}
