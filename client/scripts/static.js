'use strict';

angular.module('simpleforum')
  .factory('Static', [
    function () {

      return {
        serviceUrl: "http://nodejs-simpleforum-backend.herokuapp.com",
        tokenTag: 'qmagico'
      };
    }
  ]);
