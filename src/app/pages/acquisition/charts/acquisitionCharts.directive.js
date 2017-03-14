/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.acquisition')
      .directive('acquisitionCharts', acquisitionCharts);

  /** @ngInject */
  function acquisitionCharts() {
    return {
      restrict: 'E',
      controller: 'AcquisitionChartsCtrl',
      controllerAs: 'acqChartsCtrl',
      templateUrl: 'app/pages/acquisition/charts/acquisitionCharts.html'
    };
  }
})();
