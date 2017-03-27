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

    var funChartsCtrl = this;

    funChartsCtrl.fin = $scope.funCtrl.fin;

    funChartsCtrl.transparent = baConfig.theme.blur;
    var dashboardColors = baConfig.colors.dashboard;


    // Watch when fin object is changing
    $scope.$watchCollection('funChartsCtrl.fin.taxLoanAmount',
      function (newVal, oldVal) {
        if (funChartsCtrl.fin.taxLoanAmount) {
          updateChart();
        }
      },
      true
    );


    function updateChart() {
      var loanRegistrationTaxPercentage = (funChartsCtrl.fin.loanRegistrationTax * (100 / funChartsCtrl.fin.taxLoanAmount));
      var mortgageRegistrationPercentage = (funChartsCtrl.fin.mortgageRegistration * (100 / funChartsCtrl.fin.taxLoanAmount));
      var conservativeSalaryPercentage = (funChartsCtrl.fin.conservativeSalary * (100 / funChartsCtrl.fin.taxLoanAmount));
      var loanNotaryFeesPercentage = (funChartsCtrl.fin.loanRegistrationNotaryFees * (100 / funChartsCtrl.fin.taxLoanAmount));
      var loanVariousFeesPercentage = (funChartsCtrl.fin.loanVariousFees * (100 / funChartsCtrl.fin.taxLoanAmount));

      funChartsCtrl.doughnutData = {
        labels: [
          "Droits d'enregistrement(1%)",
          "Droits d'inscription hypothécaire",
          "Salaire du Conservateur",
          "Honoraires du notaire TVAC",
          "Frais de dossier (acquises par la banque)"
        ],
        datasets: [
          {
            data: [funChartsCtrl.fin.loanRegistrationTax, funChartsCtrl.fin.mortgageRegistration, funChartsCtrl.fin.conservativeSalary, funChartsCtrl.fin.loanRegistrationNotaryFees, funChartsCtrl.fin.loanVariousFees],
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
        data: funChartsCtrl.doughnutData,
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
