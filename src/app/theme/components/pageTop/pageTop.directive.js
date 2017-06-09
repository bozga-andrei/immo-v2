/**
 * @author a.bozga
 * created on 25.04.2017
 */
(function () {
  'use strict';

  angular.module('Immo.theme.components')
      .directive('pageTop', pageTop);

  /** @ngInject */
  function pageTop() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/pageTop/pageTop.html'
    };
  }

})();
