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

    $scope.transparent = baConfig.theme.blur;
    var dashboardColors = baConfig.colors.dashboard;

    // Watch when fin object is changing
    $scope.$watchCollection('immo',
      function (newVal, oldVal) {
        if(!newVal || angular.equals(newVal, oldVal)){
          return; // simply skip that
        }

        var renovationPrice = !$scope.immo.renovationPrice ? 0 : $scope.immo.renovationPrice;

        var pricePercentage = ($scope.immo.price * (100 / $scope.immo.total)),
          renovationPricePercentage = (renovationPrice * (100 / $scope.immo.total)),
          registrationTaxPricePercentage = ($scope.immo.registrationTax * (100 / $scope.immo.total)),
          variousFeesPercentage = ($scope.immo.variousFees * (100 / $scope.immo.total));

        $scope.doughnutData = {
          labels: [
            "Prix",
            "Montant des Travaux",
            "Droits d'enregistrements",
            "Frais divers"
          ],
          datasets: [
            {
              data: [$scope.immo.price, $scope.immo.renovationPrice, $scope.immo.registrationTax, $scope.immo.variousFees],
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
          data: $scope.doughnutData,
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
      },
      true
    );






  }
})();
