/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('Immo.pages', [
    'ui.router',
    'Immo.pages.acquisition',
    'Immo.pages.funding',
    'Immo.pages.efficiency'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/acquisition');

  }

})();
