import {htmlElements, WebElement} from '../WebElement.js';

export default class AppTour extends WebElement {

  get() {
    return this.parent.get()
               .children(htmlElements.body)
               .children(`${htmlElements.div}#___reactour`);
  }

  getTourContainer() {
    return this.get()
               .find(`${htmlElements.div}.TourStart`);
  }

  getFooter() {
    return this.getTourContainer()
               .children(`${htmlElements.div}.TourStart__footer`);
  }

  getStartButton() {
    return this.getFooter()
               .children(`${htmlElements.button}.TourStart__start-button`);
  }

  getCloseButton() {
    return this.getFooter()
               .children(`${htmlElements.button}.TourStart__cancel-button`);
  }

  getCancelCloseButton() {
    return this.getFooter()
               .children(`${htmlElements.button}.TourStart__no-button`);
  }

  getConfirmCloseButton() {
    return this.getFooter()
               .children(`${htmlElements.button}.TourStart__yes-button`);
  }

  close() {
    this.getCloseButton().click();
    return cy.get('@currentPage');
  }

  confirmClose() {
    this.getConfirmCloseButton().click();
    return cy.get('@currentPage');
  }

  closeAndConfirm() {
    this.close();
    this.confirmClose();
    return cy.get('@currentPage');
  }

}
