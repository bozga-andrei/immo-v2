/**
 * @author a.bozga
 * created on 11.04.2017
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .config(config);

  /** @ngInject */
  function config(baConfigProvider, colorHelper, $provide, $mdThemingProvider) {
    $provide.decorator('$uiViewScroll', uiViewScrollDecorator);
    baConfigProvider.changeTheme({blur: true});

    baConfigProvider.changeColors({
      default: 'rgba(#000000, 0.2)',
      defaultText: '#ffffff',
      dashboard: {
        white: '#ffffff'
      }
    });

    //Angular Material config
    $mdThemingProvider.definePalette('blur', {
      '50': '209e91',
      '100': '209e92',
      '200': '209e93',
      '300': '209e94',
      '400': '209e91',
      '500': '209e95',
      '600': '209e96',
      '700': '209e97',
      '800': '209e98',
      '900': '209e99',
      'A100': 'ff8a80',
      'A200': 'ff5252',
      'A400': 'ff1744',
      'A700': 'd50000',
      'contrastDefaultColor': 'dark',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light

      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'],
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider
      .theme('default').dark()
      .primaryPalette('blur', {
        'default': '400'
      })
      .accentPalette('pink')
      .warnPalette('red')
      .backgroundPalette('blue-grey');


  }

  /** @ngInject */
  function uiViewScrollDecorator($delegate, $anchorScroll, baUtil) {
    return function (uiViewElement) {
      if (baUtil.hasAttr(uiViewElement, "autoscroll-body-top")) {
        $anchorScroll();
      } else {
        $delegate(uiViewElement);
      }
    };
  }
})();
