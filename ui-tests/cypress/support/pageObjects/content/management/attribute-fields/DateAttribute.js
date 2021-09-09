import AttributeFormField from '../AttributeFormField';

export default class DateAttribute extends AttributeFormField {
  pickerInput = 'div.RenderDatePickerInput__container';
  inputArea = 'div.react-datepicker-wrapper';
  calendarPopper = 'div.react-datepicker-popper';
  monthButtons = 'button[type=button].react-datepicker__navigation.react-datepicker__navigation';
  calendarContainer = 'div.react-datepicker__month-container';
  calendarHeader = 'div.react-datepicker__header';
  currentMonth = 'div.react-datepicker__current-month';
  dayPick = 'div[role="listbox"].react-datepicker__month';

  constructor(parent, attributeIndex, lang = 'en', addTimestamp = false) {
    super(parent, addTimestamp ? 'Timestamp' : 'Date', attributeIndex, lang);
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
    console.log(`monthyear ${monthyear}`);
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
    });
  }

  editValue(value) {
    this.setValue(value);
  }
}
