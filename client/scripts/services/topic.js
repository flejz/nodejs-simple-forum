'use strict';

angular.module('simpleforum')
  .factory('TopicServices', [
    '$http',
    '$localStorage',
    function ($http, $localStorage) {

      var service = "http://nodejs-simpleforum-backend.herokuapp.com";

      return {
        all: function (success, error) {
          $http.get(service + '/topic')
            .success(success)
            .error(error)
        }
      };
    }
  ]);
