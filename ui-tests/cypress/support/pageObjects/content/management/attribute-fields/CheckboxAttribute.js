import AttributeFormField from '../AttributeFormField';

export default class BooleanAttribute extends AttributeFormField {
  getInputArea() {
    return this.getContents()
      .find('div.bootstrap-switch.wrapper');
  }

  isInputChecked() {
    return this.getInputArea().invoke('hasClass', 'bootstrap-switch-on');
  }

  setValue(value) {
    return this.isInputChecked().then((checked) => {
      if (value === true && !checked) {
        this.getInputArea().click();
      }
      if (value === false && checked) {
        this.getInputArea().click();
      }
      return this;
    });
  }
}
