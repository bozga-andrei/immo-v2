/**
 * @author a.bozga
 * created on 11.04.2017
 */

(function () {
  'use strict';

  var basic = {
    default: '#ffffff',
    defaultText: '#666666',
    border: '#dddddd',
    borderDark: '#aaaaaa'
  };

  // main functional color scheme
  var colorScheme = {
    primary: '#209e91',
    info: '#2dacd1',
    success: '#90b900',
    warning: '#dfb81c',
    danger: '#e85656'
  };

  // dashboard colors for charts
  var dashboardColors = {
    surfieGreen: '#0e8174',
    blueStone: '#005562',
    white: '#ffffff',
    silverTree: '#6eba8c',
    gossip: '#b9f2a1'
  };

  angular.module('BlurAdmin.theme')
    .provider('baConfig', configProvider);

  /** @ngInject */
  function configProvider(colorHelper) {
    var conf = {
      theme: {
        blur: false
      },
      colors: {
        default: basic.default,
        defaultText: basic.defaultText,
        border: basic.border,
        borderDark: basic.borderDark,

        primary: colorScheme.primary,
        info: colorScheme.info,
        success: colorScheme.success,
        warning: colorScheme.warning,
        danger: colorScheme.danger,

        primaryLight: colorHelper.tint(colorScheme.primary, 30),
        infoLight: colorHelper.tint(colorScheme.info, 30),
        successLight: colorHelper.tint(colorScheme.success, 30),
        warningLight: colorHelper.tint(colorScheme.warning, 30),
        dangerLight: colorHelper.tint(colorScheme.danger, 30),

        primaryDark: colorHelper.shade(colorScheme.primary, 15),
        infoDark: colorHelper.shade(colorScheme.info, 15),
        successDark: colorHelper.shade(colorScheme.success, 15),
        warningDark: colorHelper.shade(colorScheme.warning, 15),
        dangerDark: colorHelper.shade(colorScheme.danger, 15),

        dashboard: {
          surfieGreen: dashboardColors.surfieGreen,
          blueStone: dashboardColors.blueStone,
          white: dashboardColors.white,
          silverTree: dashboardColors.silverTree,
          gossip: dashboardColors.gossip
        }
      },
      amChartPieConfig: {
        type: 'pie',
        startEffect: "elastic",
        startDuration: 1,
        autoMargins: false,
        marginTop: 1,
        alpha: 0.9,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        labelRadius: 2,
        innerRadius: '50%',
        depth3D: 10,
        angle: 20,
        pullOutRadius: '20',
        pullOutDuration: 1,
        pullOutEffect: 'elastic',
        colors: Object.values(dashboardColors),
        balloonText: "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
        decimalSeparator: ',',
        labelsEnabled: true,
        maxLabelWidth: 150,
        addClassNames: true,
        color: basic.default,
        labelTickColor: basic.borderDark,
        valueField: 'value',
        titleField: 'price',
        export: {
          enabled: true
        },
        creditsPosition: 'bottom-left',
        valueAxes: {
          inside: true,
          labelsEnabled: false
        }
      }
    };

    conf.changeTheme = function(theme) {
      angular.merge(conf.theme, theme)
    };

    conf.changeColors = function(colors) {
      angular.merge(conf.colors, colors)
    };

    conf.$get = function () {
      delete conf.$get;
      return conf;
    };
    return conf;
  }
})();
