/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('Immo.pages.funding')
    .controller('TaxLoanAmountPieChartCtrl', TaxLoanAmountPieChartCtrl);

  /** @ngInject */
  function TaxLoanAmountPieChartCtrl($scope, $log, $filter, themeLayoutSettings, baConfig) {

    var taxLoanAmountPieChartCtrl = this;

    taxLoanAmountPieChartCtrl.fin = $scope.funCtrl.fin;

    const layoutColors = baConfig.colors;


    //get the general amChart PIE config from configProvider
    var pieChartConfig = baConfig.amChartPieConfig;

    //Update some values
    pieChartConfig.theme = 'blur';
    pieChartConfig.startEffect = "bounce";
    pieChartConfig.allLabels= [{
      y: '45%',
      align: 'center',
      size: 15,
      bold: true,
      text: "Frais sur emprunt",
      color: layoutColors.defaultText
    }, {
      y: '50%',
      align: 'center',
      size: 15,
      text: $filter('currency')($scope.funCtrl.fin.taxLoanAmount||0, '€', 0),
      color: layoutColors.defaultText
    }];
    pieChartConfig.responsive = {
      enabled: true,
      rules: [
        // at 550px wide, we hide legend
        {
          maxWidth: 550,
          overrides: {
            labelsEnabled: false,
            depth3D: 5,
            angle: 5,
            startDuration: 0,
            creditsPosition: 'top-right'
          }
        }
      ]
    };

    var amChart = AmCharts.makeChart('pieChart', pieChartConfig);


    setTimeout(function () {
      updateChart();
      updateLegend();
    }, 100);

    // Watch when fin object is changing
    $scope.$watchCollection('taxLoanAmountPieChartCtrl.fin.taxLoanAmount',
      function (newVal, oldVal) {
        if (taxLoanAmountPieChartCtrl.fin.taxLoanAmount) {
          if (angular.equals(newVal, oldVal)) {
            return; // simply skip that
          }
          setTimeout(function () {
            updateChart();
            updateLegend();
          }, 100);
        }
      },
      true
    );


    var pieChartConfig;
    function updateChart() {

      taxLoanAmountPieChartCtrl.chartData = [
        {
          price: 'Droits d\'enregistrement(1%)',
          value: $scope.funCtrl.fin.loanRegistrationTax
        },
        {
          price: 'Droits d\'inscription hypothécaire',
          value: $scope.funCtrl.fin.mortgageRegistration
        },
        {
          price: 'Salaire du Conservateur',
          value: $scope.funCtrl.fin.conservativeSalary
        },
        {
          price: 'Honoraires du notaire',
          value: $scope.funCtrl.fin.loanRegistrationNotaryFees
        },
        {
          price: 'Frais de dossier',
          value: $scope.funCtrl.fin.loanVariousFees
        }
      ];



      amChart.dataProvider = taxLoanAmountPieChartCtrl.chartData;
      amChart.allLabels= [{
        y: '45%',
        align: 'center',
        size: 15,
        bold: true,
        text: "Frais sur emprunt",
        color: layoutColors.defaultText
      }, {
        y: '50%',
        align: 'center',
        size: 15,
        text: $filter('currency')($scope.funCtrl.fin.taxLoanAmount||0, '€', 0),
        color: layoutColors.defaultText
      }];

      amChart.validateData();
      if(!taxLoanAmountPieChartCtrl.isMobile){
        amChart.startEffect = "bounce";
        amChart.startDuration = 0.8;
        amChart.animateAgain();
      }

    }

    function updateLegend() {

      const loanRegistrationTaxPercentage = (taxLoanAmountPieChartCtrl.fin.loanRegistrationTax * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        mortgageRegistrationPercentage = (taxLoanAmountPieChartCtrl.fin.mortgageRegistration * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        conservativeSalaryPercentage = (taxLoanAmountPieChartCtrl.fin.conservativeSalary * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        loanNotaryFeesPercentage = (taxLoanAmountPieChartCtrl.fin.loanRegistrationNotaryFees * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        loanVariousFeesPercentage = (taxLoanAmountPieChartCtrl.fin.loanVariousFees * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount));

      var percentages = [loanRegistrationTaxPercentage, mortgageRegistrationPercentage, conservativeSalaryPercentage, loanNotaryFeesPercentage, loanVariousFeesPercentage];

      taxLoanAmountPieChartCtrl.legend = [];
      for (var i = 0; i < taxLoanAmountPieChartCtrl.chartData.length; i++) {
        taxLoanAmountPieChartCtrl.legend.push({label: taxLoanAmountPieChartCtrl.chartData[i].price, backgroundColor: pieChartConfig.colors[i], percentage: percentages[i]})
      }

    }


  }
})();
