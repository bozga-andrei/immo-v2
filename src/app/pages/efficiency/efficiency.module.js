/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('Immo.pages.efficiency', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('efficiency', {
          url: '/efficiency',
          templateUrl: 'app/pages/efficiency/efficiency.html',
          controller: 'EfficiencyCtrl',
          controllerAs: 'effCtrl',
          title: 'Investissement',
          sidebarMeta: {
            icon: 'ion-arrow-graph-up-right',
            order: 0
          }
        });
  }

})();
