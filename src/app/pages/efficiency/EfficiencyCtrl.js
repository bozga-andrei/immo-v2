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
      effCtrl.efficiency.maintenance = 0;
      effCtrl.efficiency.prepaidExpenses = 0;
      effCtrl.efficiency.diversInsurances = 0;
      effCtrl.efficiency.userAge = 30;
      effCtrl.efficiency.annualLoanInsurance = 0;

      effCtrl.efficiency.totalAnnualIncoming = 0;
    }


    if(effCtrl.immo.total){
      effCtrl.efficiency.investAmount = effCtrl.immo.total;
    }

    //If we know the living area we can calculate the approximate insurance
    if(effCtrl.immo.area){
      effCtrl.efficiency.diversInsurances = (newVal * 1.5);//TODO correction with the appropriate value
    }

    //Get annualLoanInsurance from funding page if defined
    if(effCtrl.fin.annualLoanInsurance && effCtrl.fin.annualLoanInsurance > 0){
      effCtrl.efficiency.annualLoanInsurance = effCtrl.fin.annualLoanInsurance;
    }

    // if monthly rent is already defined we can calculate the efficiency
    if(effCtrl.efficiency.monthlyRent && effCtrl.efficiency.investAmount && effCtrl.efficiency.investAmount > 0){
      var annualRent = newEff.monthlyRent * 12;
      var annualPrepaidExpenses = (effCtrl.efficiency.prepaidExpenses||0) * 12;

      calculateEfficiency(annualRent, annualPrepaidExpenses);

      Efficiency.saveEfficiency(effCtrl.efficiency);
    }

    // Watch when investment object is changing
    $scope.$watchCollection('effCtrl.efficiency',
      function (newEff, oldEff) {
        if(!newEff || angular.equals(newEff, oldEff)){
          return; // simply skip that
        }

        if (newEff.monthlyRent >= 0) {
          var annualRent = newEff.monthlyRent * 12;
          var annualPrepaidExpenses = (effCtrl.efficiency.prepaidExpenses||0) * 12;

          calculateEfficiency(annualRent, annualPrepaidExpenses);

        }
        Efficiency.saveEfficiency(effCtrl.efficiency);
      },
      true
    );

    //Watch when efficiency.monthlyRent is changing and update the efficiency.maintenance
    $scope.$watch(
      function () {
        return effCtrl.efficiency.monthlyRent;
      },
      function (newVal, oldVal) {
        if (newVal) {
          var annualRent = newVal * 12;

          //Calculate maintenance
          effCtrl.efficiency.maintenance = (annualRent * 0.04); // 4%/year of the monthly rate
          Efficiency.saveEfficiency(effCtrl.efficiency);
        }
      },
      true
    );


    function calculateEfficiency(annualRent, annualPrepaidExpenses) {
      //Calculate total annual incoming
      effCtrl.efficiency.totalAnnualIncoming = annualRent + annualPrepaidExpenses;

      //Calculate profitabilityNet
      effCtrl.efficiency.profitabilityNet = getNetEfficiency(annualRent, (effCtrl.efficiency.maintenance||0), (effCtrl.fin.monthlyLoanInsurance || 0), (effCtrl.efficiency.diversInsurances || 0), annualPrepaidExpenses, (effCtrl.efficiency.investAmount || 0));
    }

    function getNetEfficiency(annualRent, maintenance, monthlyLoanInsurance, diversInsurances, annualPrepaidExpenses, investAmount) {
      var costs = maintenance + monthlyLoanInsurance + diversInsurances;
      return Number(((((annualRent - costs) + annualPrepaidExpenses) / investAmount) * 100).toFixed(2));
    }

  }
})();
