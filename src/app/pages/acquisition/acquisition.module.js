/**
 * @author a.bozga
 * created on 03.03.2017
 */
(function () {
  'use strict';

  angular.module('Immo.pages.acquisition', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $logProvider) {
    $logProvider.debugEnabled(true);

    $stateProvider
      .state('acquisition', {
        url: '/acquisition',
        templateUrl: 'app/pages/acquisition/acquisition.html',
        controller: 'AcquisitionCtrl',
        controllerAs: 'acqCtrl',
        title: 'Acquisition',
        sidebarMeta: {
          icon: 'ion-android-home',
          order: 0
        }
      });
  }

})();
