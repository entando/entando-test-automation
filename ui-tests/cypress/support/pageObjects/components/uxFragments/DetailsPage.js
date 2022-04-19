import {htmlElements} from '../../WebElement.js';
import AppContent from '../../app/AppContent.js';


export default class DetailsPage extends AppContent {

    detailFragmentTable = `${htmlElements.table}.table`;
    editBtn = `${htmlElements.button}[class="pull-right btn btn-primary"]`;
    referencedSection = `${htmlElements.div}[class="row"]`;

    static openPage(button) {
        cy.fragmentsController().then(controller => controller.intercept({method: 'GET'}, 'detailsFragmentPageLoadingGET'));
        cy.get(button).click();
    }

    getMain(){
        return this.get()
            .find(`.col-xs-12`)
    }
    getFragmentTable(){
        return this.getMain()
            .find(this.detailFragmentTable);
    }
    getEditBtn(){
        return this.getMain()
            .find(this.editBtn);
    }

    getReferencedUxFragments(){
        return this.getMain()
            .children(this.referencedSection)
            .eq(0);

    }
    getReferencedPageTemplates(){
        return this.getMain()
            .children(this.referencedSection)
            .eq(1);

    }
    getReferencedWidgetTypes(){
        return this.getMain()
            .children(this.referencedSection)
            .eq(2);

    }



}
