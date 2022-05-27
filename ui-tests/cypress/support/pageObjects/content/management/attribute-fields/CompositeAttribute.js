import {htmlElements} from '../../../WebElement';

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

export default class CompositeAttribute extends AttributeFormField {
  panelBody = `${htmlElements.div}.panel-body`;

  constructor(parent, attributeIndex, lang = 'en') {
    super(parent, 'Composite', attributeIndex, lang);
  }

  getAttributesArea() {
    return this.getContents().find(this.panelBody);
  }

  getSubAttributeChildrenAt(idx) {
    return this.getAttributesArea().children().eq(idx);
  }

  setValue(values, editMode = false) {
    values.forEach(({type, value}, idx) => {
      let field;
      switch (type) {
        case 'Text':
        case 'Longtext':
        case 'Monotext':
        case 'Email':
        case 'Number': {
          field = new TextAttribute(this.parent, idx, type, this.lang, true);
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
          field = new DateAttribute(this.parent, idx);
          break;
        }
        case 'ThreeState': {
          field = new ThreeStateAttribute(this.parent, idx);
          break;
        }
        case 'Enumerator':
        case 'EnumeratorMap': {
          field = new EnumeratorAttribute(this.parent, idx, type === 'EnumeratorMap');
          break;
        }
        case 'Hypertext': {
          field = new HypertextAttribute(this.parent, idx, this.lang, true);
          break;
        }
        case 'Link': {
          field = new LinkAttribute(this.parent, idx, this.lang, true);
          break;
        }
        case 'Timestamp': {
          field = new TimestampAttribute(this.parent, idx, true);
          break;
        }
        case 'Attach':
        case 'Image': {
          field = new AssetAttribute(this.parent, idx, type, this.lang, true);
          break;
        }
      }
      field.setParentAttribute(this);
      if (editMode) {
        field.editValue(value);
      } else {
        field.setValue(value);
      }
    });
  }

  editValue(value) {
    this.setValue(value, true);
  }
}
