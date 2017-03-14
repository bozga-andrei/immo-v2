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

    var vm = this;

    vm.immo = $scope.acqCtrl.immo;

    vm.transparent = baConfig.theme.blur;
    var dashboardColors = baConfig.colors.dashboard;

    // Watch when fin object is changing
    $scope.$watchCollection(angular.bind(this, function () {
        return vm.immo;
      }), function (newVal, oldVal) {
        if (!newVal || !newVal.total) {
          return; // simply skip that
        }
        updateChart();
      },
      true
    );


    function updateChart() {
      var renovationPrice = !vm.immo.renovationPrice ? 0 : vm.immo.renovationPrice;

      var pricePercentage = (vm.immo.price * (100 / vm.immo.total)),
        renovationPricePercentage = (renovationPrice * (100 / vm.immo.total)),
        registrationTaxPricePercentage = (vm.immo.registrationTax * (100 / vm.immo.total)),
        variousFeesPercentage = (vm.immo.variousFees * (100 / vm.immo.total));

      vm.doughnutData = {
        labels: [
          "Prix",
          "Montant des Travaux",
          "Droits d'enregistrements",
          "Frais divers"
        ],
        datasets: [
          {
            data: [vm.immo.price, vm.immo.renovationPrice, vm.immo.registrationTax, vm.immo.variousFees],
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
        data: vm.doughnutData,
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
