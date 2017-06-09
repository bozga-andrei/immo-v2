/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('Immo.pages.efficiency')
    .controller('ProfitabilityChartCtrl', ProfitabilityChartCtrl);

  /** @ngInject */
  function ProfitabilityChartCtrl($scope, $log, baConfig) {

    var profChartCtrl = this;

    profChartCtrl.fin = $scope.effCtrl.fin;
    profChartCtrl.immo = $scope.effCtrl.immo;
    profChartCtrl.efficiency = $scope.effCtrl.efficiency;

    const layoutColors = baConfig.colors;

    profChartCtrl.gaugeChartOptions = {
      type: "gauge",
      marginBottom: 1,
      marginLeft: 1,
      marginRight: 1,
      marginTop: 1,
      theme: "dark",
      color: layoutColors.defaultText,
      startDuration: 2,
      creditsPosition: 'bottom-left',
      axes: [{
        axisThickness: 10,
        axisAlpha: 0.2,
        tickAlpha: 0.9,
        valueInterval: 2,
        unit: "%",
        bands: [{
          color: "#cc4748",
          endValue: 3,
          innerRadius: "55%",
          startValue: 0
        }, {
          color: "#fdd400",
          endValue: 6,
          innerRadius: "55%",
          startValue: 3
        }, {
          color: "#84b761",
          endValue: 20,
          innerRadius: "55%",
          startValue: 6
        }],
        bottomText: "Rendement brut: 0%",
        bottomTextFontSize: 20,
        bottomTextYOffset: 20,
        bottomTextColor: "#F44336",
        endValue: 20
      },
      {
        axisThickness: 10,
        axisAlpha: 0.2,
        tickAlpha: 0.9,
        valueInterval: 2,
        unit: "%",
        bands: [{
          color: "#cc4748",
          endValue: 3,
          innerRadius: "55%",
          startValue: 0
        }, {
          color: "#fdd400",
          endValue: 6,
          innerRadius: "55%",
          startValue: 3
        }, {
          color: "#84b761",
          endValue: 20,
          innerRadius: "55%",
          startValue: 6
        }],
        bottomText: "Rendement net: 0%",
        bottomTextFontSize: 20,
        bottomTextYOffset: 55,
        bottomTextColor: "#209e91",
        endValue: 20
      }],
      arrows: [
        {
          //Gross profitability
          startWidth: 20,
          alpha: 0.9,
          borderAlpha: 1,
          color: "#F44336",
          innerRadius: "30%",
          nailAlpha: 0,
          nailBorderAlpha: 0
        },
        {
          //Net profitability
          startWidth: 20,
          alpha: 0.9,
          borderAlpha: 1,
          color: "#209e91",
          innerRadius: "30%",
          nailAlpha: 0,
          nailBorderAlpha: 0
        }],
      export: {
        enabled: false
      },
      responsive: {
        enabled: true,
        rules: [
          // at 550px wide, we hide legend
          {
            maxWidth: 500,
            overrides: {
              bottomTextFontSize: 15,
              axes: [
                {
                  axisThickness: 5,
                  bottomTextFontSize: 15
                },
                {
                  axisThickness: 5,
                  bottomTextFontSize: 15
                }
              ]
            }
          }
        ]
      }
    };

    var gaugeChart = AmCharts.makeChart("profitabilityChart", profChartCtrl.gaugeChartOptions);

    if ($scope.effCtrl.efficiency.profitabilityNet || $scope.effCtrl.efficiency.profitabilityGross)
      setTimeout(function () {
        updateValue();
      }, 100);

    // Watch when fin object is changing
    $scope.$watchCollection('effCtrl.efficiency',
      function (newVal, oldVal) {
        if (!newVal || !newVal.totalAnnualIncoming || (angular.equals(newVal.profitabilityNet, oldVal.profitabilityNet) && angular.equals(newVal.profitabilityGross, oldVal.profitabilityGross))) {
          return; // simply skip that
        }
        setTimeout(function () {
          updateValue();
        }, 100);
      },
      true
    );


    function updateValue() {
      if ($scope.effCtrl.efficiency.profitabilityGross && $scope.effCtrl.efficiency.profitabilityNet) {
        var gross = $scope.effCtrl.efficiency.profitabilityGross;
        var profitabilityNet = $scope.effCtrl.efficiency.profitabilityNet;
        if (gaugeChart) {
          if (gaugeChart.arrows[0]) {
            if (gaugeChart.arrows[0].setValue) {
              gaugeChart.arrows[0].setValue(gross);
              gaugeChart.axes[0].setBottomText("Rendement brut: " + gross + " %");
            }
          }
          if (gaugeChart.arrows[1]) {
            if (gaugeChart.arrows[1].setValue) {
              gaugeChart.arrows[1].setValue(profitabilityNet);
              gaugeChart.axes[1].setBottomText("Rendement net:  " + profitabilityNet + " %");
            }
          }
          gaugeChart.validateData();
          gaugeChart.startDuration = 0.8;
        }
      }
    }
  }
})();
