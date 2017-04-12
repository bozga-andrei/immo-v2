/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
      .directive('taxLoanAmountPieChart', taxLoanAmountPieChart);

  /** @ngInject */
  function taxLoanAmountPieChart() {
    return {
      restrict: 'E',
      controller: 'TaxLoanAmountPieChartCtrl',
      controllerAs: 'taxLoanAmountPieChartCtrl',
      templateUrl: 'app/pages/funding/charts/taxLoanAmount/taxLoanAmountPieChart.html'
    };
  }
})();
