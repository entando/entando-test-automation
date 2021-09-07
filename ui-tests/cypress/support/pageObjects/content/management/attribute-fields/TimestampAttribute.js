import DateAttribute from "./DateAttribute";

export default class TimestampAttribute extends DateAttribute {
  constructor(parent, attributeIndex, lang = 'en') {
    super(parent, attributeIndex, lang, true);
  }

  getComponentArea() {
    return this.getContents()
      .find('div.col-xs-10');
  }

  getTimeElementBy(metric = 'seconds') {
    return this.getContents().find(`select[name="${this.prefix}.value.${metric}"]`);
  }
  setValue(value) {
    super.setValue(value);
    const [hours, minutes, seconds] = value.split(' ')[1].split(':');
    this.getTimeElementBy('hours').select(hours);
    this.getTimeElementBy('minutes').select(minutes);
    this.getTimeElementBy('seconds').select(seconds);
  }
}