import Content        from "../../app/Content";
import {htmlElements} from "../../WebElement";

export default class DetailsPage extends Content {

  detailsTable            = `${htmlElements.table}.PageTemplateDetailTable`;
  referencedPagesTableDiv = `${htmlElements.div}.PageTemplatePageReferencesTable`;
  editButton              = `${htmlElements.button}.PageTemplateDetailPage__edit-btn`;

  static openPage(button, code) {
    cy.pageTemplatesController().then(controller => controller.intercept({method: 'GET'}, 'templateDetailsGET', `/${code}/**`));
    if (button) cy.get(button).click();
    else cy.realType('{enter}');
    cy.wait('@templateDetailsGET');
  }

  getTemplateDetailsTable() {
    return this.getContents().find(this.detailsTable);
  }

  getPluginCode() {
    return this.getTemplateDetailsTable().find(htmlElements.td).eq(2);
  }

  getReferencedPagesDiv() {
    return this.getContents().find(this.referencedPagesTableDiv);
  }

  getEditButton() {
    return this.getContents().find(this.editButton);
  }

}
