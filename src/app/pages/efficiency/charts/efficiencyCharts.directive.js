/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('Immo.pages.efficiency')
      .directive('efficiencyCharts', efficiencyCharts);

  /** @ngInject */
  function efficiencyCharts() {
    return {
      restrict: 'E',
      controller: 'EfficiencyChartsCtrl',
      controllerAs: 'effChartsCtrl',
      templateUrl: 'app/pages/efficiency/charts/efficiencyCharts.html'
    };
  }
})();
