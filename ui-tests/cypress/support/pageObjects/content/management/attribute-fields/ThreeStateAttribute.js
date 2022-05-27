import {htmlElements} from '../../../WebElement';

import BooleanAttribute from './BooleanAttribute';

export default class ThreeStateAttribute extends BooleanAttribute {
  constructor(parent, attributeIndex) {
    super(parent, attributeIndex, true);
  }

  getBothSwitch() {
    return this.getInputArea()
               .children(htmlElements.label).eq(2);
  }

  setValue(value) {
    if (value === true) {
      this.getYesSwitch().then(button => this.parent.click(button, true));
    } else if (value === false) {
      this.getNoSwitch().then(button => this.parent.click(button, true));
    } else {
      this.getBothSwitch().then(button => this.parent.click(button, true));
    }
  }

  editValue(value) {
    this.setValue(value);
  }
}
