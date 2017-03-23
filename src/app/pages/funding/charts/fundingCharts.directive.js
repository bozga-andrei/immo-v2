/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
      .directive('fundingCharts', fundingCharts);

  /** @ngInject */
  function fundingCharts() {
    return {
      restrict: 'E',
      controller: 'FundingChartsCtrl',
      controllerAs: 'funChartsCtrl',
      templateUrl: 'app/pages/funding/charts/fundingCharts.html'
    };
  }
})();
