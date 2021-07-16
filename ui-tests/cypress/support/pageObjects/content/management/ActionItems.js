import {htmlElements, WebElement} from "../../WebElement.js";

export default class ActionItems extends WebElement {

  contentSaveButtonUl = `${htmlElements.ul}`;
  contentSaveButtonWrapper = `${htmlElements.div}.StickySave__row--top`;
  contentSaveButtonSaveAction = `${htmlElements.li}`;

  get(action = 0) {
    return this.parent.get()
    .children().find(this.contentSaveButtonWrapper).find(this.contentSaveButtonUl).eq(action)
      .find(this.contentSaveButtonSaveAction).eq(action);
  }

  click(action = 0) {
    this.get(action).click();
  }

}