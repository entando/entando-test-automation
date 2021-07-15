import {TEST_ID_KEY, htmlElements, WebElement} from "../WebElement.js";

export default class AppTour extends WebElement {

  tourFrame = `${htmlElements.div}#___reactour`;
  tourContainer = `${htmlElements.div}.TourStart[${TEST_ID_KEY}=app-tour_AppTour_div]`;
  #footer = `${htmlElements.div}.TourStart__footer[${TEST_ID_KEY}=app-tour_AppTour_div]`;
  closeButton = `${htmlElements.button}.TourStart__cancel-button[${TEST_ID_KEY}=app-tour_AppTour_Button]`;
  startButton = `${htmlElements.button}.TourStart__start-button[${TEST_ID_KEY}=app-tour_AppTour_Button]`;
  cancelCloseButton = `${htmlElements.button}.TourStart__no-button[${TEST_ID_KEY}=app-tour_AppTour_Button]`;
  cancelConfirmButton = `${htmlElements.button}.TourStart__yes-button[${TEST_ID_KEY}=app-tour_AppTour_Button]`;

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
    //TODO find a better way to identify when the page loaded
    cy.wait(1000); // Wait until the page loads
    //TODO find a better way to identify when the dialog animation is completed
    cy.wait(2000); // Wait until the animation of the App Tour dialog is completed
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