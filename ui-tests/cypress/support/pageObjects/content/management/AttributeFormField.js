import {WebElement} from '../../WebElement';

export default class AttributeFormField extends WebElement {
  constructor(pageParent, attributeType, index, lang = 'en') {
    super(pageParent);
    this.attributeType   = attributeType;
    this.index           = index;
    this.lang            = lang;
    this.parentAttribute = null;
  }

  setParentAttribute(attribute) {
    this.parentAttribute = attribute;
  }

  getLangPane() {
    return this.parent.get()
               .find(`#content-attributes-tabs-pane-${this.lang}`);
  }

  getCollapseMain() {
    return this.getLangPane()
               .children('div.ContentFormFieldCollapse').then(el => Array.isArray(el) ? el[this.index] : el);
  }

  getTopContents() {
    return this.getCollapseMain().children('div.ReactCollapse--collapse')
               .children('div.ReactCollapse--content')
               .children('div.ContentFormFieldCollapse__body');
  }

  get() {
    if (this.parentAttribute) {
      return this.parentAttribute.getSubAttributeChildrenAt(this.index);
    }
    return this.getTopContents();
  }

  getContents() {
    return this.get();
  }

  get prefix() {
    if (!this.parentAttribute) {
      return `attributes[${this.index}]`;
    }
    const {prefix, attributeType} = this.parentAttribute;
    switch (attributeType) {
      default:
        return `attributes[${this.index}]`;
      case 'Composite':
        return `${prefix}.compositeelements[${this.index}]`;
      case 'List':
        return `${prefix}.listelements.${this.lang}[${this.index}]`;
      case 'Monolist':
        return `${prefix}.elements[${this.index}]`;
    }

  }

  isCollapsed() {
    return this.getCollapseMain().invoke('hasClass', 'closed');
  }

  getToggleTitle() {
    return this.getCollapseMain().children('div[role="button"].SectionTitle');
  }

  toggleCollapse() {
    this.getToggleTitle().click();
    return this;
  }

  getDialogOfAttribute() {
    return this.parent.parent.getDialog();
  }

  getDialogBodyOfAttribute() {
    return this.getDialogOfAttribute().getBody();
  }

  setDialogBodyWithClass(component) {
    this.parent.parent.getDialog().setBody(component);
  }

  collapse() {
    this.isCollapsed().then((collapsed) => {
      if (!collapsed) {
        this.toggleCollapse();
      }
    });
    return this;
  }

  expand() {
    this.isCollapsed().then((collapsed) => {
      if (collapsed) {
        this.toggleCollapse();
      }
    });
    return this;
  }
}
