export default class Modal {
  constructor(modal) {
    this.modal = modal;
  }

  getModalContent() {
    return this.modal
      .children('.modal-content');
  }

  getModalBody() {
    return this.getModalContent()
      .children('.modal-body');
  }

  getModalHeader() {
    return this.getModalContent()
      .children('.modal-header');
  }

  getModalFooter() {
    return this.getModalContent()
      .children('.modal-footer');
  }

  clickActionByLabel(label) {
    return this.getModalFooter()
      .find('button').contains(label).click();
  }
}
