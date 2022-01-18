import ContentQueryWidgetConfigPage from '../../../pages/designer/widgetconfigs/ContentQueryWidgetConfigPage';
import { htmlElements } from '../../../WebElement';
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

    //Keeps opening and closing the collapse until the calendar opens up
    this.parent.get().find(`${htmlElements.div}.react-datepicker__header`).as('button');

    cy.get("body").then($body => {
      if ($body.find(`${htmlElements.div}.react-datepicker__header`).length > 0) {   
      //evaluates as true if button exists at all
          cy.get('@button').then($header => {
            if ($header.is(':visible')){
              //you get here only if button EXISTS and is VISIBLE
              this.getMonthYearCaptionText().then((monthyear) => 
              this.calculateMonthDiff(dateValue, monthyear)
              ).then(({ direction: dir, steps }) => {
               if (dir !== '') {
                 for (let i = 0; i < steps; i++) {
               if (dir === 'previous') {
               this.getPreviousMonthButton().click();
              }else {
               this.getNextMonthButton().click();
              }
                 }
              }
              this.getDayPickArea().contains(new RegExp(`^${dateValue.getDate()}$`)).click();
              this.getInputArea().find('input').blur();
              });
            } else {
                 //you get here only if button EXISTS but is INVISIBLE
                 this.parent.get()
                            .find(`${htmlElements.div}#content-attributes-tabs`)
                            .find(`${htmlElements.div}#content-attributes-tabs-pane-en`)
                            .find(`${htmlElements.div}.ContentFormFieldCollapse`)
                            .find(`${htmlElements.div}.SectionTitle`).click();
                 cy.wait(500);
                 this.parent.get()
                            .find(`${htmlElements.div}#content-attributes-tabs`)
                            .find(`${htmlElements.div}#content-attributes-tabs-pane-en`)
                            .find(`${htmlElements.div}.ContentFormFieldCollapse`)
                            .find(`${htmlElements.div}.SectionTitle`).click();
                 cy.wait(500);

                 return this.setValue(value)
            }
          });
      }
    });

  }

  editValue(value) {
    this.setValue(value);
  }
}
