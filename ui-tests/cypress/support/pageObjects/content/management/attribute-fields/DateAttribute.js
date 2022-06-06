import {htmlElements} from '../../../WebElement';

import AttributeFormField from '../AttributeFormField';

export default class DateAttribute extends AttributeFormField {
  inputArea         = `${htmlElements.div}.input-group.datepicker.date`;
  calendarPopper    = `${htmlElements.div}.datepicker.datepicker-dropdown`;
  calendarContainer = `${htmlElements.div}.react-datepicker__month-container`;
  calendarHeader    = `${htmlElements.div}.datepicker-days`;
  currentMonth      = `${htmlElements.th}.datepicker-switch`;
  dayPick           = `${htmlElements.tbody}`;

  constructor(parent, attributeIndex, lang = 'en', addTimestamp = false) {
    super(parent, addTimestamp ? 'Timestamp' : 'Date', attributeIndex, lang);
  }

  getContents() {
    if (this.parentAttribute) {
      return this.get();
    }
    return this.get().find('.form-group');
  }

  getInputArea() {
    return this.getContents().find(this.inputArea);
  }

  getCalendarArea() {
    return this.parent.parent.parent.get().find(this.calendarPopper);
  }

  getPreviousMonthButton() {
    return this.getCalendarArea().children(`${htmlElements.div}.datepicker-days`).find(`${htmlElements.th}.prev`);
  }

  getNextMonthButton() {
    return this.getCalendarArea().children(`${htmlElements.div}.datepicker-days`).find(`${htmlElements.th}.next`);
  }

  getCalendarHeader() {
    return this.getCalendarArea().find(this.calendarHeader);
  }

  getMonthYearCaptionText() {
    return this.getCalendarHeader().find(this.currentMonth).invoke('text');
  }

  getDayPickArea() {
    return this.getCalendarArea().find(this.dayPick);
  }

  calculateMonthDiff(dateValue, monthyear) {
    const dateHead = new Date(monthyear);
    const diff     = 12 * (dateHead.getFullYear() - dateValue.getFullYear())
        + (dateHead.getMonth() - dateValue.getMonth());
    let direction  = '', steps = 0;
    if (diff !== 0) {
      direction = diff > 0 ? 'previous' : 'next';
      steps     = diff < 0 ? -1 * diff : diff;
    }
    console.log(`direction ${direction}, steps ${steps}`);
    return {direction, steps};
  }

  setValue(value) {
    if (!value) {
      return;
    }
    const dateValue = new Date(value);
    this.getInputArea().click();
    this.getMonthYearCaptionText().then((monthyear) =>
        this.calculateMonthDiff(dateValue, monthyear)
    ).then(({direction: dir, steps}) => {
      if (dir !== '') {
        for (let i = 0; i < steps; i++) {
          if (dir === 'previous') {
            this.getPreviousMonthButton().click();
          } else {
            this.getNextMonthButton().click();
          }
        }
      }
      this.getDayPickArea().contains(new RegExp(`^${dateValue.getDate()}$`)).click();
    });
  }

  editValue(value) {
    this.setValue(value);
  }
}
