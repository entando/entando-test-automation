import {DATA_TESTID, htmlElements, WebElement} from '../WebElement.js';

export default class AppTour extends WebElement {

  tourFrame           = `${htmlElements.div}#___reactour`;
  tourContainer       = `${htmlElements.div}.TourStart[${DATA_TESTID}=app-tour_AppTour_div]`;
  #footer             = `${htmlElements.div}.TourStart__footer[${DATA_TESTID}=app-tour_AppTour_div]`;
  closeButton         = `${htmlElements.button}.TourStart__cancel-button[${DATA_TESTID}=app-tour_AppTour_Button]`;
  startButton         = `${htmlElements.button}.TourStart__start-button[${DATA_TESTID}=app-tour_AppTour_Button]`;
  cancelCloseButton   = `${htmlElements.button}.TourStart__no-button[${DATA_TESTID}=app-tour_AppTour_Button]`;
  cancelConfirmButton = `${htmlElements.button}.TourStart__yes-button[${DATA_TESTID}=app-tour_AppTour_Button]`;

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
    cy.wait(1000);
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
