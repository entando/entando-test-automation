import {htmlElements} from '../WebElement';

import {DialogContent} from './Dialog';

export default class DeleteDialog extends DialogContent {

  getState() {
    return this.get()
               .children(htmlElements.div);
  }

  getStateTitle() {
    return this.get()
               .children(htmlElements.div)
               .children(htmlElements.h4);
  }

  getStateInfo() {
    return this.get()
               .children(htmlElements.div)
               .children(htmlElements.p);
  }

}
