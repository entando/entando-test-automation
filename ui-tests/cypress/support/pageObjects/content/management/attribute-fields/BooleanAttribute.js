import AttributeFormField from '../AttributeFormField';

export default class BooleanAttribute extends AttributeFormField {
  constructor(parent, attributeIndex) {
    super(parent, 'Boolean', attributeIndex);
  }

  getInputArea() {
    return this.getContents()
      .find('[role="toolbar"]');
  }

  getYesSwitch() {
    return this.getInputArea()
      .find('label').eq(0);
  }

  getNoSwitch() {
    return this.getInputArea()
      .find('label').eq(1);
  }

  setValue(value) {
    if (value === true) {
      this.getYesSwitch().click();
    } else {
      this.getNoSwitch().click();
    }
  }
}
