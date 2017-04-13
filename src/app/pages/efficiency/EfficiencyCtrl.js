/**
 * @author a.bozga
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.efficiency')
      .controller('EfficiencyCtrl', EfficiencyCtrl);

  /** @ngInject */
  function EfficiencyCtrl($scope, $log, Acquisition, Funding, Efficiency) {

    var effCtrl = this;

    //Immo
    effCtrl.immo = Acquisition.getImmo();

    //Funding
    effCtrl.fin = Funding.getFunding();

    //Efficiency
    effCtrl.efficiency = Efficiency.getEfficiency();
    //If efficiency object it doesn't exists set some default values
    if(!effCtrl.efficiency){
      effCtrl.efficiency = {};
      effCtrl.immo.isElevator = false;
      effCtrl.efficiency.maintenance = 0;
      effCtrl.efficiency.prepaidExpenses = 0;
      effCtrl.efficiency.insurance = 0;
      effCtrl.efficiency.userAge = 30;
      effCtrl.efficiency.annualLoanInsurance = 0;

      effCtrl.efficiency.totalAnnualIncoming = 0;
    }


    if(effCtrl.immo.total){
      effCtrl.efficiency.investAmount = effCtrl.immo.total;
    }

    //Get annualLoanInsurance from funding page if defined
    if(effCtrl.fin.annualLoanInsurance && effCtrl.fin.annualLoanInsurance > 0){
      effCtrl.efficiency.annualLoanInsurance = effCtrl.fin.annualLoanInsurance;
    }


    // Watch when investment object is changing
    $scope.$watchCollection('effCtrl.efficiency',
      function (newEff, oldEff) {
        if(!newEff || angular.equals(newEff, oldEff)){
          return; // simply skip that
        }

        if (newEff.monthlyRent >= 0) {
          var annualRent = newEff.monthlyRent * 12;
          //Calculate total annual incoming
          effCtrl.efficiency.totalAnnualIncoming = annualRent + ((effCtrl.efficiency.prepaidExpenses||0) * 12);

          //Calculate profitabilityNet
          effCtrl.efficiency.profitabilityNet = getNetEfficiency(annualRent);

          //Calculate maintenance
          effCtrl.efficiency.maintenance = (annualRent * 0.04); // 4%/year of the monthly rate

        }
        Efficiency.saveEfficiency(effCtrl.efficiency);
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
      var costs = effCtrl.efficiency.maintenance + (effCtrl.fin.monthlyLoanInsurance || 0) + (effCtrl.efficiency.insurance || 0);
      return ((((rent - costs) + ((effCtrl.efficiency.prepaidExpenses || 0) * 12)) / effCtrl.efficiency.investAmount) * 100);
    }

  }
})();
