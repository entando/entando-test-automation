import {htmlElements} from '../../../WebElement';

import AttributeFormField from '../AttributeFormField';

import AdminPage    from '../../../app/AdminPage';
import {LinkDialog} from './LinkAttribute';

export default class HypertextAttribute extends AttributeFormField {
  fckeditor    = false;
  quillToolbar = `${htmlElements.span}.cke_top`;
  linkButton   = `${htmlElements.a}.cke_button__entandolink`;
  quillEditor  = `${htmlElements.div}.quill`;

  constructor(parent, attributeIndex, lang = 'en', composite = false) {
    super(parent, 'Hypertext', attributeIndex, lang);
    this.composite = composite;
  }

  getEditorToolbar() {
    return this.getContents().find(this.quillToolbar);
  }

  getAddLinkButton() {
    return this.getEditorToolbar().find(this.linkButton);
  }

  setLinkInfo(link) {
    this.getAddLinkButton().click();
    const {destType, rel, target, hreflang} = link;
    cy.wrap(new AdminPage(LinkDialog))
      .then(page => {
        page.getContent().clickTabByDestType(destType);

        switch (destType) {
          case 1:
          default:
            page.getContent().setUrlValue(link.urlDest);
            break;
          case 2:
            page.getContent().setPageValue(link.pageDest);
            break;
          case 3:
            page.getContent().setContentValue(link.contentDest);
            break;
        }
        if (link.rel) {
          page.getContent().setAttributeRelValue(rel);
        }
        if (link.target) {
          page.getContent().setAttributesTargetValue(target);
        }
        if (link.hreflang) {
          page.getContent().setAttributeshrefLangValue(hreflang);
        }
        page.confirm();

      })

  }

  getEditorArea() {
    return this.getContents().find(this.quillEditor);
  }

  getInput(fckeditor = false) {
    const textarea = (this.composite ? `Composite:Hypertext:${this.lang}_Composite_Hypertext` : `Hypertext:${this.lang}_Hypertext`);
    if (fckeditor) return this.getIframeBody();
    else return this.getContents()
                    .find(`${htmlElements.textarea}[name="${textarea}"]`);
  }

  getIframeDocument() {
    return this.getContents().find(`${htmlElements.iframe}.cke_wysiwyg_frame`).its('0.contentDocument');
  }

  getIframeBody() {
    return this.getIframeDocument().its('body').should('not.be.undefined').then(cy.wrap);
  }

  setValue(text, fckeditor = false) {
    this.getInput(fckeditor).then(input => this.parent.type(input, text));
  }

  editValue(value, fckeditor = false) {
    this.getInput(fckeditor).clear();
    this.setValue(value);
  }

  getValue(fckeditor = false) {
    this.getInput(fckeditor).invoke('val');
  }
}
