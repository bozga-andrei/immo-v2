/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('Immo.pages.acquisition')
      .directive('acquisition', acquisition);

  /** @ngInject */
  function acquisition() {
    return {
      restrict: 'E',
      controller: 'AcquisitionCtrl',
      controllerAs: 'acqCtrl',
      templateUrl: 'app/pages/acquisition/acquisition.html'
    };
  }
})();
