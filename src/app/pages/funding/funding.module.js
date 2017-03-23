/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('funding', {
          url: '/funding',
          templateUrl: 'app/pages/funding/funding.html',
          controller: 'FundingCtrl',
          controllerAs: 'funCtrl',
          title: 'Financement',
          sidebarMeta: {
            icon: 'ion-social-euro-outline',
            order: 0
          }
        });
  }

})();
