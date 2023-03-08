import {htmlElements} from '../../WebElement.js';

import AdminContent from '../../app/AdminContent';
import AssetsPage   from './AssetsPage';
import AdminPage    from '../../app/AdminPage';

export default class AddPage extends AdminContent {

  addButton     = `${htmlElements.input}#submit`;
  fileInput     = `${htmlElements.input}[type=file]`;
  groupSelector = `${htmlElements.select}[id="mainGroup"]`;

  static openPage(button) {
    super.loadPage(button, '/jacms/Resource/new.action');
  }

  getFileInput() {
    return this.get()
               .find(this.fileInput);
  }

  selectFiles(...fileName) {
    this.getFileInput().eq(0).selectFile(fileName, {force: true});
    return cy.get('@currentPage');
  }

  getGroupSelect() {
    return this.get()
               .find(this.groupSelector);
  }

  submit() {
    this.get().find(this.addButton).then(button => AssetsPage.openPage(button));
    return cy.wrap(new AdminPage(AssetsPage)).as('currentPage');
  }

}
