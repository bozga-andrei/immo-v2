/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
    .controller('FundingChartsCtrl', FundingChartsCtrl);

  /** @ngInject */
  function FundingChartsCtrl($scope, $log, baConfig, colorHelper) {

    $scope.transparent = baConfig.theme.blur;
    var dashboardColors = baConfig.colors.dashboard;

    //updateChart();

    // Watch when fin object is changing
    $scope.$watchCollection('fin',
      function (newVal, oldVal) {
        /*if(!newVal || angular.equals(newVal, oldVal)){
         return; // simply skip that
         }*/
        if ($scope.fin.taxLoanAmount) {
          updateChart();
        }
      },
      true
    );


    function updateChart() {
      var loanRegistrationTaxPercentage = ($scope.fin.loanRegistrationTax * (100 / $scope.fin.taxLoanAmount));
      var mortgageRegistrationPercentage = ($scope.fin.mortgageRegistration * (100 / $scope.fin.taxLoanAmount));
      var conservativeSalaryPercentage = ($scope.fin.conservativeSalary * (100 / $scope.fin.taxLoanAmount));
      var loanNotaryFeesPercentage = ($scope.fin.loanNotaryFees * (100 / $scope.fin.taxLoanAmount));
      var loanVariousFeesPercentage = ($scope.fin.loanVariousFees * (100 / $scope.fin.taxLoanAmount));

      $scope.doughnutData = {
        labels: [
          "Droits d'enregistrement(1%)",
          "Droits d'inscription hypothécair",
          "Salaire du Conservateur",
          "Honoraires du notaire TVAC",
          "Frais de dossier (acquises par la banque)"
        ],
        datasets: [
          {
            data: [$scope.fin.loanRegistrationTax, $scope.fin.mortgageRegistration, $scope.fin.conservativeSalary, $scope.fin.loanNotaryFees, $scope.fin.loanVariousFees],
            backgroundColor: [
              dashboardColors.white,
              dashboardColors.blueStone,
              dashboardColors.surfieGreen,
              dashboardColors.silverTree,
              dashboardColors.gossip

            ],
            hoverBackgroundColor: [
              colorHelper.shade(dashboardColors.white, 15),
              colorHelper.shade(dashboardColors.blueStone, 15),
              colorHelper.shade(dashboardColors.surfieGreen, 15),
              colorHelper.shade(dashboardColors.silverTree, 15),
              colorHelper.shade(dashboardColors.gossip, 15)
            ],
            percentage: [loanRegistrationTaxPercentage, mortgageRegistrationPercentage, conservativeSalaryPercentage, loanNotaryFeesPercentage, loanVariousFeesPercentage]
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


    }


  }
})();
