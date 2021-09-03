import AttributeFormField from '../AttributeFormField';

export default class TextAttribute extends AttributeFormField {
  constructor(parent, attributeIndex, attributeType = 'Text', lang = 'en') {
    super(parent, attributeType, attributeIndex, lang);
    this.element = attributeType === 'Longtext' ? 'textarea' : 'input';
  }

  getInputName() {
    switch(this.attributeType) {
      case 'Text':
      case 'Longtext':
      default:
        return `${this.prefix}.values.${this.lang}`;
      case 'Monotext':
      case 'Email':
      case 'Number':
        return `${this.prefix}.value`;
    }
  }

  getInput() {
    return this.getContents()
      .find(`${this.element}[name="${this.getInputName()}"]`);
  }

  setValue(text) {
    this.getInput().type(text);
  }

  getValue() {
    this.getInput().invoke('val');
  }
}