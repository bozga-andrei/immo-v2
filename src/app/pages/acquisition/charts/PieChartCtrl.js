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
    $scope.immo = Acquisition.getImmo();
    $log.info("PieChartCtrl immo is: ", $scope.immo);

    var layoutColors = baConfig.colors;
    var id = $element[0].getAttribute('id');

    // Watch when fin object is changing
    $scope.$watchCollection('immo',
      function (newVal, oldVal) {
        $log.info("Watch");

        var pieChart = AmCharts.makeChart(id, {
          type: 'pie',
          startDuration: 0,
          theme: 'blur',
          addClassNames: true,
          color: layoutColors.defaultText,
          labelTickColor: layoutColors.borderDark,
          legend: {
            position: 'right',
            marginRight: 100,
            autoMargins: false
          },
          innerRadius: '40%',
          defs: {
            filter: [
              {
                id: 'shadow',
                width: '200%',
                height: '200%',
                feOffset: {
                  result: 'offOut',
                  in: 'SourceAlpha',
                  dx: 0,
                  dy: 0
                },
                feGaussianBlur: {
                  result: 'blurOut',
                  in: 'offOut',
                  stdDeviation: 5
                },
                feBlend: {
                  in: 'SourceGraphic',
                  in2: 'blurOut',
                  mode: 'normal'
                }
              }
            ]
          },
          dataProvider: [
            {
              price: 'Prix',
              value: $scope.immo.price
            },
            {
              price: 'Montant des Travaux',
              value: $scope.immo.renovationPrice
            },
            {
              price: 'Droits d\'enregistrements',
              value: $scope.immo.registrationTax
            },
            {
              price: 'Frais divers',
              value: $scope.immo.variousFees
            }
          ],
          valueField: 'value',
          titleField: 'price',
          export: {
            enabled: true
          },
          creditsPosition: 'bottom-left',

          autoMargins: false,
          marginTop: 10,
          alpha: 0.8,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          pullOutRadius: 0,
          pathToImages: layoutPaths.images.amChart,
          responsive: {
            enabled: true,
            rules: [
              // at 900px wide, we hide legend
              {
                maxWidth: 900,
                overrides: {
                  legend: {
                    enabled: false
                  }
                }
              },

              // at 200 px we hide value axis labels altogether
              {
                maxWidth: 200,
                overrides: {
                  valueAxes: {
                    labelsEnabled: false
                  },
                  marginTop: 30,
                  marginBottom: 30,
                  marginLeft: 30,
                  marginRight: 30
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
