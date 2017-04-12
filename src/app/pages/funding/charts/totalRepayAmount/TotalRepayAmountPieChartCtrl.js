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

    totalRepayAmountPieChartCtrl.chartColors = [
      dashboardColors.surfieGreen,
      dashboardColors.blueStone,
      dashboardColors.white,
      dashboardColors.silverTree,
      dashboardColors.gossip];

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

      AmCharts.makeChart('pieChart', {
        type: 'pie',
        startEffect: "elastic",
        startDuration: 1,
        theme: 'blur',
        autoMargins: false,
        marginTop: 1,
        alpha: 0.9,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        labelRadius: 0,
        innerRadius: '50%',
        depth3D: 10,
        angle: 20,
        pullOutRadius: '20',
        pullOutDuration: 5,
        pullOutEffect: 'elastic',
        colors: totalRepayAmountPieChartCtrl.chartColors,
        balloonText: "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
        labelsEnabled: true,
        maxLabelWidth: 150,
        addClassNames: true,
        color: layoutColors.defaultText,
        labelTickColor: layoutColors.borderDark,
        allLabels: [{
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
        }],
        dataProvider: totalRepayAmountPieChartCtrl.chartData,
        valueField: 'value',
        titleField: 'price',
        export: {
          enabled: true
        },
        creditsPosition: 'bottom-left',
        valueAxes: {
          inside: true,
          labelsEnabled: false
        },
        responsive: {
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
        }

      });

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
        backgroundColor: totalRepayAmountPieChartCtrl.chartColors,
        percentage: [totalLoanInterestPercentage, totalLoanInsurancePercentage, loanAmountPercentage]
      };

    }


  }
})();
