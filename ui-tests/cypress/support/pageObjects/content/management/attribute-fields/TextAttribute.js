import AttributeFormField from '../AttributeFormField';

export default class TextAttribute extends AttributeFormField {

  constructor(parent, attributeIndex, attributeType = 'Text', lang = 'en') {
    super(parent, attributeType, attributeIndex, lang);
    this.element = attributeType === 'Longtext' ? 'textarea' : 'input';
  }

  getInputName() {
    switch (this.attributeType) {
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

  getHelpBlock() {
    return this.getContents()
               .find('.help-block');
  }

  getInput() {
    return this.getContents()
               .find(`${this.element}[name="${this.getInputName()}"]`);
  }

  setValue(text) {
    if (!text) {
      return;
    }
    this.getInput().type(text).blur();
  }

  editValue(text) {
    this.getInput().clear();
    this.setValue(text);
  }

  getValue() {
    this.getInput().invoke('val');
  }
}
