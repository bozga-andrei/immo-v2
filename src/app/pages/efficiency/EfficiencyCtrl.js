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
    if(!effCtrl.efficiency || !effCtrl.efficiency.investAmount){
      effCtrl.efficiency = {};
      effCtrl.efficiency.occupancyRate = 100;
      effCtrl.efficiency.maintenance = 0;
      effCtrl.efficiency.prepaidExpenses = 0;
      effCtrl.efficiency.diversInsurances = 0;
      effCtrl.efficiency.totalInterestAndInsurance = 0;
      effCtrl.efficiency.totalAnnualIncoming = 0;
      effCtrl.efficiency.propertyTax = 0;
      effCtrl.efficiency.monthlyRent = null;
    }


    if(effCtrl.immo.total > 0){
      effCtrl.efficiency.investAmount = effCtrl.immo.price;
      if(effCtrl.fin.totalAcquisitionFees > 0){
        effCtrl.efficiency.investAmount = effCtrl.immo.price + effCtrl.fin.totalAcquisitionFees;
      }
    }

    //If we know the living area we can calculate the approximate insurance
    if(effCtrl.immo.area){
      effCtrl.efficiency.diversInsurances = (effCtrl.immo.area * 1.5);//TODO correction with the appropriate value
    }

    //Calculate the annual loan interest + annual loan insurance
    if(effCtrl.fin.annualLoanInterest > 0 && effCtrl.fin.annualLoanInsurance > 0){
      effCtrl.efficiency.totalInterestAndInsurance = effCtrl.fin.annualLoanInterest + effCtrl.fin.annualLoanInsurance;
    }

    // if monthly rent is already defined we can calculate the efficiency
    if(effCtrl.efficiency.monthlyRent && effCtrl.efficiency.investAmount && effCtrl.efficiency.investAmount > 0){
      var annualRent = effCtrl.efficiency.monthlyRent * 12;
      var annualPrepaidExpenses = (effCtrl.efficiency.prepaidExpenses||0) * 12;

      calculateEfficiency(annualRent, annualPrepaidExpenses, effCtrl.efficiency.investAmount);

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

          calculateEfficiency(annualRent, annualPrepaidExpenses, effCtrl.efficiency.investAmount);

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


    function calculateEfficiency(annualRent, annualPrepaidExpenses, investAmount) {
      var incomingGross = annualRent + annualPrepaidExpenses;
      var incomingNet = (annualRent * (effCtrl.efficiency.occupancyRate / 100)) + annualPrepaidExpenses;
      effCtrl.efficiency.totalAnnualIncoming = incomingNet;

      //Costs:
      var costs = (effCtrl.efficiency.maintenance||0) + (effCtrl.efficiency.propertyTax||0)  + (effCtrl.efficiency.diversInsurances || 0) + (effCtrl.efficiency.totalInterestAndInsurance || 0);

      //Calculate profitabilityNet
      effCtrl.efficiency.profitabilityNet = getNetEfficiency(incomingNet, costs, investAmount);
      effCtrl.efficiency.profitabilityGross = getGrossEfficiency(incomingGross, investAmount);
    }

    function getNetEfficiency(incoming, costs, investAmount) {
      return Number(((incoming - costs) / investAmount) * 100).toFixed(2);
    }

    function getGrossEfficiency(incoming, investAmount) {
      return Number((incoming / investAmount) * 100).toFixed(2);
    }

  }
})();
