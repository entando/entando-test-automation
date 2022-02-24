import Content from '../../app/Content.js';
import { htmlElements } from '../../WebElement';


export default class EmailConfigurationPage extends Content {


    emailConfigurationTabList = `${htmlElements.ul}[role=tablist]`;
    formGroup= `${htmlElements.div}.form-group`;
    toolButton = `${htmlElements.div}.btn-toolbar.pull-right`;
    switch = `${htmlElements.div}.SwitchRenderer`;
    switchContainer = `${htmlElements.div}[class="bootstrap-switch-container"]`;

    getSenderManagementTab(){
        return this.getContents()
                    .find(this.emailConfigurationTabList)
                    .children()
                    .eq(0);
    }
    getSmtpServerTab(){
        return this.getContents()
                    .find(this.emailConfigurationTabList)
                    .children()
                    .eq(1);
    }

    //SMTP functions
    getSwitch(){
        return this.getContents()
                    .find(this.switch);
    }

    getActiveSwitch(){
        return this.getSwitch().eq(0)
                    .find(this.switchContainer);
    }

    getDebugSwitch(){
        return this.getSwitch().eq(1)
                    .find(this.switchContainer);
    }

    getCheckServerIdSwitch(){
        return this.getSwitch().eq(2)
                    .find(this.switchContainer);
    }

    getForm(){
        return this.getContents().find(this.formGroup);
    }

    getHostInput(){
        return this.getForm().find(`${htmlElements.input}[name="host"]`);
    }

    getPortInput(){
        return this.getForm()
                    .find(`${htmlElements.input}[name="port"]`);
    }
    getSecurityRender(){
        return this.getForm().eq(4)
                .find(`${htmlElements.div}.btn-group`)
                .children(htmlElements.label).eq(0);
    }
    getTimeOutInput(){
        return this.getForm()
                    .find(`${htmlElements.input}[name="timeout"]`);
    }

    getUserNameInput(){
        return this.getForm()
                    .find(`${htmlElements.input}[name="username"]`);
    }
    getPassWordInput(){
        return this.getForm()
                    .find(`${htmlElements.input}[name="password"]`);
    }
    searchFieldError(){
        return this.getForm()
                    .find(`${htmlElements.span}.help-block`);
    }

    getToolButton(){
        return this.getContents()
                    .find(this.toolButton);
    }

    submit(){
        return this.getToolButton()
                    .find(`${htmlElements.button}[type=submit]`);
    }


}
