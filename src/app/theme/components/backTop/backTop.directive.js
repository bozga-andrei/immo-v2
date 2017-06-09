/**
 * @author a.bozga
 * created on 25.04.2017
 */
(function () {
  'use strict';

  angular.module('Immo.theme.components')
      .directive('backTop', backTop);

  /** @ngInject */
  function backTop() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/backTop/backTop.html',
      controller: function () {
        $('#backTop').backTop({
          'position': 200,
          'speed': 100
        });
      }
    };
  }

})();
