/**
 * @author a.bozga
 * created on 05.03.2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.funding')
      .service('Funding', Funding);

  /** @ngInject */
  function Funding($log) {

    var funding = {};

    return {
      saveFunding: saveFunding,
      getFunding: getFunding
    };

    function saveFunding(obj) {
      //$log.debug("Save immo object: ", obj);
      funding = obj;
    }

    function getFunding() {
      return funding;
    }

  }
})();
