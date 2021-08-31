import AttributeFormField from '../AttributeFormField';

export default class HypertextAttribute extends AttributeFormField {
  constructor(parent, attributeIndex, lang = 'en', prefix = 'attributes') {
    super(parent, 'Hypertext', attributeIndex, lang);
    this.prefix = prefix;
  }

  getInput() {
    // TODO: add field selector option when RTE option will be used for testing
    return this.getContents()
      .find(`textarea[name="${this.prefix}[${this.index}].values.${this.lang}"]`);
  }

  setValue(text) {
    this.getInput().type(text);
  }

  getValue() {
    this.getInput().invoke('val');
  }
}