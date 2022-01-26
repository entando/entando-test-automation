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
    return this.parent.get()
               .children(htmlElements.body)
               .children(this.tourFrame)
               .find(this.tourContainer);
  }

  getFooter() {
    return this.get()
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
    cy.wait(1000); // Wait until the page loads
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
