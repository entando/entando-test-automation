import {htmlElements} from '../../../WebElement';

import AttributeFormField from '../AttributeFormField';

import AddContentPage     from '../AddPage';
import AddPage            from '../../assets/AddPage';
import AdminPage          from '../../../app/AdminPage';
import AssetsPage         from '../../assets/AssetsPage';
import KebabMenu          from '../../../app/KebabMenu';

class ContentAssetsKebabMenu extends KebabMenu {

  get() {
    return this.parent.get()
               .find(`${htmlElements.div}.list-group-item`)
               .children(`${htmlElements.div}.list-view-pf-actions`)
               .children(htmlElements.div);
  }

  openDropdown() {
    this.getActionsButton()
        .children(`${htmlElements.button}#dropdownKebabRight2`)
        .click();
    return this;
  }

  getActionsButton() {
    return this.getDropdown()
               .children(htmlElements.li)
               .children(`${htmlElements.a}[href*="/entando-de-app/do/jacms/Content/Resource/joinResource.action?resourceId=${this.code}"]`)
               .closest(htmlElements.div);
  }

  getUse() {
    return this.getActionsButton()
               .find(htmlElements.li);
  }

  clickUse() {
    this.getUse().click();
    return cy.wrap(new AdminPage(AddContentPage));
  }

}

class ContentAssetsPage extends AssetsPage {

  getKebabMenu(code) {
    return new ContentAssetsKebabMenu(this, code);
  }

}

export default class AssetAttribute extends AttributeFormField {
  inputInfo    = `${htmlElements.input}[type="text"]`;
  uploadButton = `${htmlElements.button}[type=submit]`;
  

  constructor(parent, attributeIndex, assetType = 'Image', lang = 'en', composite = false) {
    super(parent, assetType, attributeIndex, lang);
    this.inputName = (composite ? `Composite:${assetType}:${lang}_Composite_${assetType}` : `${assetType}:${lang}_${assetType}`);
  }

  getBrowseButton() {
    return this.getContents().find(htmlElements.button).eq(0);
  }

  getUploadButton() {
    return this.getContents().find(this.uploadButton);
  }

  openAssetPage() {
    this.getUploadButton().click();
    return cy.wrap(new AdminPage(ContentAssetsPage));
  }

  getSelectedInfoArea() {
    return this.getContents()
               .find(`${htmlElements.div}.panel-body`);
  }

  getInfoNameInput() {
    return this.getSelectedInfoArea()
               .find(`${this.inputInfo}[name="${this.inputName}"]`);
  }

  getInfoLegendInput() {
    return this.getSelectedInfoArea()
               .find(`${this.inputInfo}[name="${this.inputName}_metadata_legend"]`);
  }

  getInfoAltInput() {
    return this.getSelectedInfoArea()
               .find(`${this.inputInfo}[name="${this.inputName}_metadata_alt"]`);
  }

  getInfoDescInput() {
    return this.getSelectedInfoArea()
               .find(`${this.inputInfo}[name="${this.inputName}_metadata_description"]`);
  }

  getInfoTitleInput() {
    return this.getSelectedInfoArea()
               .find(`${this.inputInfo}[name="${this.inputName}_metadata_title"]`);
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

  setValue({upload, metadata}, assetId = null) {
    const uploadMode = typeof upload !== 'string';
    if (this.lang === 'en') {
      if (!uploadMode) {
        const actionMenuId = (assetId ? assetId : metadata.actionButton);
        this.openAssetPage()
            .then(page => page.getContent().getKebabMenu(actionMenuId).openDropdown().clickUse());
      } else {
        cy.contentsAdminConsoleController().then(controller => controller.intercept({method: 'POST'}, 'uploadAssetPOST', `/Resource/upload`));
        this.openAssetPage()
            .then(page => {
              page.getContent().getAddButton().click();
              cy.wrap(new AdminPage(AddPage));
            })
            .then(page => {
              page.getContent().selectFiles(upload.file);
              page.getContent().get().find(`${htmlElements.input}#submit`).click();
              cy.wait('@uploadAssetPOST');
            });
      }
    }
    cy.waitForStableDOM();
    if (metadata) {
      this.fillMetadata(metadata, true);
    }
    return cy.get('@currentPage');
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
      this.getInfoTitleInput().invoke('val')
    ]).then(([name, legend, alt, description, title]) => ({
      name, legend, alt, description, title
    }));
  }
}
