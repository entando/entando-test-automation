import Content from '../../app/Content';
import { htmlElements } from '../../WebElement';

export default class AddSenderPage extends Content {

  getSenderForm(){
        return this.get()
                    .find(`${htmlElements.form}.form-horizontal`);
    }

    getCodeInput(){
        return this.getSenderForm()
                    .find(`${htmlElements.div}.form-group`).eq(0)
                    .find(`${htmlElements.input}[name="code"]`);
    }

    getEmailInput(){
        return this.getSenderForm()
                    .find(`${htmlElements.div}.form-group`).eq(1)
                    .find(`${htmlElements.input}[name="email"]`);                  
    }
    searchFieldError(){
        return this.getSenderForm()
                    .find(`${htmlElements.span}.help-block`);
    }
    senderSubmit(){
        return this.getSenderForm()
                   .children(`${htmlElements.button}[type="submit"]`);
    }


}