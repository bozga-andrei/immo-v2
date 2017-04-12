/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
      .directive('totalRepayAmountPieChart', totalRepayAmountPieChart);

  /** @ngInject */
  function totalRepayAmountPieChart() {
    return {
      restrict: 'E',
      controller: 'TotalRepayAmountPieChartCtrl',
      controllerAs: 'totalRepayAmountPieChartCtrl',
      templateUrl: 'app/pages/funding/charts/totalRepayAmount/totalRepayAmountPieChart.html'
    };
  }
})();
