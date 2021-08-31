import AttributeFormField from '../AttributeFormField';

export default class TextAttribute extends AttributeFormField {
  constructor(parent, attributeIndex, lang = 'en', prefix = 'attributes', longText = false) {
    super(parent, longText ? 'Longtext' : 'Text', attributeIndex, lang);
    this.prefix = prefix;
    this.element = longText ? 'textarea' : 'input';
  }

  getInput() {
    return this.getContents()
      .find(`${this.element}[name="${this.prefix}[${this.index}].values.${this.lang}"]`);
  }

  setValue(text) {
    this.getInput().type(text);
  }

  getValue() {
    this.getInput().invoke('val');
  }
}