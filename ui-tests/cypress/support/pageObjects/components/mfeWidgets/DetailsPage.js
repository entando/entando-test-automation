import AppContent from '../../app/AppContent';

export default class DetailsPage extends AppContent {
  static openPage(button, code) {
    super.loadPage(button, `/widget/detail/${code}`)
  }
}
