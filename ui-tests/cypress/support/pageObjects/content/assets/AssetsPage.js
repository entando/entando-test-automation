import Content from '../../app/Content.js';
import DeleteDialog from '../../app/DeleteDialog.js';
import { DialogContent } from '../../app/Dialog.js';
import KebabMenu from '../../app/KebabMenu.js';
import { htmlElements, DATA_TESTID } from '../../WebElement.js';

export default class AssetsPage extends Content {

  fileInput = `${htmlElements.input}[type=file]`;
  assetsFilter = `${htmlElements.div}.AssetsAdvancedFilter[${DATA_TESTID}="assets_AssetsAdvancedSearch_div"]`;
  assetsSearchText = `${htmlElements.input}[${DATA_TESTID}="form_RenderSearchFormInput_input"]`;
  assetsFilterSearchButton = `${htmlElements.button}[${DATA_TESTID}="assets_AssetsAdvancedSearch_Button"]`;
  assetsView = `${htmlElements.div}[${DATA_TESTID}="assets_AssetsList_CardGrid"]`;
  assetsBody = `${htmlElements.div}.AssetsList__body`;
  resultInfo = `${htmlElements.div}.AssetsList__filter-info`;
  resultInfoItemCount = `${htmlElements.span}.AssetsList__items-count`;

  getFileInput() {
    return this.get()
               .find(this.fileInput);
  }

  getAssetsFilter() {
    return this.get()
               .find(this.assetsFilter);
  }

  getSearchTextfield() {
    return this.getAssetsFilter()
               .find(this.assetsSearchText);
  }

  getSearchButton() {
    return this.getAssetsFilter()
               .find(this.assetsFilterSearchButton);
  }

  getAssetsView() {
    return this.get()
               .find(this.assetsView);
  }

  getAssetsBody() {
    return this.getAssetsView()
               .find(this.assetsBody);
  }

  getFilterResultInfo() {
    return this.getAssetsBody()
              .find(this.resultInfo);
  }

  getFilterResultItemCount() {
    return this.getFilterResultInfo()
               .find(this.resultInfoItemCount);
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

  getKebabMenu(code) {
    return new AssetsKebabMenu(this, code);
  }

  selectFiles(...fileName) {
    this.getFileInput().selectFile(fileName, {force: true});
    this.parent.getDialog().setBody(AddAssetDialog);
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
    this.getEdit().click();
    this.parent.parent.getDialog().setBody(EditAssetDialog);
  }

  clickDelete() {
    this.getDelete().click();
    this.parent.parent.getDialog().setBody(DeleteDialog);
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

  submit() {
    this.get()
        .find(`${htmlElements.button}[type=submit]`)
        .click();
  }
}

class EditAssetDialog extends DialogContent {



  getDescriptionInput() {
    return this.get()
               .find(`${htmlElements.input}[name=description]`);
  }

  crop(xOffset, yOffset) {
    this.get().find('.cropper-point.point-se').then(($cropperPoint) => {
      const { x, y } = $cropperPoint[0].getBoundingClientRect();
      cy.wrap($cropperPoint)
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { clientX: x + xOffset, clientY: y + yOffset })
        .trigger('mouseup', { force: true });
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
    this.get().find('[data-action=save]').click();
  }
}
