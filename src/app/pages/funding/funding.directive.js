/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
      .directive('funding', funding);

  /** @ngInject */
  function funding() {
    return {
      restrict: 'E',
      controller: 'FundingCtrl',
      controllerAs: 'funCtrl',
      templateUrl: 'app/pages/funding/funding.html'
    };
  }
})();
