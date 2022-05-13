import {htmlElements} from '../../WebElement.js';

import AdminContent from '../../app/AdminContent';
import AssetsPage   from './AssetsPage';
import AdminPage    from '../../app/AdminPage';


export default class AddPage extends AdminContent {

  addButton     = `${htmlElements.input}#submit`;
  fileInput     = `${htmlElements.input}[type=file]`;
  groupSelector = `${htmlElements.select}[id="mainGroup"]`;

  static openPage(button) {
    cy.assetsAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'addPageLoadingGet', '/new.action?*'));
    cy.get(button).click();
    cy.wait('@addPageLoadingGet');
  }

  getFileInput() {
    return this.get()
               .find(this.fileInput);
  }

  selectFiles(...fileName) {
    this.getFileInput().eq(0).selectFile(fileName, {force: true});
  }

  getGroupSelect() {
    return this.get()
               .find(this.groupSelector);
  }

  submit() {
    this.get()
        .find(this.addButton)
        .then(button => {
          cy.assetsAdminConsoleController()
            .then(controller => controller.intercept({method: 'POST'}, 'interceptedPOST', '/save.action'));
          this.click(button);
        });
    cy.wait('@interceptedPOST');
    return cy.wrap(new AdminPage(AssetsPage)).as('currentPage');
  }
}
