/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.efficiency')
      .controller('EfficiencyChartsCtrl', EfficiencyChartsCtrl);

  /** @ngInject */
  function EfficiencyChartsCtrl($scope, $log, baConfig, colorHelper) {

    var effChartsCtrl = this;

    effChartsCtrl.fin = $scope.effCtrl.fin;
    effChartsCtrl.immo = $scope.effCtrl.immo;
    effChartsCtrl.efficiency = $scope.effCtrl.efficiency;

    effChartsCtrl.transparent = baConfig.theme.blur;
    var dashboardColors = baConfig.colors.dashboard;


    // Watch when fin object is changing
    $scope.$watchCollection('effChartsCtrl.efficiency',
      function (newVal, oldVal) {
        if (effChartsCtrl.efficiency.profitabilityNet) {
          updateChart();
        }
      },
      true
    );

    function updateChart() {
      var monthlyRentPercentage = ((effChartsCtrl.efficiency.monthlyRent * 12) * (100 / effChartsCtrl.efficiency.totalIncoming));
      var prepaidExpensesPercentage = ((effChartsCtrl.efficiency.prepaidExpenses * 12)  * (100 / effChartsCtrl.efficiency.totalIncoming));

      effChartsCtrl.doughnutData = {
        labels: [
          "Loyer mensuel perçu",
          "Charges preçues"
        ],
        datasets: [
          {
            data: [(effChartsCtrl.efficiency.monthlyRent * 12), (effChartsCtrl.efficiency.prepaidExpenses * 12)],
            backgroundColor: [
              dashboardColors.white,
              dashboardColors.blueStone

            ],
            hoverBackgroundColor: [
              colorHelper.shade(dashboardColors.white, 15),
              colorHelper.shade(dashboardColors.blueStone, 15)
            ],
            percentage: [monthlyRentPercentage, prepaidExpensesPercentage]
          }]
      };

      var ctx = document.getElementById('chart-area').getContext('2d');
      window.myDoughnut = new Chart(ctx, {
        type: 'doughnut',
        data: effChartsCtrl.doughnutData,
        options: {
          cutoutPercentage: 64,
          responsive: true,
          elements: {
            arc: {
              borderWidth: 0
            }
          }
        }
      });
    }






  }
})();
