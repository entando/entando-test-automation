import {htmlElements, WebElement} from '../WebElement.js';

import AppPage from './AppPage';

import Profile from './Profile';

export default class Navbar extends WebElement {

  get() {
    return this.parent.get().children(htmlElements.nav);
  }

  getHamburgerMenu() {
    return this.get()
               .children(htmlElements.div)
               .children(htmlElements.button);
  }

  getLogo() {
    return this.get()
               .children(htmlElements.div)
               .children(htmlElements.a);
  }

  getNavMenu() {
    return this.get()
               .children(htmlElements.nav)
               .children(htmlElements.ul);
  }

  getLanguage() {
    return this.getNavMenu()
               .children(htmlElements.li).eq(0);
  }

  getHome() {
    return this.getNavMenu()
               .children(htmlElements.li).eq(1);
  }

  getInfo() {
    return this.getNavMenu()
               .children(htmlElements.li).eq(2);
  }

  getUser() {
    return this.getNavMenu()
               .children(htmlElements.li).eq(3);
  }

  openLanguageMenu() {
    this.getLanguage().click();
  }

  clickHomeButton() {
    this.getHome().click();
  }

  openInfoMenu() {
    this.getInfo().click();
  }

  openUserMenu() {
    this.getUser().click();
    return new UserMenu(this);
  }

}

class UserMenu extends WebElement {

  get() {
    return this.parent.getUser()
               .children(htmlElements.ul);
  }

  getProfile() {
    return this.get()
               .children(htmlElements.li).eq(0);
  }

  getLogout() {
    return this.get()
               .children(htmlElements.li).eq(1);
  }

  openProfile() {
    this.getProfile().then(button => Profile.openPage(button));
    return cy.wrap(new AppPage(Profile)).as('currentPage');
  }

  logout() {
    this.getLogout().click();
  }

}
