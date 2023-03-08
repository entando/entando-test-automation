import AddPage        from './AddPage';
import AppPage        from '../../app/AppPage';
import AppContent     from '../../app/AppContent';
import TemplatesPage  from './TemplatesPage';
import {htmlElements} from '../../WebElement';

export default class DetailsPage extends AppContent {

  detailsTable            = `${htmlElements.table}.PageTemplateDetailTable`;
  referencedPagesTableDiv = `${htmlElements.div}.PageTemplatePageReferencesTable`;
  editButton              = `${htmlElements.button}.PageTemplateDetailPage__edit-btn`;

  static openPage(button, code) {
    super.loadPage(button, `/page-template/view/${code}`);
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
    this.getBreadCrumb().children(htmlElements.li).eq(1).then(element => TemplatesPage.openPage(element, false));
    return cy.wrap(new AppPage(TemplatesPage));
  }

  openEditTemplate(code) {
    this.getEditButton().then(button => AddPage.openPage(button, code, 'edit'));
    return cy.wrap(new AppPage(AddPage));
  }

}
