/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
    .controller('TaxLoanAmountPieChartCtrl', TaxLoanAmountPieChartCtrl);

  /** @ngInject */
  function TaxLoanAmountPieChartCtrl($scope, $log, baConfig) {

    var taxLoanAmountPieChartCtrl = this;

    taxLoanAmountPieChartCtrl.fin = $scope.funCtrl.fin;

    const layoutColors = baConfig.colors;

    updateChart();
    updateLegend();

    // Watch when fin object is changing
    $scope.$watchCollection('taxLoanAmountPieChartCtrl.fin.taxLoanAmount',
      function (newVal, oldVal) {
        if (taxLoanAmountPieChartCtrl.fin.taxLoanAmount) {
          if (angular.equals(newVal, oldVal)) {
            return; // simply skip that
          }
          updateChart();
          updateLegend();
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


      pieChartConfig = baConfig.amChartPieConfig;
      pieChartConfig.dataProvider = taxLoanAmountPieChartCtrl.chartData;
      pieChartConfig.theme = 'blur';
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
        text: parseInt($scope.funCtrl.fin.taxLoanAmount||0) + '€',
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
              creditsPosition: 'top-right'
            }
          }
        ]
      };

      AmCharts.makeChart('pieChart', pieChartConfig);

    }

    function updateLegend() {

      const loanRegistrationTaxPercentage = (taxLoanAmountPieChartCtrl.fin.loanRegistrationTax * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        mortgageRegistrationPercentage = (taxLoanAmountPieChartCtrl.fin.mortgageRegistration * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        conservativeSalaryPercentage = (taxLoanAmountPieChartCtrl.fin.conservativeSalary * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        loanNotaryFeesPercentage = (taxLoanAmountPieChartCtrl.fin.loanRegistrationNotaryFees * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        loanVariousFeesPercentage = (taxLoanAmountPieChartCtrl.fin.loanVariousFees * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount));

      var percentages = [loanRegistrationTaxPercentage, mortgageRegistrationPercentage, conservativeSalaryPercentage, loanNotaryFeesPercentage, loanVariousFeesPercentage];

      taxLoanAmountPieChartCtrl.legend = [];
      for (var i = 0; i < pieChartConfig.dataProvider.length; i++) {
        taxLoanAmountPieChartCtrl.legend.push({label: pieChartConfig.dataProvider[i].price, backgroundColor: pieChartConfig.colors[i], percentage: percentages[i]})
      }

    }


  }
})();
