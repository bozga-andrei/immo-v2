/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
    .controller('TaxLoanAmountPieChartCtrl', TaxLoanAmountPieChartCtrl);

  /** @ngInject */
  function TaxLoanAmountPieChartCtrl($scope, $log, baConfig) {

    var taxLoanAmountPieChartCtrl = this;

    taxLoanAmountPieChartCtrl.fin = $scope.funCtrl.fin;

    const layoutColors = baConfig.colors,
      dashboardColors = baConfig.colors.dashboard;

    taxLoanAmountPieChartCtrl.chartColors = [
      dashboardColors.surfieGreen,
      dashboardColors.blueStone,
      dashboardColors.white,
      dashboardColors.silverTree,
      dashboardColors.gossip];

    updateChart();
    updateLegend();

    // Watch when fin object is changing
    $scope.$watchCollection('taxLoanAmountPieChartCtrl.fin.taxLoanAmount',
      function (newVal, oldVal) {
        if (taxLoanAmountPieChartCtrl.fin.taxLoanAmount) {
          if (angular.equals(newVal, oldVal)) {
            return; // simply skip that
          }
          updateChart();
          updateLegend();
        }
      },
      true
    );


    function updateChart() {

      taxLoanAmountPieChartCtrl.chartData = [
        {
          price: 'Droits d\'enregistrement(1%)',
          value: $scope.funCtrl.fin.loanRegistrationTax
        },
        {
          price: 'Droits d\'inscription hypothécaire',
          value: $scope.funCtrl.fin.mortgageRegistration
        },
        {
          price: 'Salaire du Conservateur',
          value: $scope.funCtrl.fin.conservativeSalary
        },
        {
          price: 'Honoraires du notaire',
          value: $scope.funCtrl.fin.loanRegistrationNotaryFees
        },
        {
          price: 'Frais de dossier',
          value: $scope.funCtrl.fin.loanVariousFees
        }
      ];

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
        colors: taxLoanAmountPieChartCtrl.chartColors,
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
          text: "Frais sur emprunt",
          color: layoutColors.defaultText
        }, {
          y: '50%',
          align: 'center',
          size: 15,
          text: parseInt($scope.funCtrl.fin.taxLoanAmount||0) + '€',
          color: layoutColors.defaultText
        }],
        dataProvider: taxLoanAmountPieChartCtrl.chartData,
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

    function updateLegend(){
      const loanRegistrationTaxPercentage = (taxLoanAmountPieChartCtrl.fin.loanRegistrationTax * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        mortgageRegistrationPercentage = (taxLoanAmountPieChartCtrl.fin.mortgageRegistration * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        conservativeSalaryPercentage = (taxLoanAmountPieChartCtrl.fin.conservativeSalary * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        loanNotaryFeesPercentage = (taxLoanAmountPieChartCtrl.fin.loanRegistrationNotaryFees * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount)),
        loanVariousFeesPercentage = (taxLoanAmountPieChartCtrl.fin.loanVariousFees * (100 / taxLoanAmountPieChartCtrl.fin.taxLoanAmount));


      taxLoanAmountPieChartCtrl.legend = {
        labels: [
          "Droits d'enregistrement(1%)",
          "Droits d'inscription hypothécaire",
          "Salaire du Conservateur",
          "Honoraires du notaire TVAC",
          "Frais de dossier"
        ],
        backgroundColor: taxLoanAmountPieChartCtrl.chartColors,
        percentage: [loanRegistrationTaxPercentage, mortgageRegistrationPercentage, conservativeSalaryPercentage, loanNotaryFeesPercentage, loanVariousFeesPercentage]
      };

    }


  }
})();