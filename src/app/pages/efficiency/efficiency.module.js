/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.efficiency', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('efficiency', {
          url: '/efficiency',
          templateUrl: 'app/pages/efficiency/efficiency.html',
          title: 'Investissement',
          sidebarMeta: {
            icon: 'ion-arrow-graph-up-right',
            order: 0
          }
        });
  }

})();
