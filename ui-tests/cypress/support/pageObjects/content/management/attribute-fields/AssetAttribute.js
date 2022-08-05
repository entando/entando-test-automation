import { DialogContent } from '../../../app/Dialog';
import { htmlElements } from '../../../WebElement';
import AttributeFormField from '../AttributeFormField';

export class AssetSelector extends DialogContent {
  getAssetsBody() {
    return this.get()
      .find(`${htmlElements.div}.AssetsList__body`);
  }

  getAssetListTable() {
    return this.getAssetsBody()
      .find(`${htmlElements.table}.AssetsList__table`);
  }

  getUseButtonFromAssetTitle(assetTitle) {
    return this.getAssetListTable()
      .contains(assetTitle)
      .closest(htmlElements.tr)
      .children(`${htmlElements.td}:last-of-type`)
      .children(htmlElements.button);
  }
}

export class AssetUploader extends DialogContent {
  fileContainer = `${htmlElements.div}.UploadAssetModal__file-container`;
  fileBody = `${htmlElements.div}.UploadAssetModal__file`;
  fileButtons = `${htmlElements.div}.UploadAssetModal__upload-modal-buttons`;

  getFormBody() {
    return this.get()
      .children(htmlElements.form);
  }

  getFormFieldArea() {
    return this.getFormBody()
      .children(this.fileContainer)
      .children(this.fileBody);
  }

  getFileNameField() {
    return this.getFormFieldArea()
      .find(`${htmlElements.input}[name="files[0].filename"][type="text"]`)
  }

  getGroupField() {
    return this.getFormFieldArea()
      .find(`${htmlElements.select}[name="files[0].group"]`);
  }

  getSubmitButton() {
    return this.getFormBody()
      .children(this.fileButtons)
      .children(`${htmlElements.button}[type=submit]`);
  }

  submit() {
    return this.getSubmitButton().click();
  }
}

export default class AssetAttribute extends AttributeFormField {
  inputInfo = `${htmlElements.input}.AssetAttributeField__input--inner[type="text"]`;
  uploadButton = `${htmlElements.input}[type=file][multiple]`;

  constructor(parent, attributeIndex, assetType = 'Image', lang = 'en') {
    super(parent, assetType, attributeIndex, lang);
  }

  getBrowseButton() {
    return this.getContents().find(`${htmlElements.button}[type="button"].btn-primary`).eq(0);
  }

  getUploadButton() {
    return this.getContents().find(this.uploadButton);
  }

  getSelectedInfoArea() {
    return this.getContents()
      .find(`${htmlElements.div}.AssetAttributeField__selected-info`);
  }

  getInfoNameInput() {
    return this.getSelectedInfoArea()
      .find(`${this.inputInfo}[name="name"]`)
  }

  getInfoLegendInput() {
    return this.getSelectedInfoArea()
      .find(`${this.inputInfo}[name="legend"]`);
  }

  getInfoAltInput() {
    return this.getSelectedInfoArea()
      .find(`${this.inputInfo}[name="alt"]`);
  }

  getInfoDescInput() {
    return this.getSelectedInfoArea()
      .find(`${this.inputInfo}[name="description"]`);
  }

  getInfoTitleInput() {
    return this.getSelectedInfoArea()
      .find(`${this.inputInfo}[name="title"]`);
  }

  getDeleteButton() {
    return this.getSelectedInfoArea()
        .find(`${htmlElements.button}.btn-danger`);
  }

  fillMetadata(metadata, editMode = false) {
    if (metadata === null) return;
    if (metadata.name) {
      if (editMode) {
        this.getInfoNameInput().clear();
      }
      this.getInfoNameInput().type(metadata.name);
    }
    if (metadata.legend) {
      if (editMode) {
        this.getInfoLegendInput().clear();
      }
      this.getInfoLegendInput().type(metadata.legend);
    }
    if (metadata.alt) {
      if (editMode) {
        this.getInfoAltInput().clear();
      }
      this.getInfoAltInput().type(metadata.alt);
    }
    if (metadata.description) {
      if (editMode) {
        this.getInfoDescInput().clear();
      }
      this.getInfoDescInput().type(metadata.description);
    }
    if (metadata.title) {
      if (editMode) {
        this.getInfoTitleInput().clear();
      }
      this.getInfoTitleInput().type(metadata.title);
    }
  }

  setValue({ upload, metadata }) {
    const uploadMode = typeof upload !== 'string';
    if (this.lang === 'en') {
      if (!uploadMode) {
        this.getBrowseButton().click();
        cy.wait(3500);
        this.setDialogBodyWithClass(AssetSelector);
        this.getDialogBodyOfAttribute().getUseButtonFromAssetTitle(upload).click();
      } else {
        this.getUploadButton().selectFile(upload.file, {force: true});
        cy.wait(500);
        this.setDialogBodyWithClass(AssetUploader);
        this.getDialogBodyOfAttribute().submit();
      }
    }
    cy.wait(500);
    if (metadata) {
      this.fillMetadata(metadata, true);
    }
  }

  editValue(value) {
    if (value.upload && this.lang === 'en') {
      this.getDeleteButton().click();
      this.setValue(value);
    } else {
      this.fillMetadata(value.metadata, true);
    }
  }

  getValue() {
    return Promise.all([
      this.getInfoNameInput().invoke('val'),
      this.getInfoLegendInput().invoke('val'),
      this.getInfoAltInput().invoke('val'),
      this.getInfoDescInput().invoke('val'),
      this.getInfoTitleInput().invoke('val'),
    ]).then(([name, legend, alt, description, title]) => ({
      name, legend, alt, description, title,
    }));
  }
}
