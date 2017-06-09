/**
 * @author a.bozga
 * created on 03.04.2017
 */
(function () {
  'use strict';

  angular.module('Immo.pages.acquisition')
      .controller('PieChartCtrl', PieChartCtrl);

  /** @ngInject */
  function PieChartCtrl($scope, $log, $element, layoutPaths, baConfig) {

    var pieChartCtrl = this;

    var layoutColors = baConfig.colors;
    var dashboardColors = baConfig.colors.dashboard;
    var id = $element[0].getAttribute('id');



    // Watch when fin object is changing
    $scope.$watchCollection('acqCtrl.immo',
      function (newVal, oldVal) {
        if (!newVal || !newVal.total || angular.equals(newVal.total, oldVal.total)) {
          return; // simply skip that
        }

        pieChartCtrl.chartData = [
          {
            price: 'Prix',
            value: $scope.acqCtrl.immo.price
          },
          {
            price: 'Montant des Travaux',
            value: $scope.acqCtrl.immo.renovationPrice
          },
          {
            price: 'Frais divers',
            value: $scope.acqCtrl.immo.variousFees
          }
        ];

        if($scope.acqCtrl.immo.isPublicSale){
          pieChartCtrl.chartData.push({price:'Frais vente publique', value: $scope.acqCtrl.immo.registrationTaxPublicSale})
        } else {
          pieChartCtrl.chartData.push({price:'Droits d\'enregistrements', value: $scope.acqCtrl.immo.registrationTax});
          pieChartCtrl.chartData.push({price:'Honoraires notariaux', value: $scope.acqCtrl.immo.notaryHonorTTC});
        }

        AmCharts.makeChart(id, {
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
          pullOutDuration: 3,
          pullOutEffect: 'elastic',
          colors: [
            dashboardColors.surfieGreen,
            dashboardColors.blueStone,
            dashboardColors.white,
            dashboardColors.silverTree,
            dashboardColors.gossip],
          balloonText: "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
          decimalSeparator: ',',
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
            text: "Coût d'achat",
            color: layoutColors.defaultText
          }, {
            y: '50%',
            align: 'center',
            size: 15,
            text: $filter('currency')($scope.acqCtrl.immo.total||0, '€', 0),
            color: layoutColors.defaultText
          }],
          dataProvider: pieChartCtrl.chartData,
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
                  creditsPosition: 'top-right',
                  startEffect: "none",
                  startDuration: 1
                }
              }
            ]
          }

        });
      },
      true
    );

  }

})();
