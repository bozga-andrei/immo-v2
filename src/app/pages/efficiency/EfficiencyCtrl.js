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

    var effCtrl = this;

    //Immo
    effCtrl.immo = Acquisition.getImmo();

    //Funding
    effCtrl.fin = Funding.getFunding();

    effCtrl.efficiency = {};
    effCtrl.efficiency.monthlyRent;
    effCtrl.immo.isElevator = false;
    effCtrl.efficiency.maintenance = 0;
    effCtrl.efficiency.prepaidExpenses = 0;
    effCtrl.efficiency.insurance = 0;
    effCtrl.efficiency.annualLoanInsurance = 0;

    effCtrl.efficiency.totalIncoming = 0;


    if(effCtrl.immo.total){
      effCtrl.efficiency.investAmount = effCtrl.immo.total;
    }

    if(effCtrl.fin.totalLoanInsurance && effCtrl.fin.totalLoanInsurance > 0){
      effCtrl.efficiency.annualLoanInsurance = effCtrl.fin.totalLoanInsurance * 12;
    }


    // Watch when investment object is changing
    $scope.$watchCollection('effCtrl.efficiency',
      function (newEff, oldEff) {
        if(!newEff || angular.equals(newEff, oldEff)){
          return; // simply skip that
        }

        if (newEff.monthlyRent >= 0) {
          var monthlyRent = newEff.monthlyRent * 12;
          effCtrl.efficiency.totalIncoming = monthlyRent + (effCtrl.efficiency.prepaidExpenses * 12);
          effCtrl.efficiency.profitabilityNet = getNetEfficiency(monthlyRent);
        }
        Efficiency.saveEfficiency(effCtrl.efficiency);
      },
      true
    );

    //Watch when monthlyRent is changing and update the surface maintenance
    $scope.$watch(
      function () {
        return effCtrl.efficiency.monthlyRent;
      },
      function (newVal, oldVal) {
        if (newVal) {
          effCtrl.efficiency.maintenance = (newVal * 0.04); // 4%/year of the monthly rate
        }
      },
      true
    );

    //Watch when immo.area is changing and update the efficiency.insurance
    $scope.$watch(
      function () {
        return effCtrl.immo.area;
      },
      function (newVal, oldVal) {
        if (newVal) {
          effCtrl.efficiency.insurance = (newVal * 1.5);//TODO correction with the appropriate value
          Acquisition.saveImmo(effCtrl.immo)
        }
      },
      true
    );


    function getNetEfficiency(rent) {
      var costs = effCtrl.efficiency.maintenance + (effCtrl.fin.totalLoanInsurance || 0) + (effCtrl.efficiency.insurance || 0);

      return ((((rent - costs) + (effCtrl.efficiency.prepaidExpenses * 12)) / effCtrl.efficiency.investAmount) * 100);

    }

  }
})();
