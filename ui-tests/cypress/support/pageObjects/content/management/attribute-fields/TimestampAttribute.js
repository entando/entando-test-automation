import {htmlElements} from "../../../WebElement";
import DateAttribute from "./DateAttribute";

export default class TimestampAttribute extends DateAttribute {
  constructor(parent, attributeIndex) {
    super(parent, attributeIndex, 'en', true);
  }

  getComponentArea() {
    return this.getContents()
      .find(`${htmlElements.div}.col-xs-10`);
  }

  getTimeElementBy(metric = 'seconds') {
    return this.getContents().find(`${htmlElements.select}[name="${this.prefix}.value.${metric}"]`);
  }

  setValue(value) {
    super.setValue(value);
    const [hours, minutes, seconds] = value.split(' ')[1].split(':');
    this.getTimeElementBy('hours').select(hours);
    this.getTimeElementBy('minutes').select(minutes);
    this.getTimeElementBy('seconds').select(seconds);
  }

  editValue(value) {
    this.setValue(value);
  }
}
