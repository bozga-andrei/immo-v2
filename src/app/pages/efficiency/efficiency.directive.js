/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('Immo.pages.efficiency')
      .directive('efficiency', efficiency);

  /** @ngInject */
  function efficiency() {
    return {
      restrict: 'E',
      controller: 'EfficiencyCtrl',
      controllerAs: 'effCtrl',
      templateUrl: 'app/pages/efficiency/efficiency.html'
    };
  }
})();
