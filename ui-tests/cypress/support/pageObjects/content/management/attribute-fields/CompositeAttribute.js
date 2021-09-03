import AttributeFormField from '../AttributeFormField';
import AssetAttribute from './AssetAttribute';
import HypertextAttribute from './HypertextAttribute';
import TextAttribute from './TextAttribute';

export default class CompositeAttribute extends AttributeFormField {
  panelBody = 'div.panel-body';
  constructor(parent, attributeIndex, lang = 'en') {
    super(parent, 'Composite', attributeIndex, lang);
  }

  getAttributesArea() {
    return this.getContents().find(this.panelBody);
  }

  getSubAttributeChildrenAt(idx) {
    return this.getAttributesArea().children().eq(idx);
  }

  setValue(values) {
    values.forEach(({ type, value }, idx) => {
      let field;
      switch(type) {
        case 'Text':
        case 'Longtext': {
          field = new TextAttribute(this.parent, idx, type, this.lang);
          break;
        }
        case 'Hypertext': {
          field = new HypertextAttribute(this.parent, idx, this.lang);
          break;
        } 
        case 'Attach':
        case 'Image': {
          field = new AssetAttribute(this.parent, idx, type, this.lang);
          break;
        }
      }
      field.setParentAttribute(this);
      field.setValue(value);
    });
  }
}
