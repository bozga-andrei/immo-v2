/**
 * @author a.bozga
 * created on 11.04.2017
 */
(function () {
  'use strict';

  angular.module('Immo.theme')
    .run(themeRun);

  /** @ngInject */
  function themeRun($timeout, $rootScope, layoutPaths, preloader, $q, baSidebarService, themeLayoutSettings) {
    var whatToWait = [];

    var theme = themeLayoutSettings;
    if (theme.blur) {
      if (theme.mobile) {
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg-mobile.jpg'));
      } else {
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg.jpg'));
        whatToWait.unshift(preloader.loadImg(layoutPaths.images.root + 'blur-bg-blurred.jpg'));
      }
    }

    $q.all(whatToWait).then(function () {
      $rootScope.$pageFinishedLoading = true;
    });

    $timeout(function () {
      if (!$rootScope.$pageFinishedLoading) {
        $rootScope.$pageFinishedLoading = true;
      }
    }, 3000);

    $rootScope.$baSidebarService = baSidebarService;
  }

})();
