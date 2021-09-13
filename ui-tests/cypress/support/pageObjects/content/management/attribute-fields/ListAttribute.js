import { WebElement } from "../../../WebElement";
import AttributeFormField from "../AttributeFormField";
import AssetAttribute from './AssetAttribute';
import BooleanAttribute from './BooleanAttribute';
import CheckboxAttribute from './CheckboxAttribute';
import DateAttribute from './DateAttribute';
import EnumeratorAttribute from './EnumeratorAttribute';
import HypertextAttribute from './HypertextAttribute';
import LinkAttribute from './LinkAttribute';
import TextAttribute from './TextAttribute';
import ThreeStateAttribute from './ThreeStateAttribute';
import TimestampAttribute from './TimestampAttribute';
import CompositeAttribute from "./CompositeAttribute";

export class ListAttributeItem extends WebElement {
  constructor(parent, content, index) {
    super(parent);
    this.index = index;
    this.content = content;
  }

  get() {
    return this.parent.getSubAttributeCollapseAt(this.index);
  }

  get field() {
    return this.content;
  }

  getCollapsePanelHead() {
    return this.get().find('div.panel-heading');
  }

  getCollapseToggler() {
    return this.getCollapsePanelHead().find('span.icon');
  }

  getSubAttributeItemDelete() {
    return this.getCollapsePanelHead()
      .find(`button[title="Delete ${this.index}"].btn-danger`);
  }

  toggleSubAttributeCollapse() {
    this.getCollapseToggler().click();
    return this;
  }

  isCollapsed() {
    return this.getCollapseToggler().invoke('hasClass','fa-chevron-right');
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
  listBody = 'div.RenderListField__body';
  attributeItems = [];
  attributeType = '';
  constructor(parent, attributeIndex, lang = 'en', useMonolist = false) {
    super(parent, useMonolist ? 'Monolist' : 'List', attributeIndex, lang);
  }

  getAttributesArea() {
    return this.getContents().find(this.listBody);
  }

  getTopControlArea() {
    return this.getAttributesArea().children('div.form-group');
  }

  getAddListitemButton() {
    return this.getTopControlArea().find('button[title="add"]');
  }

  getSubAttributeCollapseAt(idx) {
    return this.getAttributesArea().children().eq(idx + 1);
  }

  getSubAttributeChildrenAt(idx) {
    return this.getSubAttributeCollapseAt(idx)
      .find('div.ReactCollapse--content').children('div.panel-body');
  }

  setAttributeType(type) {
    this.attributeType = type;
  }
  
  setValue(values, editMode = false) {
    values.forEach((item, idx) => {
      if (!editMode) {
        this.getAddListitemButton().click();
      }
      let field;
      switch(this.attributeType) {
        case 'Text':
        case 'Longtext':
        case 'Monotext':
        case 'Email':
        case 'Number': {
          field = new TextAttribute(this.parent, idx, this.attributeType, this.lang);
          break;
        }
        case 'Boolean': {
          field = new BooleanAttribute(this.parent, idx);
          break;
        }
        case 'CheckBox': {
          field = new CheckboxAttribute(this.parent, idx);
          break;
        }
        case 'Date': {
          field = new DateAttribute(this, idx);
          break;
        }
        case 'ThreeState': {
          field = new ThreeStateAttribute(this.parent, idx);
          break;
        }
        case 'Enumerator':
        case 'EnumeratorMap': {
          field = new EnumeratorAttribute(this.parent, idx, this.attributeType === 'EnumeratorMap');
          break;
        }
        case 'Hypertext': {
          field = new HypertextAttribute(this.parent, idx, this.lang);
          break;
        }
        case 'Link': {
          field = new LinkAttribute(this.parent, idx, this.lang);
          break;
        }
        case 'Timestamp': {
          field = new TimestampAttribute(this.parent, idx);
          break;
        } 
        case 'Attach':
        case 'Image': {
          field = new AssetAttribute(this.parent, idx, this.attributeType, this.lang);
          break;
        }
        case 'Composite': {
          field = new CompositeAttribute(this.parent, idx, this.lang);
          break;
        }
      }
      field.setParentAttribute(this);
      const attributeItem = new ListAttributeItem(this, field, idx);
      if (editMode) {
        field.editValue(item);
      } else {
        field.setValue(item);
      }
      this.attributeItems.push(attributeItem);

    });
  }

  editValue(value) {
    this.setValue(value, true);
  }
}
