import AppContent      from '../../app/AppContent';
import {htmlElements}  from '../../WebElement';
import KebabMenu               from '../../app/KebabMenu';
import {Dialog, DialogContent} from '../../app/Dialog';
import AppPage                 from '../../app/AppPage';

export default class RepositoryPage extends AppContent {

  componentList = `${htmlElements.div}.ComponentListPage__body`;
  registrySwitcher = `${htmlElements.div}.HubRegistrySwitcher__switcher-dropdown`;
  searchForm = `${htmlElements.form}.SearchForm__container`;
  bundle = `${htmlElements.div}.ComponentList__component`;

  static openPage(button) {
    super.loadPage(button, '/component-repository', false, true);
  }

  getComponentList() {
    return this.getContents().find(this.componentList);
  }

  getRegistrySwitcher() {
    return this.getComponentList().find(this.registrySwitcher);
  }

  getKebabMenu() {
    return new RepositoryKebabMenu(this);
  }

  getSearchForm() {
    return this.getComponentList().find(this.searchForm);
  }

  clickBundleGroup(bundleGroup) {
    this.getSearchForm().find(htmlElements.li).contains(bundleGroup).then(button => RepositoryPage.openPage(button));
    return cy.get('@currentPage');
  }

  getBundle(bundleName) {
    return this.getComponentList().find(this.bundle).contains(bundleName);
  }

  clickBundle(bundleName) {
    this.getBundle(bundleName).click();
    return cy.wrap(new AppPage(RepositoryPage, true)).as('currentPage');
  }

}

class RepositoryKebabMenu extends KebabMenu {
  constructor(parent) {
    super(parent);
  }

  get() {
    return this.parent.getRegistrySwitcher().children(`${htmlElements.div}.dropdown-kebab-pf`);
  }

  getAddNewRegistry() {
    return this.getRegistry('addNewRegistry');
  }

  getLocalHub() {
    return this.getRegistry('Local Hub');
  }

  getRegistry(registryName) {
    return this.get().find(`${htmlElements.a}[id="${registryName}"]`);
  }

  clickAddNewRegistry() {
    this.getAddNewRegistry().click();
    this.parent.parent.getDialog().setBody(AddRepositoryDialog);
    this.parent.parent.getDialog().getBody().setLoadOnConfirm(RepositoryPage);
    return cy.get('@currentPage');
  }

  openRegistry(registryName) {
    this.getRegistry(registryName).then(button => RepositoryPage.openPage(button));
    return cy.get('@currentPage');
  }
}

class AddRepositoryDialog extends DialogContent {

  getNameInput() {
    return this.get().find(`${htmlElements.input}#name`);
  }

  getUrlInput() {
    return this.get().find(`${htmlElements.input}#url`);
  }

}

export class BundleInstallationDialog extends Dialog {

  confirmUninstallButton = `${htmlElements.button}#ConfirmUninstallModal_button`;
  deployButton           = `${htmlElements.button}#InstallationPlanModal__button-ok`;
  installButtons         = `${htmlElements.div}.ComponentListInstallButtons ${htmlElements.button}.btn-primary`;
  refreshButton          = `${htmlElements.button}#InstallationPlanModal__refresh-versions`;
  uninstallButton        = `${htmlElements.button}.btn-success`;

  getDeployButton() {
    return this.getFooter().find(this.deployButton);
  }

  getInstallButton() {
    return this.getFooter().find(this.installButtons).eq(0);
  }

  getRefreshButton() {
    return this.getFooter().find(this.refreshButton);
  }

  getUninstallButton() {
    return this.getFooter().find(this.uninstallButton);
  }

  getConfirmUninstallButton() {
    return this.getFooter().find(this.confirmUninstallButton);
  }

  deployBundle() {
    this.getDeployButton().then(button => RepositoryPage.openPage(button));
    return cy.get('@currentPage');
  }

  undeployBundle() {
    return this.deployBundle();
  }

  installBundle() {
    this.getInstallButton().then(button => RepositoryPage.openPage(button));
    return cy.get('@currentPage');
  }

  clickUninstallButton() {
    this.getUninstallButton().click();
    return cy.get('@currentPage');
  }

  confirmUninstall() {
    this.getConfirmUninstallButton().then(button => RepositoryPage.openPage(button));
    return cy.get('@currentPage');
  }

}
