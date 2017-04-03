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

    const layoutColors = baConfig.colors,
      dashboardColors = baConfig.colors.dashboard;

    acqChartsCtrl.chartColors = [
      dashboardColors.surfieGreen,
      dashboardColors.blueStone,
      dashboardColors.white,
      dashboardColors.silverTree,
      dashboardColors.gossip];


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


    function updateChart() {
      acqChartsCtrl.chartData = [
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
        acqChartsCtrl.chartData.push({price:'Frais vente publique', value: $scope.acqCtrl.immo.registrationTaxPublicSale})
      } else {
        acqChartsCtrl.chartData.push({price:'Droits d\'enregistrements', value: $scope.acqCtrl.immo.registrationTax});
        acqChartsCtrl.chartData.push({price:'Honoraires notariaux', value: $scope.acqCtrl.immo.notaryHonorTTC});
      }

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
        colors: acqChartsCtrl.chartColors,
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
          text: "Coût d'achat",
          color: layoutColors.defaultText
        }, {
          y: '50%',
          align: 'center',
          size: 15,
          text: parseInt($scope.acqCtrl.immo.total||0) + '€',
          color: layoutColors.defaultText
        }],
        dataProvider: acqChartsCtrl.chartData,
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

      const pricePercentage = (acqChartsCtrl.immo.price * (100 / acqChartsCtrl.immo.total)),
        renovationPricePercentage = ((acqChartsCtrl.immo.renovationPrice || 0) * (100 / acqChartsCtrl.immo.total)),
        registrationTaxPricePercentage = (acqChartsCtrl.immo.registrationTax * (100 / acqChartsCtrl.immo.total)),
        notaryHonorTTCPercentage = (acqChartsCtrl.immo.notaryHonorTTC * (100 / acqChartsCtrl.immo.total)),
        registrationTaxPublicSalePercentage = (acqChartsCtrl.immo.registrationTaxPublicSale * (100 / acqChartsCtrl.immo.total)),
        variousFeesPercentage = (acqChartsCtrl.immo.variousFees * (100 / acqChartsCtrl.immo.total));

      acqChartsCtrl.legend = {
        labels: [
          "Prix",
          "Montant des Travaux",
          "Frais divers"
        ],
        backgroundColor: acqChartsCtrl.chartColors,
        percentage: [pricePercentage, renovationPricePercentage, variousFeesPercentage]
      };

      if($scope.acqCtrl.immo.isPublicSale){
        acqChartsCtrl.legend.labels.push("Frais vente publique");
        acqChartsCtrl.legend.percentage.push(registrationTaxPublicSalePercentage);
      } else {
        acqChartsCtrl.legend.labels.push("Droits d'enregistrements");
        acqChartsCtrl.legend.labels.push("Honoraires notariaux");
        acqChartsCtrl.legend.percentage.push(registrationTaxPricePercentage);
        acqChartsCtrl.legend.percentage.push(notaryHonorTTCPercentage);
      }
    }

  }
})();
