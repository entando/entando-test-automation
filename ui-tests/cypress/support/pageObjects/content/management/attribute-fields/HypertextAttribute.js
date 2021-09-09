import AttributeFormField from '../AttributeFormField';

export default class HypertextAttribute extends AttributeFormField {
  constructor(parent, attributeIndex, lang = 'en') {
    super(parent, 'Hypertext', attributeIndex, lang);
  }

  getInput() {
    // TODO: add field selector option when RTE option will be used for testing
    return this.getContents()
      .find(`textarea[name="${this.prefix}.values.${this.lang}"]`);
  }

  setValue(text) {
    this.getInput().type(text);
  }

  editValue(value) {
    this.getInput().clear();
    this.setValue(value);
  }

  getValue() {
    this.getInput().invoke('val');
  }
}
