import {generateRandomId, generateRandomNumericId} from '../../support/utils';
import {htmlElements}                              from '../../support/pageObjects/WebElement';

describe('Entando Hub', () => {

  const entandoHub = {name: 'Entando Hub', url: 'https://entando.com/entando-hub-api/appbuilder/api'};

  beforeEach(() => {
    cy.wrap(null).as('registryToBeDeleted');
    cy.wrap([]).as('bundlesToBeUndeployed');
    cy.wrap([]).as('bundlesToBeUninstalled');
    cy.wrap([]).as('pagesToBeDeleted');
    cy.kcClientCredentialsLogin();
    cy.kcAuthorizationCodeLoginAndOpenDashboard('login/admin');
  });

  afterEach(() => {
    cy.kcClientCredentialsLogin();
    cy.get('@pagesToBeDeleted').then(pages => {
      if (pages) pages.forEach(page => cy.pagesController().then(controller => controller.setPageStatus(page.code, 'draft')
                                                                      .then(() => controller.deletePage(page.code))));
    });
    cy.get('@bundlesToBeUninstalled').then(bundles => {
      if (bundles) bundles.forEach(bundleId => cy.repositoriesController().then(controller => controller.uninstallBundle(bundleId)));
    })
    cy.get('@bundlesToBeUndeployed').then(bundles => {
      if (bundles) bundles.forEach(bundleId => cy.repositoriesController().then(controller => controller.undeployBundle(bundleId)));
    });
    cy.get('@registryToBeDeleted').then(registryId => {
      if (registryId) cy.repositoriesController().then(controller => controller.deleteRegistry(registryId));
    });
    cy.kcTokenLogout();
  });

  it([Tag.FEATURE, Tag.BUNDLE, 'ENG-4710'], 'Installation of a simple configurable MFE', () => {
    createPage().then(demoPage => {
      cy.fixture('data/simpleConfigurableMFE.json').then(component => {
        addAndAccessEntandoHubRegistry()
            .then(page => {
              page.getContent().getSearchForm().click();
              page.getContent().getSearchForm().find(htmlElements.li).should('contain', component.bundleGroup[0].name);
              page.getContent().clickBundleGroup(component.bundleGroup[0].name);
              deployAndInstallBundle(component.bundleName);
              page.getContent().getBundle(component.bundleName).parent().find(`${htmlElements.span}.ComponentList__version`).should('contain', 'INSTALLED');
              page.getContent().getKebabMenu().open().openRegistry('Local Hub');
            })
            .then(page => {
              page.getContent().getBundle(component.bundleName).parent().find(`${htmlElements.span}.ComponentList__version`).should('contain', 'INSTALLED');
              page.getMenu().getComponents().open().openMFEAndWidgets();
            })
            .then(page => {
              page.getContent().getListArea().should('contain', component.componentCode);
              page.getContent().openEditFromKebabMenu(component.componentCode);
            })
            .then(page => {
              page.getContent().getCustomUiInput().invoke('val').then(value => expect(value.replaceAll('\n', '').replaceAll(' ', '')).to.equal(component.customUi.replaceAll(' ', '')));
              page.getContent().clickConfigTabConfigUi();
              page.getContent().getConfigUiValue().should(value => expect(value.replaceAll('\n', '').replaceAll(' ', '')).to.equal(component.configUi.replaceAll(' ', '')));
              page.getMenu().getPages().open().openDesigner();
            })
            .then(page => page.getContent().clickSidebarTab(1))
            .then(page => page.getContent().designPageFromSidebarPageTreeTable(demoPage.code))
            .then(page => page.getContent().clickSidebarTab(0))
            .then(page => {
              page.getContent().getSidebarWidgetSection(5).click();
              page.getContent().getSidebarWidgets().contains(component.name).should('exist');
              page.getContent().dragConfigurableWidgetToGrid(demoPage.code, 5, 0, 1, 0, component.componentCode);
            })
            .then(page => {
              page.getContent().getUserWidgetConfigurations(`${component.componentName}-config`).find(`${htmlElements.input}#name`).should('exist').and('be.empty');
              page.getContent().getUserWidgetConfigurations(`${component.componentName}-config`).find(`${htmlElements.input}#name`).type(component.testInput);
              page.getContent().confirmConfig(demoPage.code);
            })
            .then(page => {
              cy.wrap(4).as('widgetToBeRemovedFromPage');
              page.getContent().getDesignerGridFrame(1, 0).children(htmlElements.div).children()
                  .should(contents => expect(contents).to.have.prop('tagName').to.equal('DIV'))
                  .then(contents => {
                    cy.wrap(contents).children()
                      .should('have.length', 3)
                      .should(content => expect(content.eq(2)).to.have.text(component.name));
                  });
              cy.then(() => page);
            })
            .then(page => {
              page.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--draft')
                  .and('have.attr', 'title').should('eq', 'Published, with pending changes');
              page.getContent().publishPageDesign(demoPage.code);
            })
            .then(page => {
              cy.validateToast(page);
              page.getContent().getPageStatusIcon()
                  .should('have.class', 'PageStatusIcon--published')
                  .and('have.attr', 'title').should('eq', 'Published');
            })
            .then(() => {
              cy.visit(`/${demoPage.code}.page`, {portalUI: true});
              cy.get(`${component.componentName}`).should('contain', component.testInput);
            })
      });
    });
  });

  it([Tag.FEATURE, Tag.BUNDLE, 'ENG-4710'], 'Uninstall and undeploy MFE bundle', () => {
    cy.fixture('data/simpleConfigurableMFE.json').then(component => {
      cy.repositoriesController().then(controller => {
        controller.deployBundle(component).then(res => cy.pushAlias('@bundlesToBeUndeployed', res.body.payload.code));
        controller.installBundle(component).then(componentId => cy.pushAlias('@bundlesToBeUninstalled', componentId));
      });
      openRepositoryPage()
          .then(page => {
            page.getContent().getBundle(component.bundleName).parent().find(`${htmlElements.span}.ComponentList__version`).should('contain', 'INSTALLED');
            page.getContent().clickBundle(component.bundleName);
          })
          .then(page => {
            cy.repositoriesController().then(controller => controller.intercept({}, `bundle'${component.bundleName}'Uninstallation`, `/components/${component.installCode}/uninstall`));
            page.getDialog().clickUninstallButton();
            page.getDialog().confirmUninstall();
            waitForUninstallationCompletion(component.bundleName);
            page.getDialog().getDeployButton().should('exist').and('be.visible').and('contain', 'Undeploy');
            page.getDialog().undeployBundle();
          })
          .then(page => {
            page.getContent().getBundle(component.bundleName).should('not.exist');
            cy.deleteAlias('@bundlesToBeUndeployed', component.installCode);
          });
    });
  });

  const createPage = (code = null, published = true) => {
    return cy.fixture('data/demoPage.json').then(page => {
      if (code) {
        page.code = code;
        page.titles.en = code;
      } else page.code = generateRandomId();
      page.pageModel = '1-2-column';
      cy.seoPagesController().then(controller => controller.addNewPage(page));
      cy.pushAlias('@pagesToBeDeleted', page);
      if (published) cy.pagesController().then(controller => controller.setPageStatus(page.code, 'published'));
      return cy.wrap(page);
    });
  }

  const waitForInstallationCompletion = (bundleName) => {
    cy.wait(`@bundle'${bundleName}'Installation`, {timeout: 10000}).then(res => {
      cy.wrap(res.response.body.payload).then(payload => {
        if (payload.status === 'INSTALL_COMPLETED') {
          cy.pushAlias('@bundlesToBeUninstalled', payload.componentId);
          cy.waitForStableDOM();
          return cy.get('@currentPage');
        }
        else return waitForInstallationCompletion(bundleName);
      });
    });
  }

  const waitForUninstallationCompletion = (bundleName) => {
    cy.wait(`@bundle'${bundleName}'Uninstallation`, {timeout: 10000}).then(res => {
      cy.wrap(res.response.body.payload).then(payload => {
        if (payload.status === 'UNINSTALL_COMPLETED') {
          cy.deleteAlias('@bundlesToBeUninstalled', payload.componentId);
          cy.waitForStableDOM();
          return cy.get('@currentPage');
        }
        else return waitForUninstallationCompletion(bundleName);
      });
    });
  }

  const openRepositoryPage = () => {
    return cy.get('@currentPage')
             .then(page => page.getMenu().getRepository().openRepository());
  };

  const addAndAccessEntandoHubRegistry = () => {
    return openRepositoryPage()
            .then(page => {
              cy.repositoriesController().then(controller => controller.intercept({method: 'POST'}, 'repositoryAddedPOST', '/registries'));
              page.getContent().getKebabMenu().open().clickAddNewRegistry();
              page.getDialog().getBody().getNameInput().then(input => page.getContent().type(input, entandoHub.name));
              page.getDialog().getBody().getUrlInput().then(input => page.getContent().type(input, entandoHub.url));
              page.getDialog().confirm();
              cy.wait('@repositoryAddedPOST').then(res => cy.wrap(res.response.body.payload.id).as('registryToBeDeleted'));
              page.getContent().getKebabMenu().open().openRegistry(entandoHub.name);
            })
  };

  const deployAndInstallBundle = (bundleName) => {
   return cy.get('@currentPage')
            .then(page => page.getContent().clickBundle(bundleName))
            .then(page => {
              cy.repositoriesController().then(controller => controller.intercept({method: 'POST'}, `bundle${bundleName}DeployedPOST`, '/components'));
              page.getDialog().deployBundle();
              cy.wait(`@bundle${bundleName}DeployedPOST`).then(res => {
                cy.pushAlias('@bundlesToBeUndeployed', res.response.body.payload.code);
                cy.repositoriesController().then(controller => controller.intercept({}, `bundle'${bundleName}'Installation`, `/components/${res.response.body.payload.code}/installplans`));
              });
              cy.validateToast(page, 'Deployed');
              cy.waitForStableDOM();
              page.getDialog().getDeployButton().should('exist').and('be.visible').and('contain', 'Undeploy');
              page.getDialog().getRefreshButton().should('exist').and('be.visible');
              page.getDialog().getInstallButton().should('exist').and('be.visible');
              page.getDialog().installBundle();
              const randomLabel = generateRandomNumericId();
              cy.time(randomLabel);
              waitForInstallationCompletion(bundleName);
              cy.timeEnd(randomLabel).then(entry => {
                cy.log(`Installed in ${entry.duration} ms`);
                cy.addToReport(() => ({
                  title: `Time for bundle ${bundleName} installation`,
                  value: `${entry.duration} ms`
                }))
              });
              page.getDialog().getRefreshButton().should('exist').and('be.visible');
              page.getDialog().getInstallButton().should('exist').and('be.visible').and('contain', 'Update');
              page.getDialog().getUninstallButton().should('exist').and('be.visible');
              page.getDialog().close();
              cy.waitForStableDOM();
            });
  }

});
