import {htmlElements} from '../../../WebElement';

import AttributeFormField from '../AttributeFormField';

export default class CheckboxAttribute extends AttributeFormField {
  constructor(parent, attributeIndex, lang = 'en') {
    super(parent, 'CheckBox', attributeIndex, lang);
  }

  getInputArea() {
    return this.getContents()
               .find(`${htmlElements.div}.bootstrap-switch`);
  }

  isInputChecked() {
    return this.getInputArea().invoke('hasClass', 'bootstrap-switch-on');
  }

  setValue(value) {
    this.isInputChecked().then((checked) => {
      if (value === true && !checked) {
        this.getInputArea().click();
      }
      if (value === false && checked) {
        this.getInputArea().click();
      }
    });
    return this;
  }

  editValue(value) {
    this.setValue(value);
  }
}
