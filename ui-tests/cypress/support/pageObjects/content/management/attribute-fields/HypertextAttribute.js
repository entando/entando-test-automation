import {htmlElements} from '../../../WebElement';

import AttributeFormField from '../AttributeFormField';

import {LinkDialog} from './LinkAttribute';

export default class HypertextAttribute extends AttributeFormField {
  fckeditor    = false;
  quillToolbar = `${htmlElements.div}.ql-toolbar`;
  linkButton   = `${htmlElements.button}.ql-enlink[title="Link"]`;
  quillEditor  = `${htmlElements.div}.quill`;

  constructor(parent, attributeIndex, lang = 'en') {
    super(parent, 'Hypertext', attributeIndex, lang);
  }

  getEditorToolbar() {
    return this.getContents().find(this.quillToolbar);
  }

  getAddLinkButton() {
    return this.getEditorToolbar().find(this.linkButton);
  }

  setLinkInfo(link) {
    this.setDialogBodyWithClass(LinkDialog);
    this.getAddLinkButton().click();

    const {destType, rel, target, hreflang} = link;
    this.getDialogBodyOfAttribute().clickTabByDestType(destType);

    switch (destType) {
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
    return cy.get('@contentEditor').then((contentEditor) => {
      if (contentEditor) {
        return this.getEditorArea().find('div.ql-editor');
      }
      return this.getContents()
                 .find(`textarea[name="${this.prefix}.values.${this.lang}"]`);
    });
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
