/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.acquisition')
      .controller('PieChartCtrl', PieChartCtrl);

  /** @ngInject */
  function PieChartCtrl($scope, $log, $element, layoutPaths, baConfig, Acquisition) {
    //$scope.immo = Acquisition.getImmo();
    $log.info("PieChartCtrl immo is: ", $scope.acqCtrl.immo);

    var layoutColors = baConfig.colors;
    var id = $element[0].getAttribute('id');

    // Watch when fin object is changing
    $scope.$watchCollection('acqCtrl.immo',
      function (newVal, oldVal) {

        var pieChart = AmCharts.makeChart(id, {
          type: 'pie',
          startEffect: "elastic",
          startDuration: 2,
          theme: 'blur',
          autoMargins: false,
          marginTop: 1,
          alpha: 0.9,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          pullOutRadius: '5%',
          pullOutDuration: 5,
          pullOutEffect: 'elastic',
          balloonText: "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
          labelsEnabled: true,
          maxLabelWidth: 150,
          addClassNames: true,
          color: layoutColors.defaultText,
          labelTickColor: layoutColors.borderDark,
          legend: {
            enabled: false,
            position: 'bottom',
            autoMargins: true
          },
          labelRadius: 0,
          innerRadius: '50%',
          depth3D: 10,
          angle: 15,
          dataProvider: [
            {
              price: 'Prix',
              value: $scope.acqCtrl.immo.price
            },
            {
              price: 'Montant des Travaux',
              value: $scope.acqCtrl.immo.renovationPrice
            },
            {
              price: 'Droits d\'enregistrements',
              value: $scope.acqCtrl.immo.registrationTax
            },
            {
              price: 'Frais divers',
              value: $scope.acqCtrl.immo.variousFees
            }
          ],
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
              // at 400px wide, we hide legend
              {
                maxWidth: 600,
                overrides: {
                  labelsEnabled: false,
                  legend: {
                    enabled: true
                  }
                }
              }
            ]
          }

        });

        pieChart.addListener('init', handleInit);

        pieChart.addListener('rollOverSlice', function (e) {
          handleRollOver(e);
        });

      },
      true
    );




    function handleInit() {
      pieChart.legend.addListener('rollOverItem', handleRollOver);
    }

    function handleRollOver(e) {
      var wedge = e.dataItem.wedge.node;
      wedge.parentNode.appendChild(wedge);
    }
  }

})();
