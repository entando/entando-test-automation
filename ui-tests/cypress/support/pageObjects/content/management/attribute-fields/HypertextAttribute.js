import { htmlElements } from '../../../WebElement';
import AttributeFormField from '../AttributeFormField';
import { LinkDialog } from './LinkAttribute';

export default class HypertextAttribute extends AttributeFormField {
  quillToolbar = `${htmlElements.div}.ql-toolbar`;
  linkButton = `${htmlElements.button}.ql-enlink[title="Link"]`;
  quillEditor = `${htmlElements.div}.quill`;
  fckeditor = false;

  constructor(parent, attributeIndex, lang = 'en', fckeditor = false) {
    super(parent, 'Hypertext', attributeIndex, lang);
    this.setFckeditor(fckeditor);
  }

  setFckeditor(fckeditor) {
    this.fckeditor = fckeditor;
  }

  getEditorToolbar() {
    return this.getContents().find(this.quillToolbar);
  } 

  getAddLinkButton() {
    return this.getEditorToolbar().find(this.linkButton);
  }

  clickAddLinkButton() {
    cy.contentTypesController().then(controller => controller.intercept({method: 'GET'}, 'contentTypesLoadingGET', '?page=1&pageSize=0', 1));
    cy.groupsController().then(controller => controller.intercept({method: 'GET'}, 'groupsLoadingGET', '?page=1&pageSize=0', 1));
    cy.categoriesController().then(controller => controller.intercept({method: 'GET'}, 'categoriesLoadingGET', '?parentCode=home', 1));
    cy.contentsController().then(controller => controller.intercept({method: 'GET'}, 'contentLoadingGET', '?*', 1));
    this.getAddLinkButton().click();
    cy.wait(['@contentTypesLoadingGET', '@groupsLoadingGET', '@categoriesLoadingGET', '@contentLoadingGET']);
  }

  setLinkInfo(link) {
    this.setDialogBodyWithClass(LinkDialog);
    this.clickAddLinkButton();

    const { destType, rel, target, hreflang } = link;
    this.getDialogBodyOfAttribute().clickTabByDestType(destType);

    switch(destType) {
      case 1:
      default:
        this.getDialogBodyOfAttribute().setUrlValue(link.urlDest);
        break;
      case 2:
        this.getDialogBodyOfAttribute().setPageValue(link.pageDest);
        break;
      case 3:
        this.getDialogBodyOfAttribute().setContentValue(link.contentDest);
        break;
    }
    if (link.rel) {
      this.getDialogBodyOfAttribute().setAttributeRelValue(rel);
    }
    if (link.target) {
      this.getDialogBodyOfAttribute().setAttributesTargetValue(target);
    }
    if (link.hreflang) {
      this.getDialogBodyOfAttribute().setAttributeshrefLangValue(hreflang);
    }
    this.getDialogBodyOfAttribute().confirm();
  }

  getEditorArea() {
    return this.getContents().find(this.quillEditor);
  }

  getInput() {
      if (this.fckeditor) {
        return this.getEditorArea().find(`${htmlElements.div}.ql-editor`);
      }
      return this.getContents()
        .find(`${htmlElements.textarea}[name="${this.prefix}.values.${this.lang}"]`);
  }

  setValue(text) {
    this.getInput().type(text);
  }

  editValue(value) {
    this.getInput().clear();
    this.setValue(value);
  }

  getValue() {
    this.getInput().invoke('val');
  }
}
