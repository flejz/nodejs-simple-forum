'use strict';

angular.module('simpleforum')
  .factory('TopicServices', [
    '$http',
    'Static',
    function ($http, Static) {

      return {
        all: function (success, error) {
          $http.get(Static.serviceUrl + '/topic')
            .success(success)
            .error(error)
        },
        add: function (data, success, error) {
          $http.post(Static.serviceUrl + '/topic', data)
            .success(success)
            .error(error)
        }
      };
    }
  ]);
