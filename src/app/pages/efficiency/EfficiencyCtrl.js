/**
 * @author a.bozga
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.efficiency')
      .controller('EfficiencyCtrl', EfficiencyCtrl);

  /** @ngInject */
  function EfficiencyCtrl($scope, $timeout, $log, Acquisition, Funding, Efficiency) {

    //Immo
    $scope.immo = Acquisition.getImmo();

    //Funding
    $scope.fin = Funding.getFunding();

    $scope.efficiency = {};
    $scope.efficiency.prepaidExpenses = 0;


    $scope.taxLoanAmountDataSource = {};


    // Watch when investment object is changing
    $scope.$watchCollection('efficiency',
      function (newVal, oldVal) {
        $log.debug("efficiency.monthlyRent is set to : [" + $scope.efficiency.monthlyRent + "]");
        if (newVal.monthlyRent >= 0) {
          var monthlyRent = newVal.monthlyRent * 12;
          $scope.efficiency.profitabilityNet = getNetEfficiency(monthlyRent);
        }
      },
      true
    );

    //Watch when monthlyRent is changing and update the surface maintenance
    $scope.$watch(
      function () {
        return $scope.efficiency.monthlyRent;
      },
      function (newVal, oldVal) {
        if (newVal) {
          $scope.efficiency.maintenance = (newVal * 0.04); // 4%/year of the monthly rate
        }
      },
      true
    );

    //Watch when immo.area is changing and update the efficiency.insurance
    $scope.$watch(
      function () {
        return $scope.immo.area;
      },
      function (newVal, oldVal) {
        if (newVal) {
          $scope.efficiency.insurance = (newVal * 1.5);//TODO correction with the appropriate value
          Acquisition.saveImmo($scope.immo)
        }
      },
      true
    );


    function getNetEfficiency(rent) {
      var costs = $scope.efficiency.maintenance - $scope.fin.totalLoanInsurance - $scope.efficiency.insurance;

      return ((((rent - costs) + ($scope.efficiency.prepaidExpenses * 12)) / $scope.immo.total) * 100);

    }

  }
})();
