import AttributeFormField from '../AttributeFormField';
import AssetAttribute from './AssetAttribute';
import HypertextAttribute from './HypertextAttribute';
import TextAttribute from './TextAttribute';

export default class CompositeAttribute extends AttributeFormField {
  panelBody = 'div.panel-body';
  constructor(parent, elementScope, attributeIndex, lang = 'en', prefix = 'attributes') {
    super(parent, elementScope, 'Hypertext', attributeIndex, lang);
    this.prefix = prefix;
  }

  getAttributesArea() {
    return this.getContents().find(this.panelBody);
  }

  setValues(values) {
    values.forEach(({ type, value }, idx) => {
      const attrname = `attributes[${this.attributeIndex}].compositeelements[${idx}].values.${this.lang}`;
      switch(type) {
        case 'Text':
        case 'Longtext': {
          const field = new TextAttribute(this, idx, this.lang, attrname, type === 'Longtext');
          field.expand()
            .setValue(value);
          break;
        }
        case 'Hypertext': {
          const field = new HypertextAttribute(this, idx, this.lang, attrname);
          field.expand()
            .setValue(value);
          break;
        } 
        case 'Attach':
        case 'Image': {
          const field = new AssetAttribute(this, idx, type, this.lang, attrname);
          field.expand()
            .setValue(value);
          break;
        }
      }
    });
  }
}
