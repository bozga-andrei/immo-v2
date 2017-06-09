/**
 * @author a.bozga
 * created on 05.03.2017
 */
(function () {
  'use strict';

  angular.module('Immo.pages.acquisition')
      .service('Acquisition', Acquisition);

  /** @ngInject */
  function Acquisition($log) {

    var immo = {};

    return {
      saveImmo: saveImmo,
      getImmo: getImmo
    };

    function saveImmo(obj) {
      //$log.info("Save immo object: ", obj);
      immo = obj;
    }

    function getImmo() {
      //$log.info("Get immo object: ", immo);
      return immo;
    }

  }
})();
