'use strict';

angular.module('simpleforum')
  .factory('MessageServices', [
    '$http',
    'Static',
    function ($http, Static) {

      return {
        add: function (data, success, error) {
          $http.post(Static.serviceUrl + '/message', data)
            .success(success)
            .error(error)
        },
        update: function (data, success, error) {
          $http.put(Static.serviceUrl + '/message', data)
            .success(success)
            .error(error)
        },
        delete: function (id, success, error) {
          $http.delete(Static.serviceUrl + '/message', {params: {id: id}})
            .success(success)
            .error(error)
        }
      };
    }
  ]);
