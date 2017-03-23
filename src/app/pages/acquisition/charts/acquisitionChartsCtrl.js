/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.acquisition')
    .controller('AcquisitionChartsCtrl', AcquisitionChartsCtrl);

  /** @ngInject */
  function AcquisitionChartsCtrl($scope, $log, baConfig, colorHelper) {

    var acqChartsCtrl = this;

    acqChartsCtrl.immo = $scope.acqCtrl.immo;

    acqChartsCtrl.transparent = baConfig.theme.blur;
    var dashboardColors = baConfig.colors.dashboard;

    // Watch when fin object is changing
    $scope.$watchCollection(angular.bind(this, function () {
        return acqChartsCtrl.immo;
      }), function (newVal, oldVal) {
        if (!newVal || !newVal.total) {
          return; // simply skip that
        }
        updateChart();
      },
      true
    );


    function updateChart() {
      var renovationPrice = !acqChartsCtrl.immo.renovationPrice ? 0 : acqChartsCtrl.immo.renovationPrice;

      var pricePercentage = (acqChartsCtrl.immo.price * (100 / acqChartsCtrl.immo.total)),
        renovationPricePercentage = (renovationPrice * (100 / acqChartsCtrl.immo.total)),
        registrationTaxPricePercentage = (acqChartsCtrl.immo.registrationTax * (100 / acqChartsCtrl.immo.total)),
        variousFeesPercentage = (acqChartsCtrl.immo.variousFees * (100 / acqChartsCtrl.immo.total));

      acqChartsCtrl.doughnutData = {
        labels: [
          "Prix",
          "Montant des Travaux",
          "Droits d'enregistrements",
          "Frais divers"
        ],
        datasets: [
          {
            data: [acqChartsCtrl.immo.price, acqChartsCtrl.immo.renovationPrice, acqChartsCtrl.immo.registrationTax, acqChartsCtrl.immo.variousFees],
            backgroundColor: [
              dashboardColors.white,
              dashboardColors.blueStone,
              dashboardColors.surfieGreen,
              dashboardColors.silverTree

            ],
            hoverBackgroundColor: [
              colorHelper.shade(dashboardColors.white, 15),
              colorHelper.shade(dashboardColors.blueStone, 15),
              colorHelper.shade(dashboardColors.surfieGreen, 15),
              colorHelper.shade(dashboardColors.silverTree, 15)
            ],
            percentage: [pricePercentage, renovationPricePercentage, registrationTaxPricePercentage, variousFeesPercentage]
          }]
      };

      var ctx = document.getElementById('chart-area').getContext('2d');
      window.myDoughnut = new Chart(ctx, {
        type: 'doughnut',
        data: acqChartsCtrl.doughnutData,
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
