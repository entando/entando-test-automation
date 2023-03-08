import AppPage from './app/AppPage';

import Dashboard from './dashboard/Dashboard.js';

export default class HomePage extends AppPage {

  constructor() {
    super(Dashboard);
  }

  static openPage() {
    cy.validateUrlPathname('/dashboard');
  }

}
