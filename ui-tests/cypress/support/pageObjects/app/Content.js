import {htmlElements, WebElement} from '../WebElement.js';

export default class Content extends WebElement {

  content = `${htmlElements.div}.container-fluid`;

  get() {
    return this.parent.get()
               .children(this.content);
  }

  getContents() {
    return this.get()
               .children(htmlElements.div);
  }

  getBreadCrumb() {
    return this.getContents()
               .children(htmlElements.div).eq(0)
               .children(htmlElements.div)
               .children(htmlElements.ol);
  }

  getTitle() {
    return this.getContents()
               .children(htmlElements.div).eq(1)
               .find(htmlElements.h1);
  }

  getAlertMessage() {
    return this.getContents()
               .find(this.alertMessageDiv);
  }

  getInputError(input) {
    return cy.get(input)
             .parent().parent()
             .find(`${htmlElements.span}.help-block`);
  }

  click(input) {
    cy.get(input).click();
    return cy.get('@currentPage');
  }

  focus(input) {
    cy.get(input).focus();
    return cy.get('@currentPage');
  }

  blur(input = null) {
    if (input) cy.get(input).blur();
    else cy.focused().blur();
    return cy.get('@currentPage');
  }

  clear(input) {
    cy.get(input).clear();
    return cy.get('@currentPage');
  }

  type(input, value, append = false) {
    if (!append) cy.get(input).clear();
    cy.get(input).type(value);
    return cy.get('@currentPage');
  }

  select(input, value) {
    cy.get(input).select(value);
    return cy.get('@currentPage');
  }

}
