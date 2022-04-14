import {htmlElements, WebElement} from '../WebElement';

export default class Pagination extends WebElement {
  panel = null;

  listPagination   = `${htmlElements.form}.table-view-pf-pagination`;
  textItemsCurrent = `${htmlElements.span}.pagination-pf-items-current`;
  textItemsTotal   = `${htmlElements.span}.pagination-pf-items-total`;
  ulPrev           = `${htmlElements.ul}.pagination-pf-back`;
  ulNext           = `${htmlElements.ul}.pagination-pf-forward`;
  buttonPrev       = `${htmlElements.a}[title="Previous page"]`;
  buttonNext       = `${htmlElements.a}[title="Next page"]`;
  buttonFirst      = `${htmlElements.a}[title="First page"]`;
  buttonLast       = `${htmlElements.a}[title="Last page"]`;
  input            = `${htmlElements.input}.pagination-pf-page`;
  dropdown         = `${htmlElements.button}#pagination-row-dropdown`;

  constructor(parent) {
    super(parent);
    this.panel = this.parent.getContents()
                     .find(this.listPagination);
  }

  get() {
    return this.panel;
  }

  getAreas() {
    return this.panel.children(`${htmlElements.div}.form-group`);
  }

  getLeftArea() {
    return this.getAreas().eq(0);
  }

  getRightArea() {
    return this.getAreas().eq(1);
  }

  getItemsCurrent() {
    return this.getRightArea()
               .find(this.textItemsCurrent);
  }

  getItemsTotal() {
    return this.getRightArea()
               .find(this.textItemsTotal);
  }

  getPreviousButtonsArea() {
    return this.getRightArea()
               .find(this.ulPrev);
  }

  getNextButtonsArea() {
    return this.getRightArea()
               .find(this.ulNext);
  }

  getPreviousButton() {
    return this.getPreviousButtonsArea()
               .find(this.buttonPrev);
  }

  getNextButton() {
    return this.getNextButtonsArea()
               .find(this.buttonNext);
  }

  getFirstPageButton() {
    return this.getPreviousButtonsArea()
               .find(this.buttonFirst);
  }

  getLastPageButton() {
    return this.getNextButtonsArea()
               .find(this.buttonLast);
  }

  getInput() {
    return this.getRightArea()
               .find(this.input);
  }

  getDropdownButton() {
    return this.getLeftArea()
               .find(this.dropdown);
  }

}
