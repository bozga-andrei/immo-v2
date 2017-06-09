/**
 * @author a.bozga
 * created on 08/03/17
 */
(function () {
  'use strict';

  angular.module('Immo.pages.acquisition')
    .controller('chartJs1DCtrl', chartJs1DCtrl);

  /** @ngInject */
  function chartJs1DCtrl($scope, $log, baConfig, Acquisition) {

    $scope.immo = Acquisition.getImmo();
    $log.info("chartJs1DCtrl immo is: ", $scope.immo);

    var layoutColors = baConfig.colors;

    $scope.labels =["Prix", "Montant des Travaux", "Droits d'enregistrements", "Frais divers"];
    $scope.data = [$scope.immo.price, $scope.immo.renovationPrice, $scope.immo.registrationTax, $scope.immo.variousFees];
    $scope.options = {
      elements: {
        arc: {
          borderWidth: 1
        }
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: layoutColors.defaultText
        }
      }
    };

    // Watch when fin object is changing
    $scope.$watchCollection('immo',
      function (newVal, oldVal) {
        $log.info("Watch");

        var pricePercentage = ($scope.immo.price * (100 / $scope.immo.total));
        var renovationPricePercentage = ($scope.immo.renovationPrice * (100 / $scope.immo.total));
        var registrationTaxPricePercentage = ($scope.immo.registrationTax * (100 / $scope.immo.total));
        var variousFeesPercentage = ($scope.immo.variousFees * (100 / $scope.immo.total));

        $scope.labels =[
          "Prix: " + pricePercentage.toFixed(2) + "%",
          "Montant des Travaux: " + renovationPricePercentage.toFixed(2) + "%",
          "Droits d'enregistrements: " + registrationTaxPricePercentage.toFixed(2) + "%",
          "Frais divers: " + variousFeesPercentage.toFixed(2) + "%"
        ];
        $scope.data = [$scope.immo.price, $scope.immo.renovationPrice, $scope.immo.registrationTax, $scope.immo.variousFees];
      },
      true
    );
  }

})();
