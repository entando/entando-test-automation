import AppContent from '../../app/AppContent';
import DeleteDialog from '../../app/DeleteDialog.js';
import {DialogContent} from '../../app/Dialog.js';
import KebabMenu from '../../app/KebabMenu.js';
import {htmlElements} from '../../WebElement.js';

export default class AssetsPage extends AppContent {

  fileInput                = `${htmlElements.input}[type=file]`;
  assetsView               = `${htmlElements.div}.AssetsList__files-grid`;
  assetsBody               = `${htmlElements.div}.AssetsList__body`;
  assetsSearchText         = `${htmlElements.input}#keyword`;
  assetsFilter             = `${htmlElements.div}.AssetsAdvancedFilter`;
  assetsFilterSearchButton = `${htmlElements.button}[type=submit]`;
  resultInfo               = `${htmlElements.div}.AssetsList__filter-info`;
  resultInfoItemCount      = `${htmlElements.span}.AssetsList__items-count`;

  static openPage(button) {
    cy.assetsController().then(controller => controller.intercept({method: 'GET'}, 'assetsPageLoadingGet', '?page=1&pageSize=10'));
    cy.get(button).click();
    cy.wait('@assetsPageLoadingGet');
  }

  getFileInput() {
    return this.get()
               .find(this.fileInput);
  }

  selectFiles(...fileName) {
    this.getFileInput().selectFile(fileName, {force: true});
    this.parent.getDialog().setBody(AddAssetDialog);
    return cy.get('@currentPage');
  }

  getAssetsView() {
    return this.getContents()
               .find(this.assetsView);
  }

  getAssetsBody() {
    return this.getAssetsView()
               .find(this.assetsBody);
  }

  getTable() {
    return this.getAssetsBody()
               .find(htmlElements.table);
  }

  getTableRows() {
    return this.getTable()
               .children(htmlElements.tbody)
               .children(htmlElements.tr);
  }

  getAssetsFilter() {
    return this.get()
               .find(this.assetsFilter);
  }

  openAdvancedFilter() {
    this.getAssetsFilter().click();
    return cy.get('@currentPage');
  }

  getCollapsePanel() {
    return this.getContents().find(this.collapsePanel);
  }

  getSearchTextfield() {
    return this.getAssetsFilter()
               .find(this.assetsSearchText);
  }

  getSearchButton() {
    return this.getAssetsFilter()
               .children(htmlElements.div).eq(3)
               .find(this.assetsFilterSearchButton);
  }

  getFilterResultInfo() {
    return this.getAssetsBody()
               .find(this.resultInfo);
  }

  getFilterResultItemCount() {
    return this.getFilterResultInfo()
               .find(this.resultInfoItemCount);
  }

  getKebabMenu(code) {
    //TODO find a better way to prevent trying to interact with detached DOM element
    cy.wait(500);
    return new AssetsKebabMenu(this, code);
  }

}

class AssetsKebabMenu extends KebabMenu {

  get() {
    return this.parent.getTableRows()
               .find(`#AssetsList__item-action-${this.code}`)
               .closest(htmlElements.div);
  }

  getEdit() {
    return this.get()
               .find(htmlElements.li)
               .eq(0);
  }

  getDelete() {
    return this.get()
               .find(htmlElements.li)
               .eq(3);
  }

  openEdit() {
    cy.categoriesController().then(controller => controller.intercept({method: 'GET'}, 'categoriesLoadedGET', '?parentCode=home'));
    this.getEdit().click();
    this.parent.parent.getDialog().setBody(EditAssetDialog);
    cy.wait('@categoriesLoadedGET');
    return cy.get('@currentPage');
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
    return cy.get('@currentPage');
  }

}

class AddAssetDialog extends DialogContent {

  getNameInput(idx = 0) {
    return this.get()
               .find(`${htmlElements.input}[name="files[${idx}].filename"]`);
  }

  getGroupSelect(idx = 0) {
    return this.get()
               .find(`${htmlElements.select}[name="files[${idx}].group"]`);
  }

  selectGroup(group) {
    this.getGroupSelect().select(group);
    return cy.get('@currentPage');
  }

  submit() {
    cy.assetsController().then(controller => controller.intercept({method: 'POST'}, 'assetUploadedPOST'));
    this.get()
        .find(`${htmlElements.button}[type=submit]`)
        .click();
    cy.wait('@assetUploadedPOST');
    return cy.get('@currentPage');
  }
}

class EditAssetDialog extends DialogContent {


  getDescriptionInput() {
    return this.get()
               .find(`${htmlElements.input}[name=description]`);
  }

  crop(xOffset, yOffset) {
    this.get().find('.cropper-point.point-se').then(($cropperPoint) => {
      const {x, y} = $cropperPoint[0].getBoundingClientRect();
      cy.wrap($cropperPoint)
        .trigger('mousedown', {which: 1})
        .trigger('mousemove', {clientX: x + xOffset, clientY: y + yOffset})
        .trigger('mouseup', {force: true});
      return this.apply();
    });
  }

  rotate(direction) {
    this.get()
        .find(`[data-action=rotate${direction}]`)
        .click();
    return this.apply();
  }

  apply() {
    this.get().find('[data-action=save]').click();
    return cy.get('@currentPage');
  }
}
