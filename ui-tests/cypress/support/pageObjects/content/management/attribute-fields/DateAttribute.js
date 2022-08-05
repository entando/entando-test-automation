import {htmlElements} from '../../../WebElement';
import AttributeFormField from '../AttributeFormField';

export default class DateAttribute extends AttributeFormField {
  pickerInput = `${htmlElements.div}.RenderDatePickerInput__container`;
  inputArea = `${htmlElements.div}.react-datepicker-wrapper`;
  calendarPopper = `${htmlElements.div}.react-datepicker-popper`;
  monthButtons = `${htmlElements.button}[type=button].react-datepicker__navigation.react-datepicker__navigation`;
  calendarContainer = `${htmlElements.div}.react-datepicker__month-container`;
  calendarHeader = `${htmlElements.div}.react-datepicker__header`;
  currentMonth = `${htmlElements.div}.react-datepicker__current-month`;
  dayPick = `${htmlElements.div}[role="listbox"].react-datepicker__month`;

  constructor(parent, attributeIndex, lang = 'en', addTimestamp = false) {
    super(parent, addTimestamp ? 'Timestamp' : 'Date', attributeIndex, lang);
  }

  getContents() {
    if (this.parentAttribute) {
      return this.get();
    }
    return this.get().find('.form-group');
  }

  getComponentArea() {
    return this.getContents()
      .find(this.pickerInput);
  }

  getInputArea() {
    return this.getComponentArea().find(this.inputArea);
  }

  getCalendarArea() {
    return this.getComponentArea().find(this.calendarPopper);
  }

  getPreviousMonthButton() {
    return this.getCalendarArea().find(`${this.monthButtons}--previous`);
  }

  getNextMonthButton() {
    return this.getCalendarArea().find(`${this.monthButtons}--next`);
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
    const diff = 12 * (dateHead.getFullYear() - dateValue.getFullYear())
      + (dateHead.getMonth() - dateValue.getMonth());
    let direction = '', steps = 0;
    if (diff !== 0) {
      direction = diff > 0 ? 'previous' : 'next';
      steps = diff < 0 ? -1 * diff : diff;
    }
    console.log(`direction ${direction}, steps ${steps}`);
    return { direction, steps };
  }

  setValue(value) {
    if (!value) {
      return;
    }
    const dateValue = new Date(value);
    this.getInputArea().click();
    this.getMonthYearCaptionText().then((monthyear) => 
      this.calculateMonthDiff(dateValue, monthyear)
    ).then(({ direction: dir, steps }) => {
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
      this.getInputArea().find(htmlElements.input).blur();
    });
  }

  editValue(value) {
    this.setValue(value);
  }
}
