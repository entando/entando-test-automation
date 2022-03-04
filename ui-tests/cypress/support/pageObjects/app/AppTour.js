import {htmlElements, WebElement} from '../WebElement.js';

export default class AppTour extends WebElement {

  tourFrame           = `${htmlElements.div}#___reactour`;
  tourContainer       = `${htmlElements.div}.TourStart`;
  #footer             = `${htmlElements.div}.TourStart__footer`;
  closeButton         = `${htmlElements.button}.TourStart__cancel-button`;
  startButton         = `${htmlElements.button}.TourStart__start-button`;
  cancelCloseButton   = `${htmlElements.button}.TourStart__no-button`;
  cancelConfirmButton = `${htmlElements.button}.TourStart__yes-button`;

  get() {
    return cy.get(this.tourFrame);
  }

  getTourContainer() {
    return this.get()
               .find(this.tourContainer);
  }

  getFooter() {
    return this.getTourContainer()
               .children(this.#footer);
  }

  getCloseButton() {
    return this.getFooter()
               .children(this.closeButton);
  }

  getStartButton() {
    return this.getFooter()
               .children(this.startButton);
  }

  getCancelCloseButton() {
    return this.getFooter()
               .children(this.cancelCloseButton);
  }

  getConfirmCloseButton() {
    return this.getFooter()
               .children(this.cancelConfirmButton);
  }

  close() {
    this.getCloseButton().click();
  }

  confirmClose() {
    this.getConfirmCloseButton().click();
  }

  closeAndConfirm() {
    this.close();
    this.confirmClose();
  }

}
