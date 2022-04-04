import {htmlElements} from '../WebElement.js';
import Content        from './Content';
import AdminPage      from './AdminPage';
import TemplatesPage  from '../pages/templates/TemplatesPage';

export default class DeleteAdminPage extends Content {

  form      = `${htmlElements.form}[id="delete"]`;
  closeButton = `${htmlElements.a}`;
  cancelButton      = `${htmlElements.button}[type="submit"]`;

  getForm(){
     return this.getContents()
                .children(this.form);
  }

  getCloseButton() {
        return   this.getForm()
                     .children(htmlElements.a);
  }

  getCancelButton(){
    return this.getForm()
               .find(`${htmlElements.button}[type="submit"]`);
  }

  submitCancel() {
   this.getCancelButton().click()
   return new AdminPage(TemplatesPage);

  }


}
