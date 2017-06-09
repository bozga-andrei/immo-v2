/**
 * Change top "Daily Downloads", "Active Users" values with animation effect
 */
(function () {
  'use strict';

  angular.module('Immo.theme')
      .directive('hideOnScroll', hideOnScroll);

  /** @ngInject */
  function hideOnScroll($window) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var current;
        current = $window.pageYOffset;
        angular.element($window).on('scroll', function() {
          var ref;
          if (($window.innerHeight + $window.pageYOffset) >= document.body.offsetHeight) {
            scope.scrolled = false;
          } else {
            scope.scrolled = (ref = this.pageYOffset > current) != null ? ref : {
              "true": false
            };
          }
          current = this.pageYOffset;
          return scope.$apply();
        });
      }
    };
  }

})();
