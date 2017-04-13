/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
    .controller('TotalRepayAmountPieChartCtrl', TotalRepayAmountPieChartCtrl);

  /** @ngInject */
  function TotalRepayAmountPieChartCtrl($scope, $log, baConfig) {

    var totalRepayAmountPieChartCtrl = this;

    totalRepayAmountPieChartCtrl.fin = $scope.funCtrl.fin;

    const layoutColors = baConfig.colors,
      dashboardColors = baConfig.colors.dashboard;

    updateChart();
    updateLegend();

    // Watch when fin object is changing
    $scope.$watchCollection('totalRepayAmountPieChartCtrl.fin.totalLoanInterestAndInsurance',
      function (newVal, oldVal) {
        if (totalRepayAmountPieChartCtrl.fin.totalLoanInterestAndInsurance) {
          if (angular.equals(newVal, oldVal)) {
            return; // simply skip that
          }
          updateChart();
          updateLegend();
        }
      },
      true
    );


    function updateChart() {

      totalRepayAmountPieChartCtrl.chartData = [
        {
          price: 'Coût des intérêts',
          value: $scope.funCtrl.fin.totalLoanInterest
        },
        {
          price: 'Coût de l\'assurance',
          value: $scope.funCtrl.fin.totalLoanInsurance
        },
        {
          price: 'Capital à emprunter',
          value: $scope.funCtrl.fin.loanAmount
        }
      ];

      var pieChartConfig = baConfig.amChartPieConfig;
      pieChartConfig.dataProvider = totalRepayAmountPieChartCtrl.chartData;
      pieChartConfig.theme = 'blur';
      pieChartConfig.allLabels= [{
        y: '45%',
        align: 'center',
        size: 15,
        bold: true,
        text: "À rembourser",
        color: layoutColors.defaultText
      }, {
        y: '50%',
        align: 'center',
        size: 15,
        text: parseInt($scope.funCtrl.fin.totalLoanInterestAndInsurance||0) + '€',
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

    function updateLegend(){
      const totalLoanInterestPercentage = (totalRepayAmountPieChartCtrl.fin.totalLoanInterest * (100 / totalRepayAmountPieChartCtrl.fin.totalLoanInterestAndInsurance)),
        totalLoanInsurancePercentage = (totalRepayAmountPieChartCtrl.fin.totalLoanInsurance * (100 / totalRepayAmountPieChartCtrl.fin.totalLoanInterestAndInsurance)),
        loanAmountPercentage = (totalRepayAmountPieChartCtrl.fin.loanAmount * (100 / totalRepayAmountPieChartCtrl.fin.totalLoanInterestAndInsurance));


      totalRepayAmountPieChartCtrl.legend = {
        labels: [
          "Coût des intérêts",
          "Coût de l'assurance",
          "Capital à emprunter"
        ],
        backgroundColor: Object.values(dashboardColors),
        percentage: [totalLoanInterestPercentage, totalLoanInsurancePercentage, loanAmountPercentage]
      };

    }


  }
})();
