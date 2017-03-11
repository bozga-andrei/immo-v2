/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.acquisition')
      .directive('acquisition', acquisition);

  /** @ngInject */
  function acquisition() {
    return {
      restrict: 'E',
      controller: 'AcquisitionCtrl',
      templateUrl: 'app/pages/acquisition/acquisition.html'
    };
  }
})();
