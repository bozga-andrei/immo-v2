/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.efficiency')
      .controller('EfficiencyChartsCtrl', EfficiencyChartsCtrl);

  /** @ngInject */
  function EfficiencyChartsCtrl($scope, $log, baConfig) {

    var effChartsCtrl = this;

    effChartsCtrl.fin = $scope.effCtrl.fin;
    effChartsCtrl.immo = $scope.effCtrl.immo;
    effChartsCtrl.efficiency = $scope.effCtrl.efficiency;

    const layoutColors = baConfig.colors,
      dashboardColors = baConfig.colors.dashboard;

    effChartsCtrl.chartColors = [
      dashboardColors.surfieGreen,
      dashboardColors.blueStone,
      dashboardColors.white,
      dashboardColors.silverTree,
      dashboardColors.gossip];

    //Update and display chart when the page is first displayed
    updateChart();
    updateLegend();

    // Watch when fin object is changing
    $scope.$watchCollection('effCtrl.efficiency',
      function (newVal, oldVal) {
        if (!newVal || !newVal.profitabilityNet || angular.equals(newVal.profitabilityNet, oldVal.profitabilityNet)) {
          return; // simply skip that
        }
        updateChart();
        updateLegend();
      },
      true
    );

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
        colors: effChartsCtrl.chartColors,
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
          text: "Revenu total",
          color: layoutColors.defaultText
        }, {
          y: '50%',
          align: 'center',
          size: 15,
          text: parseInt($scope.effCtrl.efficiency.totalIncoming||0) + '€',
          color: layoutColors.defaultText
        }],
        dataProvider: effChartsCtrl.chartData,
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


    function updateLegend() {
      const monthlyRentPercentage = ((effChartsCtrl.efficiency.monthlyRent * 12) * (100 / effChartsCtrl.efficiency.totalIncoming)),
        prepaidExpensesPercentage = ((effChartsCtrl.efficiency.prepaidExpenses * 12)  * (100 / effChartsCtrl.efficiency.totalIncoming));

      effChartsCtrl.legend = {
        labels: [
          "Loyer mensuel perçu",
          "Charges preçues"
        ],
        backgroundColor: effChartsCtrl.chartColors,
        percentage: [monthlyRentPercentage, prepaidExpensesPercentage]
      };
    }




  }
})();
