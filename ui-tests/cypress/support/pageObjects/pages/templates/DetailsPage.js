import AddPage        from "./AddPage";
import AppPage        from "../../app/AppPage";
import Content        from "../../app/Content";
import TemplatesPage  from "./TemplatesPage";
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

  openTemplatesUsingBreadCrumb() {
    this.getBreadCrumb().children(htmlElements.li).eq(1).then(element => TemplatesPage.openPage(element));
    return cy.wrap(new AppPage(TemplatesPage));
  }

  openEditTemplate(code) {
    this.getEditButton().then(button => AddPage.openEditClonePage(button, code));
    return cy.wrap(new AppPage(AddPage));
  }

}
