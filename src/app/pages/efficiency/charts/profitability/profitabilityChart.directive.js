/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('Immo.pages.efficiency')
      .directive('profitabilityChart', profitabilityChart);

  /** @ngInject */
  function profitabilityChart() {
    return {
      restrict: 'E',
      controller: 'ProfitabilityChartCtrl',
      controllerAs: 'profChartCtrl',
      templateUrl: 'app/pages/efficiency/charts/profitability/profitabilityChart.html'
    };
  }
})();
