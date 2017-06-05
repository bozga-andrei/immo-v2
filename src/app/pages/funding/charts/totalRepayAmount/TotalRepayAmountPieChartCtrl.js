/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
    .controller('TotalRepayAmountPieChartCtrl', TotalRepayAmountPieChartCtrl);

  /** @ngInject */
  function TotalRepayAmountPieChartCtrl($scope, $log, $filter, themeLayoutSettings, baConfig) {

    var totalRepayAmountPieChartCtrl = this;

    totalRepayAmountPieChartCtrl.fin = $scope.funCtrl.fin;
    totalRepayAmountPieChartCtrl.isMobile = themeLayoutSettings.mobile;

    const layoutColors = baConfig.colors,
      dashboardColors = baConfig.colors.dashboard;


    //get the general amChart PIE config from configProvider
    var pieChartConfig = baConfig.amChartPieConfig;

    //Update some values
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
      text: $filter('currency')($scope.funCtrl.fin.totalLoanInterestAndInsurance||0, '€', 0),
      color: layoutColors.defaultText
    }];
    pieChartConfig.responsive = {
      enabled: true,
      rules: [
        // at 550px wide, we hide legend
        {
          maxWidth: 450,
          overrides: {
            labelsEnabled: false,
            depth3D: 5,
            angle: 5,
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
    $scope.$watchCollection('totalRepayAmountPieChartCtrl.fin.totalLoanInterestAndInsurance',
      function (newVal, oldVal) {
        if (totalRepayAmountPieChartCtrl.fin.totalLoanInterestAndInsurance) {
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

      amChart.dataProvider = totalRepayAmountPieChartCtrl.chartData;
      amChart.allLabels= [{
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
        text: $filter('currency')($scope.funCtrl.fin.totalLoanInterestAndInsurance||0, '€', 0),
        color: layoutColors.defaultText
      }];

      amChart.validateData();
      if(!totalRepayAmountPieChartCtrl.isMobile){
        amChart.startEffect = "elastic";
        amChart.startDuration = 0.8;
        amChart.animateAgain();
      }

    }

    function updateLegend() {

      const totalLoanInterestPercentage = (totalRepayAmountPieChartCtrl.fin.totalLoanInterest * (100 / totalRepayAmountPieChartCtrl.fin.totalLoanInterestAndInsurance)),
        totalLoanInsurancePercentage = (totalRepayAmountPieChartCtrl.fin.totalLoanInsurance * (100 / totalRepayAmountPieChartCtrl.fin.totalLoanInterestAndInsurance)),
        loanAmountPercentage = (totalRepayAmountPieChartCtrl.fin.loanAmount * (100 / totalRepayAmountPieChartCtrl.fin.totalLoanInterestAndInsurance));

      var percentages = [totalLoanInterestPercentage, totalLoanInsurancePercentage, loanAmountPercentage];

      totalRepayAmountPieChartCtrl.legend = [];
      for (var i = 0; i < totalRepayAmountPieChartCtrl.chartData.length; i++) {
        totalRepayAmountPieChartCtrl.legend.push({label: totalRepayAmountPieChartCtrl.chartData[i].price, backgroundColor: pieChartConfig.colors[i], percentage: percentages[i]})
      }

    }


  }
})();
