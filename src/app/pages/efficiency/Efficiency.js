/**
 * @author a.bozga
 * created on 05.03.2017
 */
(function () {
  'use strict';

  angular.module('Immo.pages.efficiency')
      .service('Efficiency', Efficiency);

  /** @ngInject */
  function Efficiency($log) {

    var efficiency = {};

    return {
      saveEfficiency: saveEfficiency,
      getEfficiency: getEfficiency
    };

    function saveEfficiency(obj) {
      //$log.debug("Save efficiency object: ", obj);
      efficiency = obj;
    }

    function getEfficiency() {
      return efficiency;
    }

  }
})();
