import {htmlElements} from '../../../WebElement';

import AttributeFormField from '../AttributeFormField';

export default class BooleanAttribute extends AttributeFormField {
  constructor(parent, attributeIndex, threeStateMode = false) {
    super(parent, threeStateMode ? 'ThreeState' : 'Boolean', attributeIndex);
  }

  getInputArea() {
    return this.getContents()
               .find('[data-toggle="buttons"]');
  }

  getYesSwitch() {
    return this.getInputArea()
               .children(htmlElements.label).eq(0);
  }

  getNoSwitch() {
    return this.getInputArea()
               .children(htmlElements.label).eq(1);
  }

  setValue(value) {
    if (value === true) {
      this.getYesSwitch().click();
    } else {
      this.getNoSwitch().click();
    }
  }

  editValue(value) {
    this.setValue(value);
  }
}
