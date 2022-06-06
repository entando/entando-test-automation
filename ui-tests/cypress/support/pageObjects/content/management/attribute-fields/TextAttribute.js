import AttributeFormField from '../AttributeFormField';

export default class TextAttribute extends AttributeFormField {

  constructor(parent, attributeIndex, attributeType = 'Text', lang = 'en', composite = false) {
    super(parent, attributeType, attributeIndex, lang);
    this.element = attributeType === 'Longtext' ? 'textarea' : 'input';
    this.composite = composite;
  }

  getInputName() {
    switch (this.attributeType) {
      case 'Monotext':
        return (this.composite ? 'Composite:Monotext:Composite_Monotext' : (this.parentAttribute ? `List:Monotext:${this.lang}_List_${this.index}` : 'Monotext:Monotext'));
      case 'Email':
        return (this.composite ? 'Composite:Email:Composite_Email' : (this.parentAttribute ? `List:Email:${this.lang}_List_${this.index}` : 'Email:Email'));
      case 'Number':
        return (this.composite ? 'Composite:Number:Composite_Number' : (this.parentAttribute ? `List:Number:${this.lang}_List_${this.index}` : 'Number:Number'));
      case 'Text':
        return (this.composite ? `Composite:Text:${this.lang}_Composite_Text` : `Text:${this.lang}_Text`);
      case 'Longtext':
        return (this.composite ? `Composite:Longtext:${this.lang}_Composite_Longtext` : `Longtext:${this.lang}_Longtext`);
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
               .find('.text-danger');
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
