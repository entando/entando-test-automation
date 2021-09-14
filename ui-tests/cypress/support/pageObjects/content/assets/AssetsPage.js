import Content from '../../app/Content.js';
import DeleteDialog from '../../app/DeleteDialog.js';
import { DialogContent } from '../../app/Dialog.js';
import KebabMenu from '../../app/KebabMenu.js';
import { htmlElements } from '../../WebElement.js';

export default class AssetsPage extends Content {

  fileInput = `${htmlElements.input}[type=file]`;

  getFileInput() {
    return this.get()
               .find(this.fileInput);
  }

  getTable() {
    return this.get()
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

  attachFiles(...fileNames) {
    this.getFileInput().attachFile(fileNames);
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
}
