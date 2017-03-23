/**
 * @author a.bozga
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
      .controller('FundingCtrl', FundingCtrl);

  /** @ngInject */
  function FundingCtrl($scope, $uibModal, $log, Acquisition, Funding) {

    var funCtrl = this;

    var TVA = 1.21;

    //Immo
    funCtrl.immo = Acquisition.getImmo();


    //Funding
    funCtrl.fin = {};
    funCtrl.fin.interestRateYear = 2.0;
    funCtrl.fin.loanDurationOnYears = 20;
    funCtrl.fin.insuranceLoan = 0.36;
    funCtrl.fin.loanRegistrationTax = 0;
    funCtrl.fin.conservativeSalary = 0;
    funCtrl.fin.loanVariousFees = 300;
    funCtrl.fin.loanNotaryFees = 0;
    funCtrl.fin.monthlyPaymentsWithInsurance = 0;
    funCtrl.fin.totalLoanInterest = 0;
    funCtrl.fin.totalLoanInsurance = 0;
    funCtrl.fin.totalLoanIterest = 0;
    funCtrl.taxLoanAmountDataSource = {};

    //If is coming from Acquisition and immo.total is defined we can calculate the personal contribution, loan amount and tax on the loan amount
    if(funCtrl.immo.total){
      //Calculate personal Contribution
      if (funCtrl.immo.isPublicSale) {
        funCtrl.fin.personalContribution = Number((funCtrl.immo.registrationTaxPublicSale + funCtrl.immo.variousFees).toFixed(0));
      } else {
        funCtrl.fin.personalContribution = Number((funCtrl.immo.registrationTax + funCtrl.immo.notaryHonorTTC + funCtrl.immo.variousFees).toFixed(0));
      }
      if(!funCtrl.fin.personalContribution)
        funCtrl.fin.personalContribution = 0;
      //Set loan amount to 0 if personal contribution are greater that total price
      if(funCtrl.immo.total > funCtrl.fin.personalContribution){
        funCtrl.fin.loanAmount = funCtrl.immo.total - funCtrl.fin.personalContribution;
      } else {
        funCtrl.fin.loanAmount = 0;
      }

      if(funCtrl.fin.loanAmount > 0){
        funCtrl.fin.taxLoanAmount = getTaxLoanAmount(funCtrl.fin.loanAmount);
        funCtrl.fin.personalContribution = funCtrl.fin.personalContribution + funCtrl.fin.taxLoanAmount;
      }

      //Get monthly payments amount
      funCtrl.fin.monthlyPayments = getMonthlyRate(funCtrl.fin.loanAmount, funCtrl.fin.interestRateYear, funCtrl.fin.loanDurationOnYears);

      //Calculate the insurance
      funCtrl.fin.totalLoanInsurance = ((funCtrl.fin.insuranceLoan / 100) / 12 * funCtrl.fin.loanAmount);

      //Calculate insurance + payments monthly
      funCtrl.fin.monthlyPaymentsWithInsurance = funCtrl.fin.monthlyPayments + funCtrl.fin.totalLoanInsurance;

      //Calculate total interests + insurance
      funCtrl.fin.totalLoanInterestAndInsurance = funCtrl.fin.totalLoanInsurance + funCtrl.fin.totalLoanInterest;
      Funding.saveFunding(funCtrl.fin);
    }


    // Watch when fin object is changing
    $scope.$watchCollection('funCtrl.fin',
      function (newFin, oldFin) {
        if(!newFin || angular.equals(newFin, oldFin)){
          return; // simply skip that
        }

        if(funCtrl.fin.loanAmount >= 0){
          //Calculate the total fees for the Loan: (Registration fees, Notarial fees, and divers fees)
          funCtrl.fin.taxLoanAmount = getTaxLoanAmount(funCtrl.fin.loanAmount);

          //Get monthly payments amount
          funCtrl.fin.monthlyPayments = getMonthlyRate(funCtrl.fin.loanAmount, funCtrl.fin.interestRateYear, funCtrl.fin.loanDurationOnYears);

          //Calculate the insurance
          funCtrl.fin.totalLoanInsurance = ((funCtrl.fin.insuranceLoan / 100) / 12 * funCtrl.fin.loanAmount);

          //Calculate insurance + payments monthly
          funCtrl.fin.monthlyPaymentsWithInsurance = funCtrl.fin.monthlyPayments + funCtrl.fin.totalLoanInsurance;

          //Calculate total interests + insurance
          funCtrl.fin.totalLoanInterestAndInsurance = funCtrl.fin.totalLoanInsurance + funCtrl.fin.totalLoanInterest;
        }

        Funding.saveFunding(funCtrl.fin);
      },
      true
    );

    //Watch when personalContribution is changing and update the loanAmount
    $scope.$watch(
      function () {
        return funCtrl.fin.personalContribution;
      },
      function (newVal, oldVal) {
        if (newVal !== oldVal) {
          if (funCtrl.immo.total - newVal > 0) {
            funCtrl.fin.loanAmount = (funCtrl.immo.total - newVal);
          } else {
            funCtrl.fin.loanAmount = 0;
          }
        }
      },
      true
    );

    funCtrl.open = function (page, size) {
      $uibModal.open({
        animation: true,
        templateUrl: page,
        scope: $scope,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
    };


    funCtrl.rangeChangeCallback = function(sliderObj){
      var changedValue = sliderObj.from;
      funCtrl.fin.loanDurationOnYears = sliderObj.from;
    };


    function getTaxLoanAmount(loanAmount) {
      if(!loanAmount || loanAmount <= 0){
        return 0;
      }
      $log.debug("Calculate total tax for the loan amount");
      //Tax on loan amount is calculated on the loan amount + 10% accessories fees
      var loanAmountWithAccessoriesFess = loanAmount * 1.10;
      //Mortgage registration tax is fixed at 0.03% of loan amount with accessories fees
      funCtrl.fin.mortgageRegistration = loanAmountWithAccessoriesFess * 0.003;
      funCtrl.fin.conservativeSalary = getConservativeSalary(loanAmountWithAccessoriesFess);

      funCtrl.fin.loanRegistrationNotaryFees = getNotaryFeesForLoanTVAC(loanAmount);
      funCtrl.fin.loanRegistrationTax = getLoanRegistrationTax(loanAmountWithAccessoriesFess);

      var taxLoanAmount =  funCtrl.fin.loanVariousFees +
        funCtrl.fin.mortgageRegistration +
        funCtrl.fin.conservativeSalary +
        funCtrl.fin.loanRegistrationNotaryFees +
        funCtrl.fin.loanRegistrationTax;

      //DataSource for fusioncharts that will be available on the modal 'taxLoanAmountDetailsModal'
      funCtrl.taxLoanAmountDataSource = {
        chart: {
          caption: "Répartitions des frais",
          subCaption: ""
        },
        data: [
          {
            label: "Droits d'enregistrement",
            value: parseInt(funCtrl.fin.loanRegistrationTax)
          },
          {
            label: "Droits d'inscription hypothécaire",
            value: parseInt(funCtrl.fin.mortgageRegistration)
          },
          {
            label: "Salaire du Conservateur",
            value: parseInt(funCtrl.fin.conservativeSalary)
          },
          {
            label: "Honoraires du notaire",
            value: parseInt(funCtrl.fin.loanRegistrationNotaryFees)
          },
          {
            label: "Frais de dossier",
            value: parseInt(funCtrl.fin.loanVariousFees)
          }
        ]
      };

      $log.debug("Total tax for the loan is: " + taxLoanAmount);
      return Number((taxLoanAmount).toFixed(0));
    }

    function getMonthlyRate(loanAmount, interestRateYear, loanDurationOnYears) {
      $log.debug("Calculate monthly rate: loanAmount[" + loanAmount + "] interestRateYear[" + interestRateYear + "] loanDurationOnYears[" + loanDurationOnYears + "]");
      /*
       * m : mensualité
       * K : loanAmount
       * t : interestRateYear
       * n : nbrOfMonths
       *
       * m = [(K*t)/12] / [1-(1+(t/12))^-n]
       */

      var interest = interestRateYear / 100 / 12;
      var payments = loanDurationOnYears * 12;
      var x = Math.pow(1 + interest, payments);
      var monthly = (loanAmount * x * interest) / (x - 1);

      funCtrl.fin.totalLoanInterest = ((monthly * payments) - loanAmount);


      $log.debug("Return: " + monthly);
      return parseInt((monthly + 0.005) * 100) / 100;

    }


    /**
     * Loan registration tax representing 1% of the total loan amount with accessory of 10%
     * @param loanAmountWithAccessory
     * @returns {number}
     */
    function getLoanRegistrationTax(loanAmountWithAccessory) {

      return loanAmountWithAccessory * 0.01;
    }

    /**
     * Calculate the notary fees as defined by the law, based on the principal loan without accessory asked by the bank of 10%
     * @param loan : int => the principal loan
     * @returns {Number} notary fee TVAC
     */
    function getNotaryFeesForLoanTVAC(loan) {
      if(loan <= 0){
        return 0;
      }

      $log.debug("Get Notary fees TVAC for the amount of: " + loan);

      var notaryFees = Math.min(loan, 7500.00) * 1.425 / 100;

      if (loan > 7500.00) {
        notaryFees = notaryFees + (Math.min(loan, 17500.00) - 7500.00 ) * 1.14 / 100;
      }
      if (loan > 17500.00) {
        notaryFees = notaryFees + (Math.min(loan, 30000.00) - 17500.00 ) * 0.684 / 100;
      }
      if (loan > 30000.00) {
        notaryFees = notaryFees + (Math.min(loan, 45495.00) - 30000.00 ) * 0.57 / 100;
      }
      if (loan > 45495.00) {
        notaryFees = notaryFees + (Math.min(loan, 64095.00) - 45495.00 ) * 0.456 / 100;
      }
      if (loan > 64095.00) {
        notaryFees = notaryFees + (Math.min(loan, 250095.00) - 64095.00 ) * 0.228 / 100;
      }
      if (loan > 250095.00) {
        notaryFees = notaryFees + (loan - 250095.00 ) * 0.0456 / 100;
      }
      notaryFees = Math.max(notaryFees, 8.48);
      //Add TVA
      notaryFees = notaryFees * TVA;

      $log.debug("Return notary fees " + notaryFees);

      return parseInt(notaryFees);
    }


    /**
     * Get conservative's salary. Is the remuneration of the Conservative of mortgages
     * @param loanWithAccessory
     * @returns {Number}
     */
    function getConservativeSalary(loanWithAccessory) {
      var salary = 0;
      if (loanWithAccessory <= 25000.00) {
        salary = 58.55;
      } else {
        salary = (parseInt(((loanWithAccessory - 25000) / 25000) + 1) * 20.5) + 58.55;
      }
      return parseInt(salary);
    }
  }
})();
