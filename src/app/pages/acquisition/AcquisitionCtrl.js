/**
 * @author a.bozga
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.acquisition')
      .controller('AcquisitionCtrl', AcquisitionCtrl);

  /** @ngInject */
  function AcquisitionCtrl($scope, $timeout, $log, Acquisition) {

    var TVA = 1.21;
    var BXL_AND_WALLONIA_TAX_RATE = 0.125;
    var WALLONIA_AFTER_3_IMMO_TAX_RATE = 0.15;
    var FLANDERS_TAX_RATE = 0.10;
    var WALLONIA_REDUCED_TAX_RATE = 0.06;
    var FLANDERS_REDUCED_TAX_RATE = 0.05;

    //Immo
    $scope.immo = {};
    $scope.immo.price;
    $scope.immo.taxAllowanceRate = BXL_AND_WALLONIA_TAX_RATE;
    $scope.immo.taxAllowanceSum = 0;
    $scope.immo.renovationPrice;
    $scope.immo.variousFees = 1100;
    $scope.immo.isPublicSale = false;
    $scope.immo.total = 0;


    //Funding
    $scope.fin = {};
    $scope.fin.personalContribution = 20000;
    $scope.fin.loanAmount = 0;
    $scope.fin.taxLoanAmount = 0;
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

    $scope.invest = {};
    $scope.invest.prepaidExpenses = 0;


    $scope.taxLoanAmountDataSource = {};


    //Watch when taxAllowanceRate is changing and reset taxAllowanceSum to 0
    $scope.$watch(
      function () {
        return $scope.immo.taxAllowanceRate;
      },
      function (newVal, oldVal) {
        if (newVal) {
          //Reset taxAllowanceSum to 0 if taxAllowanceRate is changing
          $scope.immo.taxAllowanceSum = 0;
        }
      },
      true
    );

    // Watch when immo price is changing
    $scope.$watchCollection('immo',
      function (newVal, oldVal) {

        //Check if the selected taxAllowanceSum is 175000 and price under 500.000€
        if ($scope.immo.taxAllowanceSum == 175000 && newVal.price > 500000) {
          //Tax allowance is not accorded for a price higher than 500.000€
          $scope.immo.registrationTax = newVal.price * $scope.immo.taxAllowanceRate;
        } else {
          if (newVal.price > $scope.immo.taxAllowanceSum) {
            var reducedPrice = newVal.price - $scope.immo.taxAllowanceSum;
            //The reduced tax is relevant only for a price under 161.438€, after that sum the normal tax rate is applicable.
            if (($scope.immo.taxAllowanceRate == FLANDERS_REDUCED_TAX_RATE ||
              $scope.immo.taxAllowanceRate == WALLONIA_REDUCED_TAX_RATE) && newVal.price > 161438.00) {
              var regionTax = $scope.immo.taxAllowanceRate == WALLONIA_REDUCED_TAX_RATE ? 0.125 : 0.100;
              $scope.immo.registrationTax = (161438.00 * $scope.immo.taxAllowanceRate) + ((newVal.price - 161438.00) * regionTax);
            } else {
              $scope.immo.registrationTax = reducedPrice * $scope.immo.taxAllowanceRate;
            }
          } else {
            //If tax allowance is smaller than the 'price' set registration tax to 0
            $scope.immo.registrationTax = 0;
            if ($scope.immo.isPublicSale) {
              $scope.immo.registrationTaxPublicSale = 0;
            }
          }
        }

        //If is a public sale
        if ($scope.immo.isPublicSale) {
          $scope.immo.registrationTaxPublicSale = getPublicSaleAmountOfTax(newVal.price, $scope.immo.taxAllowanceRate);
          if ($scope.immo.taxAllowanceSum != 0) {
            if ($scope.immo.taxAllowanceSum == 175000 && newVal.price < 500000) {
              $scope.immo.registrationTaxPublicSale = $scope.immo.registrationTaxPublicSale - ($scope.immo.taxAllowanceSum * $scope.immo.taxAllowanceRate)
            } else if ($scope.immo.taxAllowanceSum != 175000) {
              $scope.immo.registrationTaxPublicSale = $scope.immo.registrationTaxPublicSale - ($scope.immo.taxAllowanceSum * $scope.immo.taxAllowanceRate)
            }
          }
        }


        $scope.immo.notaryHonorHTVA = getImmoNotaryHonorary(newVal.price);
        $scope.immo.notaryHonorTTC = parseInt($scope.immo.notaryHonorHTVA * TVA);

        $scope.immo.total = getTotalImmoAmount();
        //$log.debug("Immo.total is set to : [" + $scope.immo.total + "]");

        // === Update Invest section ===
        //Update immo insurance
        $scope.invest.insurance = ($scope.immo.area * 1.5);//TODO correction with the appropriate value

        /*//Update loanAmount
        if ($scope.immo.total > 0 && $scope.immo.total >= $scope.fin.personalContribution) {
          $scope.fin.loanAmount = ($scope.immo.total - $scope.fin.personalContribution);
        }

        //Calculate the total fees for the Loan: (Registration fees, Notarial fees, and divers fees)
        $scope.fin.taxLoanAmount = parseInt(getTaxLoanAmount());*/

        //Update Apport personnel
        if ($scope.immo.isPublicSale) {
          if ($scope.immo.registrationTaxPublicSale && $scope.fin.taxLoanAmount)
            $scope.fin.personalContribution = $scope.immo.registrationTaxPublicSale + $scope.fin.taxLoanAmount;
        } else {
          if ($scope.immo.registrationTax && $scope.immo.notaryHonorTTC && $scope.fin.taxLoanAmount)
            $scope.fin.personalContribution = $scope.immo.registrationTax + $scope.immo.notaryHonorTTC + $scope.fin.taxLoanAmount;
        }

        Acquisition.saveImmo($scope.immo);
      },
      true
    );

    //Watch when personalContribution is changing and update the loanAmount
    $scope.$watch(
      function () {
        return $scope.fin.personalContribution;
      },
      function (newVal, oldVal) {
        if (newVal) {
          if ($scope.immo.total - newVal > 0) {
            $scope.fin.loanAmount = ($scope.immo.total - newVal);
          } else {
            $scope.fin.loanAmount = 0;
          }
        }
      },
      true
    );

    // Watch when investment object is changing
    $scope.$watchCollection('invest',
      function (newVal, oldVal) {
        //$log.debug("invest.monthlyRent is set to : [" + $scope.invest.monthlyRent + "]");
        if (newVal.monthlyRent >= 0) {
          $scope.invest.profitabilityNet = (((((newVal.monthlyRent * 12) - $scope.invest.maintenance - $scope.fin.totalLoanInsurance - $scope.invest.insurance) + ($scope.invest.prepaidExpenses * 12)) / $scope.immo.total) * 100);
        }
      },
      true
    );

    //Watch when monthlyRent is changing and update the surface maintenance
    $scope.$watch(
      function () {
        return $scope.invest.monthlyRent;
      },
      function (newVal, oldVal) {
        if (newVal) {
          $scope.invest.maintenance = (newVal * 0.04); // 4%/year of the monthly rate
        }
      },
      true
    );

    //Watch when immo.area is changing and update the invest.insurance
    $scope.$watch(
      function () {
        return $scope.immo.area;
      },
      function (newVal, oldVal) {
        if (newVal) {
          $scope.invest.insurance = (newVal * 1.5);//TODO correction with the appropriate value
        }
      },
      true
    );


    function getTotalImmoAmount() {
      var total;
      if($scope.immo.renovationPrice){
        total = $scope.immo.price + $scope.immo.variousFees + $scope.immo.renovationPrice;
      } else {
        total = $scope.immo.price + $scope.immo.variousFees;
      }

      if ($scope.immo.isPublicSale) {
        total = total + $scope.immo.registrationTaxPublicSale;
      } else {
        total = total + $scope.immo.registrationTax + $scope.immo.notaryHonorTTC;
      }
      return total
    }


    function getMonthlyRate(loanAmount, interestRateYear, loanDurationOnYears) {
      //$log.debug("Calculate monthly rate: loanAmount[" + loanAmount + "] interestRateYear[" + interestRateYear + "] loanDurationOnYears[" + loanDurationOnYears + "]");
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


      //$log.debug("Return: " + monthly);
      return parseInt((monthly + 0.005) * 100) / 100;

    }

    /**
     * Calculate the barometric notarial honorary
     * @param immoPrice
     * @returns {number}
     */
    function getImmoNotaryHonorary(immoPrice) {

      var honorary;

      honorary = Math.min(immoPrice, 7500.00) * 4.56 / 100;

      if (immoPrice > 7500.00) {
        honorary = honorary + (Math.min(immoPrice, 17500.00) - 7500.00) * 2.85 / 100;
      }
      if (immoPrice > 17500.00) {
        honorary = honorary + (Math.min(immoPrice, 30000.00) - 17500.00) * 2.28 / 100;
      }
      if (immoPrice > 30000.00) {
        honorary = honorary + (Math.min(immoPrice, 45495.00) - 30000.00) * 1.71 / 100;
      }
      if (immoPrice > 45495.00) {
        honorary = honorary + (Math.min(immoPrice, 64095.00) - 45495.00) * 1.14 / 100;
      }
      if (immoPrice > 64095.00) {
        honorary = honorary + (Math.min(immoPrice, 250095.00) - 64095.00) * 0.57 / 100;
      }
      if (immoPrice > 250095.00) {
        honorary = honorary + (immoPrice - 250095.00) * 0.057 / 100;
      }

      honorary = Math.max(honorary, 8.48);

      return parseInt((honorary + 0.005) * 100) / 100;
    }

    /**
     * Calculate the amount of tax to be payed for a public sale
     * @param immoPrice the price of the good
     * @param taxAllowanceRate 0.125 => Brussels; 0.06 Brussels reduced tax
     * @returns {number} the amount of tax based on the price of the good
     */
    function getPublicSaleAmountOfTax(immoPrice, taxAllowanceRate) {
      var amountOfTax = 0;

      if (immoPrice <= 30000.00) {
        amountOfTax = immoPrice * (0.2750 + taxAllowanceRate);
      } else if (immoPrice > 30000.00 && immoPrice <= 40000.00) {
        amountOfTax = immoPrice * (0.1900 + taxAllowanceRate);
      } else if (immoPrice > 40000.00 && immoPrice <= 50000.00) {
        amountOfTax = immoPrice * (0.1550 + taxAllowanceRate);
      } else if (immoPrice > 50000.00 && immoPrice <= 60000.00) {
        amountOfTax = immoPrice * (0.1200 + taxAllowanceRate);
      } else if (immoPrice > 60000.00 && immoPrice <= 70000.00) {
        amountOfTax = immoPrice * (0.1100 + taxAllowanceRate);
      } else if (immoPrice > 70000.00 && immoPrice <= 80000.00) {
        amountOfTax = immoPrice * (0.1050 + taxAllowanceRate);
      } else if (immoPrice > 80000.00 && immoPrice <= 90000.00) {
        amountOfTax = immoPrice * (0.0950 + taxAllowanceRate);
      } else if (immoPrice > 90000.00 && immoPrice <= 100000.00) {
        amountOfTax = immoPrice * (0.0900 + taxAllowanceRate);
      } else if (immoPrice > 100000.00 && immoPrice <= 110000.00) {
        amountOfTax = immoPrice * (0.0850 + taxAllowanceRate);
      } else if (immoPrice > 110000.00 && immoPrice <= 125000.00) {
        amountOfTax = immoPrice * (0.0825 + taxAllowanceRate);
      } else if (immoPrice > 125000.00 && immoPrice <= 150000.00) {
        amountOfTax = immoPrice * (0.0750 + taxAllowanceRate);
      } else if (immoPrice > 150000.00 && immoPrice <= 175000.00) {
        amountOfTax = immoPrice * (0.0725 + taxAllowanceRate);
      } else if (immoPrice > 175000.00 && immoPrice <= 200000.00) {
        amountOfTax = immoPrice * (0.0675 + taxAllowanceRate);
      } else if (immoPrice > 200000.00 && immoPrice <= 225000.00) {
        amountOfTax = immoPrice * (0.0600 + taxAllowanceRate);
      } else if (immoPrice > 225000.00 && immoPrice <= 250000.00) {
        amountOfTax = immoPrice * (0.0550 + taxAllowanceRate);
      } else if (immoPrice > 250000.00 && immoPrice <= 275000.00) {
        amountOfTax = immoPrice * (0.0500 + taxAllowanceRate);
      } else if (immoPrice > 275000.00 && immoPrice <= 300000.00) {
        amountOfTax = immoPrice * (0.0475 + taxAllowanceRate);
      } else if (immoPrice > 300000.00 && immoPrice <= 325000.00) {
        amountOfTax = immoPrice * (0.0425 + taxAllowanceRate);
      } else if (immoPrice > 325000.00 && immoPrice <= 375000.00) {
        amountOfTax = immoPrice * (0.0400 + taxAllowanceRate);
      } else if (immoPrice > 375000.00 && immoPrice <= 400000.00) {
        amountOfTax = immoPrice * (0.0350 + taxAllowanceRate);
      } else if (immoPrice > 400000.00 && immoPrice <= 425000.00) {
        amountOfTax = immoPrice * (0.0325 + taxAllowanceRate);
      } else if (immoPrice > 425000.00 && immoPrice <= 500000.00) {
        amountOfTax = immoPrice * (0.0300 + taxAllowanceRate);
      } else if (immoPrice > 500000.00 && immoPrice <= 550000.00) {
        amountOfTax = immoPrice * (0.0275 + taxAllowanceRate);
      } else if (immoPrice > 550000.00 && immoPrice <= 600000.00) {
        amountOfTax = immoPrice * (0.0250 + taxAllowanceRate);
      } else if (immoPrice > 600000.00 && immoPrice <= 750000.00) {
        amountOfTax = immoPrice * (0.0225 + taxAllowanceRate);
      } else if (immoPrice > 750000.00) {
        amountOfTax = immoPrice * (0.0200 + taxAllowanceRate);
      }
      return amountOfTax;
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

      //$log.debug("Get Notary fees TVAC for " + loan);

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

      //$log.debug("Return notary fees " + notaryFees);

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
