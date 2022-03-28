import {htmlElements} from '../../../WebElement';

import Content from '../../../app/Content';

import AdminPage from '../../../app/AdminPage';

import EditPage from '../EditPage';

export default class NestedAttributePage extends Content {

  getContinueButton() {
    return this.getContents()
               .children(htmlElements.div).eq(2)
               .children(htmlElements.div)
               .children(htmlElements.div)
               .children(htmlElements.form)
               .children(htmlElements.div).eq(1)
               .find(htmlElements.button);
  }

  continue() {
    this.getContinueButton().click();
    cy.wait(1000); //TODO find a better way to identify when the page loaded
    return new AdminPage(EditPage);
  }

}
