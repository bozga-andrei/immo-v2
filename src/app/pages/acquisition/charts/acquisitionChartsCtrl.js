/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.acquisition')
    .controller('AcquisitionChartsCtrl', AcquisitionChartsCtrl);

  /** @ngInject */
  function AcquisitionChartsCtrl($scope, $log, baConfig) {

    var acqChartsCtrl = this;

    acqChartsCtrl.immo = $scope.acqCtrl.immo;
    acqChartsCtrl.legend = {};

    const layoutColors = baConfig.colors;

    if($scope.acqCtrl.immo.total){
      updateChart();
      updateLegend();
    }

    // Watch when fin object is changing
    $scope.$watchCollection('acqCtrl.immo', function (newVal, oldVal) {
        if (!newVal || !newVal.total || angular.equals(newVal.total, oldVal.total)) {
          return; // simply skip that
        }
        updateChart();
        updateLegend();
      },
      true
    );


    var pieChartConfig;
    function updateChart() {
      acqChartsCtrl.chartData = [
        {
          price: 'Prix',
          value: $scope.acqCtrl.immo.price
        },
        {
          price: 'Frais divers',
          value: $scope.acqCtrl.immo.variousFees
        }
      ];


      if($scope.acqCtrl.immo.isPublicSale){
        acqChartsCtrl.chartData.push({price:'Frais vente publique', value: $scope.acqCtrl.immo.registrationTaxPublicSale})
      } else {
        acqChartsCtrl.chartData.push({price:'Droits d\'enregistrements', value: $scope.acqCtrl.immo.registrationTax});
        acqChartsCtrl.chartData.push({price:'Honoraires notariaux', value: $scope.acqCtrl.immo.notaryHonorTTC});
      }
      //Only add renovationPrice if > 0
      if($scope.acqCtrl.immo.renovationPrice > 0){
        acqChartsCtrl.chartData.push({price: "Montant des Travaux", value: $scope.acqCtrl.immo.renovationPrice} );
      }


      pieChartConfig = baConfig.amChartPieConfig;
      pieChartConfig.dataProvider = acqChartsCtrl.chartData;
      pieChartConfig.theme = 'blur';
      pieChartConfig.allLabels = [{
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
        text: parseInt($scope.acqCtrl.immo.total||0) + '€',
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
              startDuration: 0,
              pullOutRadius: '20',
              pullOutDuration: 1,
              pullOutEffect: 'elastic',
              startEffect: "bounce",
              creditsPosition: 'top-right'
            }
          }
        ]
      };

      AmCharts.makeChart('pieChart', pieChartConfig);
    }

    function updateLegend() {

      const pricePercentage = (acqChartsCtrl.immo.price * (100 / acqChartsCtrl.immo.total)),
        renovationPricePercentage = ((acqChartsCtrl.immo.renovationPrice || 0) * (100 / acqChartsCtrl.immo.total)),
        registrationTaxPricePercentage = ((acqChartsCtrl.immo.registrationTax || 0) * (100 / acqChartsCtrl.immo.total)),
        notaryHonorTTCPercentage = ((acqChartsCtrl.immo.notaryHonorTTC || 0) * (100 / acqChartsCtrl.immo.total)),
        registrationTaxPublicSalePercentage = ((acqChartsCtrl.immo.registrationTaxPublicSale || 0) * (100 / acqChartsCtrl.immo.total)),
        variousFeesPercentage = ((acqChartsCtrl.immo.variousFees || 0) * (100 / acqChartsCtrl.immo.total));

      var percentages = [pricePercentage, variousFeesPercentage];

      if($scope.acqCtrl.immo.isPublicSale){
        percentages.push(registrationTaxPublicSalePercentage)
      } else {
        percentages.push(registrationTaxPricePercentage);
        percentages.push(notaryHonorTTCPercentage);
      }
      if(renovationPricePercentage > 0){
        percentages.push(renovationPricePercentage)
      }

      acqChartsCtrl.legend = [];
      for (var i = 0; i < acqChartsCtrl.chartData.length; i++) {
        acqChartsCtrl.legend.push({label: acqChartsCtrl.chartData[i].price, backgroundColor: pieChartConfig.colors[i], percentage: percentages[i]})
      }

    }

  }
})();
