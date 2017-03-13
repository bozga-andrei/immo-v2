/**
 * @author a.bozga
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
      .controller('FundingCtrl', FundingCtrl);

  /** @ngInject */
  function FundingCtrl($scope, $timeout, $log, Acquisition, Funding) {


    var TVA = 1.21;

    //Immo
    $scope.immo = Acquisition.getImmo();


    //Funding
    $scope.fin = {};
    $scope.fin.interestRateYear = 2.0;
    $scope.fin.loanDurationOnYears = 20;
    $scope.fin.insuranceLoan = 0.36;
    $scope.fin.loanRegistrationTax = 0;
    $scope.fin.conservativeSalary = 0;
    $scope.fin.loanVariousFees = 300;
    $scope.fin.loanNotaryFees = 0;
    $scope.fin.monthlyPaymentsWithInsurance = 0;
    $scope.fin.totalLoanInterest = 0;
    $scope.fin.totalLoanInsurance = 0;
    $scope.fin.totalLoanIterest = 0;
    $scope.taxLoanAmountDataSource = {};

    if($scope.immo.total){
      //Calculate personal Contribution
      if ($scope.immo.isPublicSale) {
        $scope.fin.personalContribution = $scope.immo.registrationTaxPublicSale + $scope.immo.variousFees;
      } else {
        $scope.fin.personalContribution = $scope.immo.registrationTax + $scope.immo.notaryHonorTTC + $scope.immo.variousFees;
      }
      if(!$scope.fin.personalContribution)
        $scope.fin.personalContribution = 0;
      //Set loan amount to 0 if personal contribution are greater that total price
      if($scope.immo.total > $scope.fin.personalContribution){
        $scope.fin.loanAmount = $scope.immo.total - $scope.fin.personalContribution;
      } else {
        $scope.fin.loanAmount = 0;
      }

      if($scope.fin.loanAmount > 0){
        $scope.fin.taxLoanAmount = getTaxLoanAmount($scope.fin.loanAmount);
        $scope.fin.personalContribution = $scope.fin.personalContribution + $scope.fin.taxLoanAmount;
      }
      Funding.saveFunding($scope.fin);
    }


    // Watch when fin object is changing
    $scope.$watchCollection('fin',
      function (newVal, oldVal) {
        if(!newVal || angular.equals(newVal, oldVal)){
          return; // simply skip that
        }

        if($scope.fin.loanAmount > 0){
          //Calculate the total fees for the Loan: (Registration fees, Notarial fees, and divers fees)
          $scope.fin.taxLoanAmount = getTaxLoanAmount($scope.fin.loanAmount);

          //Get monthly payments amount
          $scope.fin.monthlyPayments = getMonthlyRate($scope.fin.loanAmount, $scope.fin.interestRateYear, $scope.fin.loanDurationOnYears);

          //Calculate the insurance
          $scope.fin.totalLoanInsurance = (($scope.fin.insuranceLoan / 100) / 12 * $scope.fin.loanAmount);

          //Calculate insurance + payments monthly
          $scope.fin.monthlyPaymentsWithInsurance = $scope.fin.monthlyPayments + $scope.fin.totalLoanInsurance;

          //Calculate total interests + insurance
          $scope.fin.totalLoanInterestAndInsurance = $scope.fin.totalLoanInsurance + $scope.fin.totalLoanInterest;
        }

        Funding.saveFunding($scope.fin);
      },
      true
    );

    //Watch when personalContribution is changing and update the loanAmount
    $scope.$watch(
      function () {
        return $scope.fin.personalContribution;
      },
      function (newVal, oldVal) {
        if (newVal != oldVal) {
          if ($scope.immo.total - newVal > 0) {
            $scope.fin.loanAmount = ($scope.immo.total - newVal);
          } else {
            $scope.fin.loanAmount = 0;
          }
        }
      },
      true
    );


    $scope.rangeChangeCallback = function(sliderObj){
      var changedValue = sliderObj.from;
      $scope.fin.loanDurationOnYears = sliderObj.from;
    };


    function getTaxLoanAmount(loanAmount) {
      $log.debug("Calculate total tax for the loan amount");
      //Tax on loan amount is calculated on the loan amount + 10% accessories fees
      var loanAmountWithAccessoriesFess = loanAmount * 1.10;
      //Mortgage registration tax is fixed at 0.03% of loan amount with accessories fees
      $scope.fin.mortgageRegistration = loanAmountWithAccessoriesFess * 0.003;
      $scope.fin.conservativeSalary = getConservativeSalary(loanAmountWithAccessoriesFess);

      $scope.fin.loanRegistrationNotaryFees = getNotaryFeesForLoanTVAC(loanAmount);
      $scope.fin.loanRegistrationTax = getLoanRegistrationTax(loanAmountWithAccessoriesFess);

      var taxLoanAmount =  $scope.fin.loanVariousFees +
        $scope.fin.mortgageRegistration +
        $scope.fin.conservativeSalary +
        $scope.fin.loanRegistrationNotaryFees +
        $scope.fin.loanRegistrationTax;

      //DataSource for fusioncharts that will be available on the modal 'taxLoanAmountDetailsModal'
      $scope.taxLoanAmountDataSource = {
        chart: {
          caption: "Répartitions des frais",
          subCaption: ""
        },
        data: [
          {
            label: "Droits d'enregistrement",
            value: parseInt($scope.fin.loanRegistrationTax)
          },
          {
            label: "Droits d'inscription hypothécaire",
            value: parseInt($scope.fin.mortgageRegistration)
          },
          {
            label: "Salaire du Conservateur",
            value: parseInt($scope.fin.conservativeSalary)
          },
          {
            label: "Honoraires du notaire",
            value: parseInt($scope.fin.loanRegistrationNotaryFees)
          },
          {
            label: "Frais de dossier",
            value: parseInt($scope.fin.loanVariousFees)
          }
        ]
      };

      $log.debug("Total tax for the loan is: " + taxLoanAmount);
      return taxLoanAmount;
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

      $scope.fin.totalLoanInterest = ((monthly * payments) - loanAmount);


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
      $scope.fin.loanNotaryFees = notaryFees;

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
