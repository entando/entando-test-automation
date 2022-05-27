import {htmlElements, WebElement} from '../../WebElement';

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
               .find(`${htmlElements.div}#${this.lang}_tab`);
  }

  getTopContents() {
    return this.getLangPane()
               .children(htmlElements.div);
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

  isCollapsed() {
    return this.getCollapseMain().invoke('hasClass', 'closed');
  }

  getToggleTitle() {
    return this.getCollapseMain().children(`${htmlElements.div}[role="button"].SectionTitle`);
  }

  toggleCollapse() {
    this.getToggleTitle().click();
    return this;
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
