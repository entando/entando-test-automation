import AppPage from "./app/AppPage.js";

import Dashboard from "./dashboard/Dashboard.js";

export default class HomePage extends AppPage {

  constructor() {
    super(Dashboard);
    this.closeAppTour();
  }

}