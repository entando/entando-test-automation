import {htmlElements, WebElement} from '../../../WebElement';

import AttributeFormField from '../AttributeFormField';

import AssetAttribute      from './AssetAttribute';
import BooleanAttribute    from './BooleanAttribute';
import CheckboxAttribute   from './CheckboxAttribute';
import DateAttribute       from './DateAttribute';
import EnumeratorAttribute from './EnumeratorAttribute';
import HypertextAttribute  from './HypertextAttribute';
import LinkAttribute       from './LinkAttribute';
import TextAttribute       from './TextAttribute';
import ThreeStateAttribute from './ThreeStateAttribute';
import TimestampAttribute  from './TimestampAttribute';
import CompositeAttribute  from './CompositeAttribute';

export class ListAttributeItem extends WebElement {
  constructor(parent, content, index) {
    super(parent);
    this.index   = index;
    this.content = content;
  }

  get() {
    return this.parent.getSubAttributeCollapseAt(this.index);
  }

  get field() {
    return this.content;
  }

  getCollapsePanelHead() {
    return this.get().find(`${htmlElements.div}.panel-heading`);
  }

  getCollapseToggler() {
    return this.getCollapsePanelHead().find(`${htmlElements.span}.icon`);
  }

  getSubAttributeItemDelete(lang) {
    return this.getCollapsePanelHead()
               .find(`${htmlElements.button}[name="entandoaction:removeListElement?attributeName=List;elementIndex=${this.index};listLangCode=${lang}"]`);
  }

  toggleSubAttributeCollapse() {
    this.getCollapseToggler().click();
    return this;
  }

  isCollapsed() {
    return this.getCollapseToggler().invoke('hasClass', 'fa-chevron-right');
  }

  collapse() {
    this.isCollapsed().then((collapsed) => {
      if (!collapsed) {
        this.toggleSubAttributeCollapse();
      }
    });
    return this;
  }

  expand() {
    this.isCollapsed().then((collapsed) => {
      if (collapsed) {
        this.toggleSubAttributeCollapse();
      }
    });
    return this;
  }

}

export default class ListAttribute extends AttributeFormField {
  listBody       = `${htmlElements.div}#contentedit_${this.lang}_List`;
  attributeItems = [];
  nestedType     = '';

  constructor(parent, attributeIndex, lang = 'en', useMonolist = false) {
    super(parent, useMonolist ? 'Monolist' : 'List', attributeIndex, lang);
  }

  getCollapseMain() {
    return this.getLangPane()
               .children(htmlElements.div).eq(this.index + (this.lang === 'en' ? 1 : 0))
               .children(`${htmlElements.div}.ContentFormFieldCollapse`);
  }

  getAttributesArea() {
    return this.getLangPane().children(this.listBody);
  }

  getTopControlArea() {
    return this.getAttributesArea().children(`${htmlElements.div}.form-group`);
  }

  getAddListitemButton() {
    return this.getTopControlArea().find(`${htmlElements.button}[name="entandoaction:addListElement?attributeName=List;listLangCode=${this.lang}"]`);
  }

  getSubAttributeCollapseAt(idx) {
    return this.getAttributesArea().find(`${htmlElements.ul}.list-group`)
                                   .children(`${htmlElements.li}.list-group-item`).eq(idx);
  }

  getSubAttributeChildrenAt(idx) {
    return this.getSubAttributeCollapseAt(idx)
               .find(`${htmlElements.div}.panel-body`);
  }

  setAttributeType(type) {
    this.nestedType = type;
  }

  createFieldInstance(attribute, idx) {
    switch (attribute) {
      case 'Text':
      case 'Longtext':
      case 'Monotext':
      case 'Email':
      case 'Number':
        return new TextAttribute(this.parent, idx, attribute, this.lang);
      case 'Boolean':
        return new BooleanAttribute(this.parent, idx);
      case 'CheckBox':
        return new CheckboxAttribute(this.parent, idx);
      case 'Date':
        return new DateAttribute(this, idx);
      case 'ThreeState':
        return new ThreeStateAttribute(this.parent, idx);
      case 'Enumerator':
      case 'EnumeratorMap':
        return new EnumeratorAttribute(this.parent, idx, attribute === 'EnumeratorMap');
      case 'Hypertext':
        return new HypertextAttribute(this.parent, idx, this.lang);
      case 'Link':
        return new LinkAttribute(this.parent, idx, this.lang);
      case 'Timestamp':
        return new TimestampAttribute(this.parent, idx);
      case 'Attach':
      case 'Image':
        return new AssetAttribute(this.parent, idx, attribute, this.lang);
      case 'Composite':
        return new CompositeAttribute(this.parent, idx, this.lang);
    }
  }

  generateInstanceListItem(idx) {
    const field = this.createFieldInstance(this.nestedType, idx);
    field.setParentAttribute(this);
    return new ListAttributeItem(this, field, idx);
  }

  setValue(values, editMode = false) {
    cy.wrap(0).as('toAddItem');
    if (editMode) {
      cy.wrap(0).as('toMinusItem');
      cy.wrap(0).as('attributeElementsLength');
      this.getAttributesArea().find(`${htmlElements.li}.list-group-item`)
          .then((attributeElements) => {
            const attributeElementsLength = attributeElements.length;
            cy.wrap(attributeElementsLength).as('attributeElementsLength');
            if (attributeElementsLength === values.length) {
              return;
            }
            const diff = values.length - attributeElementsLength;
            if (diff > 0) {
              cy.wrap(diff).as('toAddItem');
            } else {
              cy.wrap(diff * -1).as('toMinusItem');
            }
          });
    }
    values.forEach((item, idx) => {
      cy.get('@toAddItem').then((toAdd) => {
        if (!editMode || (toAdd > 0 && values.length - toAdd <= idx)) {
          this.getAddListitemButton().click();
          if (this.lang === 'it') cy.get('@currentPage').then(page => page.getContent().getContentAttributesLanguageTab(this.lang).click());
        }
      });
      const attributeItem = this.generateInstanceListItem(idx);
      if (editMode) {
        attributeItem.field.editValue(item);
      } else {
        attributeItem.field.setValue(item);
      }
      this.attributeItems.push(attributeItem);
    });
    if (editMode) {
      cy.get('@toMinusItem').then((toMinus) => {
        if (toMinus > 0) {
          cy.get('@attributeElementsLength').then((alength) => {
            for (let count = alength - 1; count > alength - 1 - toMinus; --count) {
              const attributeItem = new ListAttributeItem(this, null, count);
              if (this.lang === 'it') cy.get('@currentPage').then(page => page.getContent().getContentAttributesLanguageTab(this.lang).click());
              attributeItem.getSubAttributeItemDelete(this.lang).click();
            }
          });

        }
      });
    }
  }

  editValue(value) {
    this.setValue(value, true);
  }
}
