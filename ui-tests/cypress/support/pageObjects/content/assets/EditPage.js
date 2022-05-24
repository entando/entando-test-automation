import {htmlElements} from '../../WebElement.js';

import AdminContent from '../../app/AdminContent';

import AssetsPage           from './AssetsPage';
import AdminPage            from '../../app/AdminPage';
import {DialogAdminContent} from '../../app/AdminDialog';

export default class EditPage extends AdminContent {

  addButton        = `${htmlElements.input}#submit`;
  inputDescription = `${htmlElements.input}#descr_0`;
  dropdown         = `${htmlElements.div}.dropdown`;

  static openPage(button) {
    cy.assetsAdminConsoleController().then(controller => controller.intercept({method: 'GET'}, 'editPageLoadingGet', '/edit.action?*'));
    cy.get(button).click();
    cy.wait('@editPageLoadingGet');
  }

  submit() {
    this.get().find(this.addButton).then(button => {
      cy.assetsAdminConsoleController().then(controller => controller.intercept({method: 'POST'}, 'interceptedPOST', '/save.action'));
      this.click(button);
      cy.wait('@interceptedPOST');
    });
    return cy.wrap(new AdminPage(AssetsPage)).as('currentPage');
  }

  getDropDown() {
    return this.get()
               .find(this.dropdown);
  }

  openDropDown() {
    this.getDropDown()
        .click();
    return this;
  }

  getEdit() {
    return this.get()
               .find(`.edit-fields`);
  }

  getTable() {
    return this.get()
               .find('[class="col-xs-12 no-padding" ]')
               .find(htmlElements.table);
  }

  openEdit() {
    this.getEdit().click();
    this.parent.getDialog().setBody(EditAssetDialog);
    return cy.get('@currentPage');
  }

  getDescriptionInput() {
    return this.get()
               .find(this.inputDescription);
  }

  getFileModifiedDate() {
    return this.getTable()
               .contains('File Modified Date')
               .closest(htmlElements.tr)
               .children()
               .eq(1);
  }

  getImageHeight() {
    return this.getTable()
               .contains('Image Height')
               .closest(htmlElements.tr)
               .children()
               .eq(1);
  }

}

class EditAssetDialog extends DialogAdminContent {

  crop(xOffset, yOffset) {
    this.get().find('.cropper-point.point-se').then(cropPoints => {
      const {x, y} = cropPoints[0].getBoundingClientRect();
      cy.wrap(cropPoints)
        .trigger('mousedown', {which: 1})
        .trigger('mousemove', {clientX: x + xOffset, clientY: y + yOffset})
        .trigger('mouseup', {force: true});
    });
    return this.apply();
  }

  rotate() {
    this.get().find(`${htmlElements.button}[data-option="-45"]`).click();
    return this.apply();
  }

  apply() {
    this.get().find(`.btn[title="crop"]`).click();
    return cy.get('@currentPage');
  }

}
