import 'cypress-file-upload';

import { DialogContent } from '../../../app/Dialog';
import { htmlElements } from '../../../WebElement';
import AttributeFormField from '../AttributeFormField';

export class AssetSelector extends DialogContent {
  getAssetsBody() {
    return this.get()
      .find('div.AssetsList__body');
  }

  getAssetListTable() {
    return this.getAssetsBody()
      .find('table.AssetsList__table');
  }

  getUseButtonFromAssetTitle(assetTitle) {
    return this.getAssetListTable()
      .contains(assetTitle)
      .closest(htmlElements.tr)
      .children('td:last-of-type')
      .children('button');
  }
}

export class AssetUploader extends DialogContent {
  fileContainer = 'div.UploadAssetModal__file-container';
  fileBody = 'div.UploadAssetModal__file';
  fileButtons = 'div.UploadAssetModal__upload-modal-buttons';

  getFormBody() {
    return this.get()
      .children('form');
  }

  getFormFieldArea() {
    return this.getFormBody()
      .children(this.fileContainer)
      .children(this.fileBody);
  }

  getFileNameField() {
    return this.getFormFieldArea()
      .find('input[name="files[0].filename"][type="text"]')
  }

  getGroupField() {
    return this.getFormFieldArea()
      .find('select[name="files[0].group"]');
  }

  getSubmitButton() {
    return this.getFormBody()
      .children(this.fileButtons)
      .children('button[type=submit]');
  }

  submit() {
    return this.getSubmitButton().click();
  }
}

export default class AssetAttribute extends AttributeFormField {
  inputInfo = 'input.AssetAttributeField__input--inner[type="text"]';
  uploadButton = 'input[type=file][multiple]';

  constructor(parent, attributeIndex, assetType = 'Image', lang = 'en') {
    super(parent, assetType, attributeIndex, lang);
  }

  getBrowseButton() {
    return this.getContents().find('button').eq(0);
  }

  getUploadButton() {
    return this.getContents().find(this.uploadButton);
  }

  getSelectedInfoArea() {
    return this.getContents()
      .find('div.AssetAttributeField__selected-info');
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

  fillMetadata(metadata) {
    if (metadata === null) return;
    if (metadata.name) {
      this.getInfoNameInput().type(metadata.name);
    }
    if (metadata.legend) {
      this.getContents().debug();
      this.getInfoLegendInput().type(metadata.legend);
    }
    if (metadata.alt) {
      this.getInfoAltInput().type(metadata.alt);
    }
    if (metadata.description) {
      this.getInfoDescInput().type(metadata.description);
    }
    if (metadata.title) {
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
        this.getUploadButton().attachFile(upload.file);
        cy.wait(500);
        this.setDialogBodyWithClass(AssetUploader);
        this.getDialogBodyOfAttribute().submit();
      }
    }
    cy.wait(500);
    if (metadata) {
      this.fillMetadata(metadata);
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
