import {htmlElements, WebElement} from '../WebElement.js';

export default class Content extends WebElement {

  getInputError(input) {
    return cy.get(input)
             .parent().parent()
             .find(`${htmlElements.span}.help-block`);
  }

  click(input, force = false) {
    if (!force) cy.get(input).click();
    else cy.get(input).click({force: true});
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

  type(input, value, append = false, parse = true) {
    if (!append) cy.get(input).clear();
    if (parse) {
      cy.get(input).type(value);
    } else {
      cy.get(input).type(value, {parseSpecialCharSequences: false});
    }
    return cy.get('@currentPage');
  }

  select(input, value) {
    cy.get(input).select(value);
    cy.waitForStableDOM();
    return cy.get('@currentPage');
  }

}
