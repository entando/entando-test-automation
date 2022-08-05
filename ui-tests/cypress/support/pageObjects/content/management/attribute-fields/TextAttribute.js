import AttributeFormField from '../AttributeFormField';

export default class TextAttribute extends AttributeFormField {

  constructor(parent, attributeIndex, attributeType = 'Text', lang = 'en', composite = false) {
    super(parent, attributeType, attributeIndex, lang);
    this.element = attributeType === 'Longtext' ? 'textarea' : 'input';
    this.composite = composite;
  }

  getInputName() {
    switch(this.attributeType) {
      case 'Monotext':
      case 'Email':
      case 'Number':
        return `${this.prefix}.value`;
      case 'Text':
      case 'Longtext':
      default:
        return `${this.prefix}.values.${this.lang}`;
    }
  }

  getContents() {
    if (this.parentAttribute) {
      return this.get();
    }
    return this.get().find('.form-group');
  }
  
  getInput() {
    return this.getContents()
               .find(`${this.element}[name="${this.getInputName()}"]`);
  }

  setValue(text) {
    if (!text) {
      return;
    }
    this.getInput().then(input => {
      this.parent.type(input, text);
      this.parent.blur(input);
    });
  }

  editValue(text) {
    this.getInput().clear();
    this.setValue(text);
  }

  getValue() {
    this.getInput().invoke('val');
  }
}
