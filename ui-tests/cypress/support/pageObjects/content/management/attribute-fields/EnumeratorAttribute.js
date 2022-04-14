import AttributeFormField from '../AttributeFormField';

export default class EnumeratorAttribute extends AttributeFormField {
  constructor(parent, attributeIndex, enumMap = false) {
    super(parent, enumMap ? 'EnumeratorMap' : 'Enumerator', attributeIndex);
  }

  getInputArea() {
    return this.getContents()
               .find('select');
  }

  setValue(value) {
    this.getInputArea().select(value);
  }

  editValue(value) {
    this.setValue(value);
  }
}
