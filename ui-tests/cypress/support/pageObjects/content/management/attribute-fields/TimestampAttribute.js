import {htmlElements} from '../../../WebElement';

import DateAttribute from './DateAttribute';

export default class TimestampAttribute extends DateAttribute {
  constructor(parent, attributeIndex, composite = false) {
    super(parent, attributeIndex, 'en', true);
    this.composite = composite;
  }

  getComponentArea() {
    return this.getContents()
               .find(`${htmlElements.div}.col-sm-10`);
  }

  getTimeElementBy(metric = 'seconds') {
    const selector = (this.composite ? `Composite:Timestamp:Composite_Timestamp_${metric}` : `Timestamp:Timestamp_${metric}`);
    return this.getContents().find(`${htmlElements.select}[name="${selector}"]`);
  }

  setValue(value) {
    super.setValue(value);
    const [hours, minutes, seconds] = value.split(' ')[1].split(':');
    this.getTimeElementBy('hour').select(hours);
    this.getTimeElementBy('minute').select(minutes);
    this.getTimeElementBy('second').select(seconds);
  }

  editValue(value) {
    this.setValue(value);
  }
}
