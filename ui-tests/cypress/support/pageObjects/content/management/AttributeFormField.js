import { WebElement } from '../../WebElement';

export default class AttributeFormField extends WebElement {
  constructor(pageParent, attributeType, index, lang = 'en') {
    super(pageParent);
    this.attributeType = attributeType;
    this.index = index;
    this.lang = lang;
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
    this.getLangPane()
      .children('div.ContentFormFieldCollapse').eq(this.index);
  }

  get() {
    return this.getCollapseMain();
  }

  isCollapsed() {
    return this.get().invoke('hasClass','closed');
  }

  getToggleTitle() {
    return this.get().children('div[role="button"].SectionTitle');
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

  getContents() {
    return this.get().children('div.ReactCollapse--collapse')
      .children('div.ReactCollapse--content')
      .children('div.ContentFormFieldCollapse__body');
  }
}