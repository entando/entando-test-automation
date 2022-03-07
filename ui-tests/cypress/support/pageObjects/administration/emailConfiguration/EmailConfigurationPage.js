import Content from '../../app/Content.js';
import { htmlElements } from '../../WebElement';
import DeleteDialog from '../../app/DeleteDialog';
import AppPage from '../../app/AppPage';
import AddSenderPage from './AddSenderPage';
import KebabMenu from '../../app/KebabMenu';


export default class EmailConfigurationPage extends Content {


    emailConfigurationTabList = `${htmlElements.ul}[role=tablist]`;
    formGroup= `${htmlElements.div}.form-group`;
    toolButton = `${htmlElements.div}.btn-toolbar.pull-right`;
    switch = `${htmlElements.div}.SwitchRenderer`;
    switchContainer = `${htmlElements.div}[class="bootstrap-switch-container"]`;
    senderAddButton = `${htmlElements.a}[type=button]`;

   
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

    getToolButton(){
        return this.getContents()
                    .find(this.toolButton);
    }

    submit(){
        return this.getToolButton()
                    .find(`${htmlElements.button}[type=submit]`);
    }
     //Sender Functions
    getSenderManagementTab(){
        return this.getContents()
                    .find(this.emailConfigurationTabList)
                    .children()
                    .eq(0);
    }
    
    openSender(){
        return this.getSenderManagementTab().click();
    }

    getSenderMngt(){
        return this.getContents()
                   .find(`${htmlElements.div}.EmailConfigSenderMgmt`);
    }

    getSenderTable(){
        return this.getSenderMngt()
                   .find(`${htmlElements.table}.table`);
    }

    getTabHeaders(){
        return this.getSenderTable()
                    .children(htmlElements.thead)
                    .children(htmlElements.tr);
    }

    getAddButton(){
        return this.getSenderMngt()
                    .find(this.senderAddButton);
    }
    openAddSender(){
         this.getAddButton().click();
         return new AppPage(AddSenderPage);

        
    }
    getKebabMenu(code) {
        return new SenderKebabMenu(this, code);
      }

}

class SenderKebabMenu extends KebabMenu {

    get() {
      return this.parent.getSenderTable(this.code)
        .find(htmlElements.div)
        .find(`${htmlElements.button}#sender-actions-${this.code}`)
        .parent(`${htmlElements.div}.dropdown-kebab-pf`);
    }
  
    getDropdown() {
      return this.get()
                .find(`${htmlElements.ul}[role="menu"]`);
    }
  
    getEdit() {
      return this.get()
                .find(`${htmlElements.li}.LinkMenuItem`);
    }
  
    getDelete() {
      return this.get()
                .find(`${htmlElements.li}[role="presentation"]`);

    }
  
    openEdit() {
      this.getEdit().click();
      return new AppPage(AddSenderPage);
    }
  
    clickDelete() {
      this.getDelete().click();
      this.parent.parent.getDialog().setBody(DeleteDialog);
    }
  
  }

