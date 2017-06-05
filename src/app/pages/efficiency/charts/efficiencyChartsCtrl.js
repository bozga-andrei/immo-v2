/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.efficiency')
      .controller('EfficiencyChartsCtrl', EfficiencyChartsCtrl);

  /** @ngInject */
  function EfficiencyChartsCtrl($scope, $log, $filter, baConfig) {

    var effChartsCtrl = this;

    effChartsCtrl.fin = $scope.effCtrl.fin;
    effChartsCtrl.immo = $scope.effCtrl.immo;
    effChartsCtrl.efficiency = $scope.effCtrl.efficiency;

    const layoutColors = baConfig.colors,
      dashboardColors = baConfig.colors.dashboard;

    //Update and display chart when the page is first displayed
    /*setTimeout(function () {
      updateChart();
      updateLegend();
    }, 100);*/

    // Watch when fin object is changing
    $scope.$watchCollection('effCtrl.efficiency',
      function (newVal, oldVal) {
        if (!newVal || !newVal.totalAnnualIncoming || angular.equals(newVal.totalAnnualIncoming, oldVal.totalAnnualIncoming)) {
          return; // simply skip that
        }
        /*setTimeout(function () {
          updateChart();
          updateLegend();
        }, 100);*/
      },
      true
    );

    var pieChartConfig;
    function updateChart() {

      effChartsCtrl.chartData = [
        {
          price: 'Loyer mensuel perçu',
          value: $scope.effCtrl.efficiency.monthlyRent
        },
        {
          price: 'Charges preçues',
          value: $scope.effCtrl.efficiency.prepaidExpenses
        }
      ];

      pieChartConfig = baConfig.amChartPieConfig;
      pieChartConfig.dataProvider = effChartsCtrl.chartData;
      pieChartConfig.theme = 'blur';
      pieChartConfig.allLabels= [{
        y: '45%',
        align: 'center',
        size: 15,
        bold: true,
        text: "Revenu total",
        color: layoutColors.defaultText
      }, {
        y: '50%',
        align: 'center',
        size: 15,
        text: $filter('currency')($scope.effCtrl.efficiency.totalAnnualIncoming||0, '€', 0),
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

/*

    function updateLegend() {
      const monthlyRentPercentage = ((effChartsCtrl.efficiency.monthlyRent * 12) * (100 / effChartsCtrl.efficiency.totalAnnualIncoming)),
        prepaidExpensesPercentage = ((effChartsCtrl.efficiency.prepaidExpenses * 12)  * (100 / effChartsCtrl.efficiency.totalAnnualIncoming));

      effChartsCtrl.legend = {
        labels: [
          "Loyer mensuel perçu",
          "Charges preçues"
        ],
        backgroundColor: Object.values(dashboardColors),
        percentage: [monthlyRentPercentage, prepaidExpensesPercentage]
      };
    }
*/

    function updateLegend() {

      const monthlyRentPercentage = ((effChartsCtrl.efficiency.monthlyRent * 12) * (100 / effChartsCtrl.efficiency.totalAnnualIncoming)),
        prepaidExpensesPercentage = ((effChartsCtrl.efficiency.prepaidExpenses * 12)  * (100 / effChartsCtrl.efficiency.totalAnnualIncoming));

      var percentages = [monthlyRentPercentage, prepaidExpensesPercentage];

      effChartsCtrl.legend = [];
      for (var i = 0; i < pieChartConfig.dataProvider.length; i++) {
        effChartsCtrl.legend.push({label: pieChartConfig.dataProvider[i].price, backgroundColor: pieChartConfig.colors[i], percentage: percentages[i]})
      }

    }




  }
})();
