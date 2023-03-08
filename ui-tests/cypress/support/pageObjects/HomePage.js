import AppPage from './app/AppPage';

import Dashboard                 from './dashboard/Dashboard.js';
import {generateRandomNumericId} from '../utils';

export default class HomePage extends AppPage {

  constructor() {
    super(Dashboard);
  }

  static openPage() {
    const randomLabel = generateRandomNumericId();
    cy.time(randomLabel);
    cy.validateUrlPathname('/dashboard');
    cy.timeEnd(randomLabel).then(entry => {
      cy.log(`Dashboard loaded in ${entry.duration} ms`);
      cy.addToReport(() => ({
        title: `Dashboard loading time`,
        value: `${entry.duration} ms`
      }));
    });
  }

}
