import {htmlElements}  from '../../WebElement.js';

import AdminContent    from '../../app/AdminContent';
import AssetsPage      from './AssetsPage';
import AdminPage       from '../../app/AdminPage';
import {DialogContent} from '../../app/Dialog';


export default class EditPage extends AdminContent {

  addButton     = `${htmlElements.input}#submit`;
  inputDescription     = `${htmlElements.input}#descr_0`;
  groupSelector = `${htmlElements.select}[id="mainGroup"]`;
  dropdown =  `${htmlElements.div}.dropdown`;


      static openPage(button){
    cy.assetsAdminConsoleController().then(controller => controller.intercept({method:'GET'}, 'editPageLoadingGet', '/edit.action?*'));
    cy.get(button).click();
    cy.wait('@editPageLoadingGet');
  }
  submit() {
    this.get()
        .find(this.addButton)
        .then(button => {
          cy.assetsAdminConsoleController()
            .then(controller => controller.intercept({method: 'POST'}, 'interceptedPOST', '/save.action'));
          this.click(button)
        });
    cy.wait('@interceptedPOST')
    return cy.wrap(new AdminPage(AssetsPage)).as('currentPage');
  }
  getDropDown(){
        return this.get()
            .find(this.dropdown);
  }
  openDropDown(){
         this.getDropDown()
            .click();
         return this;
  }

  getEdit(){
  return this.get()
      .find(`.edit-fields`);
      }

  openEdit(){
    this.getEdit().click();
    this.parent.getDialog().setBody(EditAssetDialog);
    return cy.get('@currentPage');
  }

  getDescriptionInput() {
    return this.get()
               .find(this.inputDescription);
  }

}

class EditAssetDialog extends DialogContent {



  crop(xOffset, yOffset) {
    this.get().find('.cropper-point.point-se').then(($cropperPoint) => {
      const {x, y} = $cropperPoint[0].getBoundingClientRect();
      cy.wrap($cropperPoint)
        .trigger('mousedown', {which: 1})
        .trigger('mousemove', {clientX: x + xOffset, clientY: y + yOffset})
        .trigger('mouseup', {force: true});
      this.apply();
    });
  }

  rotate(direction) {
    this.get()
        .find(`[data-action=rotate${direction}]`)
        .click();
    this.apply();
  }

  apply() {
    this.get().find('[data-method=crop]').click();
  }
}
