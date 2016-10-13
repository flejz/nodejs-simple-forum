'use strict';

angular.module('simpleforum')
  .factory('Static', [
    function () {

      return {
        //serviceUrl: "http://nodejs-simpleforum-backend.herokuapp.com",
        serviceUrl: "http://localhost:3000",
        tokenTag: 'qmagico'
      };
    }
  ]);
