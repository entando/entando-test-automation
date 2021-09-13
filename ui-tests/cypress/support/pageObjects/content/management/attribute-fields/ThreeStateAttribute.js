import BooleanAttribute from './BooleanAttribute';

export default class ThreeStateAttribute extends BooleanAttribute {
  constructor(parent, attributeIndex) {
    super(parent, 'ThreeState', attributeIndex);
  }

  getBothSwitch() {
    return this.getInputArea()
      .find('label').eq(2);
  }

  setValue(value) {
    if (value === true) {
      this.getYesSwitch().click();
    } else if (value === false) {
      this.getNoSwitch().click();
    } else {
      this.getBothSwitch().click();
    }
  }

  editValue(value) {
    this.setValue(value);
  }
}
