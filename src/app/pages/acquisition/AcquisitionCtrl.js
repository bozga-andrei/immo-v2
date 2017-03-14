/**
 * @author a.bozga
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.acquisition')
      .controller('AcquisitionCtrl', AcquisitionCtrl);

  /** @ngInject */
  function AcquisitionCtrl($scope, $log, Acquisition, Funding) {

    var acqCtrl = this;

    const TVA = 1.21;

    acqCtrl.BXL_AND_WALLONIA_TAX_RATE = 0.125;
    acqCtrl.WALLONIA_AFTER_3_IMMO_TAX_RATE = 0.15;
    acqCtrl.FLANDERS_TAX_RATE = 0.10;
    acqCtrl.WALLONIA_REDUCED_TAX_RATE = 0.06;
    acqCtrl.FLANDERS_REDUCED_TAX_RATE = 0.05;

    acqCtrl.REDUCED_TAX_ALLOWANCE_SUM = 60000;
    acqCtrl.TAX_ALLOWANCE_SUM = 75000;
    acqCtrl.TAX_ALLOWANCE_SUM_2017 = 175000;

    //Immo
    acqCtrl.immo = Acquisition.getImmo();
    if(!acqCtrl.immo || !acqCtrl.immo.total){
      acqCtrl.immo.registrationFeePercentage = acqCtrl.BXL_AND_WALLONIA_TAX_RATE;
      acqCtrl.immo.taxAllowanceSum = 0;
      acqCtrl.immo.variousFees = 1100;
      acqCtrl.immo.isPublicSale = false;
      acqCtrl.immo.total = 0;
    }

    acqCtrl.invest = {};
    acqCtrl.invest.prepaidExpenses = 0;


    acqCtrl.taxLoanAmountDataSource = {};


    //Watch when registrationFeePercentage is changing and reset registrationFeePercentage to 0
    $scope.$watch(
      function () {
        return acqCtrl.immo.registrationFeePercentage;
      },
      function (newVal, oldVal) {
        if(!newVal || angular.equals(newVal, oldVal)){
          return; // simply skip that
        }
          //Reset taxAllowanceSum to 0 if registrationFeePercentage is changing
          acqCtrl.immo.taxAllowanceSum = 0;
      },
      true
    );

    // Watch when immo price is changing
    $scope.$watchCollection('acqCtrl.immo',
      function (newVal, oldVal) {

        //Check if the selected taxAllowanceSum is 175000 and price under 500.000€
        if (acqCtrl.immo.taxAllowanceSum == 175000 && newVal.price > 500000) {
          //Tax allowance is not accorded for a price higher than 500.000€
          acqCtrl.immo.registrationTax = Number((newVal.price * acqCtrl.immo.registrationFeePercentage).toFixed(0));
        } else {
          if (newVal.price > acqCtrl.immo.taxAllowanceSum) {
            var reducedPrice = newVal.price - acqCtrl.immo.taxAllowanceSum;
            //The reduced tax is relevant only for a price under 161.438€, after that sum the normal tax rate is applicable.
            if ((acqCtrl.immo.registrationFeePercentage == acqCtrl.FLANDERS_REDUCED_TAX_RATE ||
              acqCtrl.immo.registrationFeePercentage == acqCtrl.WALLONIA_REDUCED_TAX_RATE) && newVal.price > 161438.00) {
              var regionTax = acqCtrl.immo.registrationFeePercentage == acqCtrl.WALLONIA_REDUCED_TAX_RATE ? 0.125 : 0.100;
              acqCtrl.immo.registrationTax = Number(((161438.00 * acqCtrl.immo.registrationFeePercentage) + ((newVal.price - 161438.00) * regionTax)).toFixed(0));
            } else {
              acqCtrl.immo.registrationTax = Number((reducedPrice * acqCtrl.immo.registrationFeePercentage).toFixed(0));
            }
          } else {
            //If tax allowance is smaller than the 'price' set registration tax to 0
            acqCtrl.immo.registrationTax = 0;
            if (acqCtrl.immo.isPublicSale) {
              acqCtrl.immo.registrationTaxPublicSale = 0;
            }
          }
        }

        //If is a public sale
        if (acqCtrl.immo.isPublicSale) {
          acqCtrl.immo.registrationTaxPublicSale = getPublicSaleAmountOfTax(newVal.price, acqCtrl.immo.registrationFeePercentage, acqCtrl.immo.taxAllowanceSum);
        } else {
          acqCtrl.immo.notaryHonorHTVA = getImmoNotaryHonorary(newVal.price);
          acqCtrl.immo.notaryHonorTTC = parseInt(acqCtrl.immo.notaryHonorHTVA * TVA);
        }


        acqCtrl.immo.total = getTotalImmoAmount();
        //$log.debug("Immo.total is set to : [" + acqCtrl.immo.total + "]");

        // === Update Invest section ===
        //Update immo insurance
        //acqCtrl.invest.insurance = (acqCtrl.immo.area * 1.5);//TODO correction with the appropriate value

        Acquisition.saveImmo(acqCtrl.immo);
      },
      true
    );


    // Watch when investment object is changing
    $scope.$watchCollection('acqCtrl.invest',
      function (newVal, oldVal) {
        //$log.debug("invest.monthlyRent is set to : [" + acqCtrl.invest.monthlyRent + "]");
        if (newVal.monthlyRent >= 0) {
          acqCtrl.invest.profitabilityNet = (((((newVal.monthlyRent * 12) - acqCtrl.invest.maintenance - acqCtrl.fin.totalLoanInsurance - acqCtrl.invest.insurance) + (acqCtrl.invest.prepaidExpenses * 12)) / acqCtrl.immo.total) * 100);
        }
      },
      true
    );

    //Watch when monthlyRent is changing and update the surface maintenance
    $scope.$watch(
      function () {
        return acqCtrl.invest.monthlyRent;
      },
      function (newVal, oldVal) {
        if (newVal) {
          acqCtrl.invest.maintenance = (newVal * 0.04); // 4%/year of the monthly rate
        }
      },
      true
    );

    //Watch when immo.area is changing and update the invest.insurance
    $scope.$watch(
      function () {
        return acqCtrl.immo.area;
      },
      function (newVal, oldVal) {
        if (newVal) {
          acqCtrl.invest.insurance = (newVal * 1.5);//TODO correction with the appropriate value
        }
      },
      true
    );


    function getTotalImmoAmount() {
      var total;
      if(acqCtrl.immo.renovationPrice){
        total = acqCtrl.immo.price + acqCtrl.immo.variousFees + acqCtrl.immo.renovationPrice;
      } else {
        total = acqCtrl.immo.price + acqCtrl.immo.variousFees;
      }

      if (acqCtrl.immo.isPublicSale) {
        total = total + acqCtrl.immo.registrationTaxPublicSale;
      } else {
        total = total + acqCtrl.immo.registrationTax + acqCtrl.immo.notaryHonorTTC;
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

      acqCtrl.fin.totalLoanInterest = ((monthly * payments) - loanAmount);


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
     * @param registrationFeePercentage => The percentage of taxe Brussels; 0.06 Brussels reduced tax
     * @param taxAllowanceSum 0.125 => Brussels; 0.06 Brussels reduced tax
     * @returns {number} the amount of tax based on the price of the good
     */
    function getPublicSaleAmountOfTax(immoPrice, registrationFeePercentage, taxAllowanceSum) {
      var amountOfTax = 0;

      if (immoPrice <= 30000.00) {
        amountOfTax = immoPrice * (0.2750 + registrationFeePercentage);
      } else if (immoPrice > 30000.00 && immoPrice <= 40000.00) {
        amountOfTax = immoPrice * (0.1900 + registrationFeePercentage);
      } else if (immoPrice > 40000.00 && immoPrice <= 50000.00) {
        amountOfTax = immoPrice * (0.1550 + registrationFeePercentage);
      } else if (immoPrice > 50000.00 && immoPrice <= 60000.00) {
        amountOfTax = immoPrice * (0.1200 + registrationFeePercentage);
      } else if (immoPrice > 60000.00 && immoPrice <= 70000.00) {
        amountOfTax = immoPrice * (0.1100 + registrationFeePercentage);
      } else if (immoPrice > 70000.00 && immoPrice <= 80000.00) {
        amountOfTax = immoPrice * (0.1050 + registrationFeePercentage);
      } else if (immoPrice > 80000.00 && immoPrice <= 90000.00) {
        amountOfTax = immoPrice * (0.0950 + registrationFeePercentage);
      } else if (immoPrice > 90000.00 && immoPrice <= 100000.00) {
        amountOfTax = immoPrice * (0.0900 + registrationFeePercentage);
      } else if (immoPrice > 100000.00 && immoPrice <= 110000.00) {
        amountOfTax = immoPrice * (0.0850 + registrationFeePercentage);
      } else if (immoPrice > 110000.00 && immoPrice <= 125000.00) {
        amountOfTax = immoPrice * (0.0825 + registrationFeePercentage);
      } else if (immoPrice > 125000.00 && immoPrice <= 150000.00) {
        amountOfTax = immoPrice * (0.0750 + registrationFeePercentage);
      } else if (immoPrice > 150000.00 && immoPrice <= 175000.00) {
        amountOfTax = immoPrice * (0.0725 + registrationFeePercentage);
      } else if (immoPrice > 175000.00 && immoPrice <= 200000.00) {
        amountOfTax = immoPrice * (0.0675 + registrationFeePercentage);
      } else if (immoPrice > 200000.00 && immoPrice <= 225000.00) {
        amountOfTax = immoPrice * (0.0600 + registrationFeePercentage);
      } else if (immoPrice > 225000.00 && immoPrice <= 250000.00) {
        amountOfTax = immoPrice * (0.0550 + registrationFeePercentage);
      } else if (immoPrice > 250000.00 && immoPrice <= 275000.00) {
        amountOfTax = immoPrice * (0.0500 + registrationFeePercentage);
      } else if (immoPrice > 275000.00 && immoPrice <= 300000.00) {
        amountOfTax = immoPrice * (0.0475 + registrationFeePercentage);
      } else if (immoPrice > 300000.00 && immoPrice <= 325000.00) {
        amountOfTax = immoPrice * (0.0425 + registrationFeePercentage);
      } else if (immoPrice > 325000.00 && immoPrice <= 375000.00) {
        amountOfTax = immoPrice * (0.0400 + registrationFeePercentage);
      } else if (immoPrice > 375000.00 && immoPrice <= 400000.00) {
        amountOfTax = immoPrice * (0.0350 + registrationFeePercentage);
      } else if (immoPrice > 400000.00 && immoPrice <= 425000.00) {
        amountOfTax = immoPrice * (0.0325 + registrationFeePercentage);
      } else if (immoPrice > 425000.00 && immoPrice <= 500000.00) {
        amountOfTax = immoPrice * (0.0300 + registrationFeePercentage);
      } else if (immoPrice > 500000.00 && immoPrice <= 550000.00) {
        amountOfTax = immoPrice * (0.0275 + registrationFeePercentage);
      } else if (immoPrice > 550000.00 && immoPrice <= 600000.00) {
        amountOfTax = immoPrice * (0.0250 + registrationFeePercentage);
      } else if (immoPrice > 600000.00 && immoPrice <= 750000.00) {
        amountOfTax = immoPrice * (0.0225 + registrationFeePercentage);
      } else if (immoPrice > 750000.00) {
        amountOfTax = immoPrice * (0.0200 + registrationFeePercentage);
      }

      if(immoPrice <= taxAllowanceSum) {
        amountOfTax = amountOfTax - (immoPrice * registrationFeePercentage);
      } else if(immoPrice > taxAllowanceSum && immoPrice < 500000) {
        amountOfTax = amountOfTax - (taxAllowanceSum * registrationFeePercentage);
      }

      return amountOfTax;
    }


    /**
     * Loan registration tax representing 1% of the total loan amount with accessory of 10%
     * @param loanAmountWithAccessory
     * @returns {number}
     */
    function getLoanRegistrationTax(loanAmountWithAccessory) {

      return Number((loanAmountWithAccessory * 0.01).toFixed(0));
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
      acqCtrl.fin.loanNotaryFees = notaryFees;

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
