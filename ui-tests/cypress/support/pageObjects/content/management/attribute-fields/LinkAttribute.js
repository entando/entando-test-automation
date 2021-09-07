import { DialogContent } from '../../../app/Dialog';
import { htmlElements } from '../../../WebElement';
import AttributeFormField from '../AttributeFormField';

export class LinkDialog extends DialogContent {
  typeSelected = 1;

  getTabArea() {
    return this.get().find('ul[role="tablist"]');
  }

  getTabBlock() {
    return this.get().find('div.tab-content');
  }

  getTabURL() {
    return this.getTabBlock().find('div#LinkConfigModal-Tabs-pane-url');
  }

  getTabPage() {
    return this.getTabBlock().find('div#LinkConfigModal-Tabs-pane-page');
  }

  getTabContent() {
    return this.getTabBlock().find('div#LinkConfigModal-Tabs-pane-url');
  }

  getTabBlockByTypeSelected() {
    switch(this.typeSelected) {
      default:
      case 1:
        return this.getTabURL();
      case 2:
        return this.getTabPage();
      case 3:
        return this.getTabContent();
    }
  }

  clickTabByDestType(destType) {
    this.typeSelected = destType;
    return this.getTabArea().children('li').eq(destType - 1)
      .children(htmlElements.a).click();
  }

  setUrlValue(value) {
    this.getTabURL().find('input[name="url"]').type(value);
  }

  setAttributeRelValue(value) {
    this.getTabBlockByTypeSelected().find('input[name="attributes.rel"]').type(value);
  }

  setAttributesTargetValue(value) {
    this.getTabBlockByTypeSelected().find('input[name="attributes.target"]').type(value);
  }

  setAttributeshrefLangValue(value) {
    this.getTabBlockByTypeSelected().find('input[name="attributes.hreflang"]').type(value);
  }

  confirm() {
    this.getTabBlockByTypeSelected().find(htmlElements.button)
      .then(el => el.length ? el[el.length - 1] : el).click();
  }
}

export default class LinkAttribute extends AttributeFormField {
  constructor(parent, attributeIndex, lang = 'en') {
    super(parent, 'Link', attributeIndex, lang);
  }

  getAddButton() {
    return this.getContents().find(htmlElements.button);
  }

  getTextInput() {
    return this.getContents().find(`input[name="${this.prefix}.values.${this.lang}"]`);
  }

  setValue({ link, value }) {
    if (this.lang === 'en') {
      this.getAddButton().click();
      this.setDialogBodyWithClass(LinkDialog);

      const { destType, rel, target, hreflang } = link;
      
      switch(destType) {
        case 1:
        default:
          this.getDialogBodyOfAttribute().setUrlValue(link.urlDest);
          break;
        case 2:
        case 3:
          // TO ADD: Page and Content option
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
    this.getTextInput().type(value);
  }

  
}