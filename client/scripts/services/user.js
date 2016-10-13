'use strict';

angular.module('simpleforum')
  .factory('UserServices', [
    '$http',
    'Static',
    function ($http, Static) {

      return {
        signin: function (data, success, error) {
          $http.post(Static.serviceUrl + '/signin', data)
            .success(success)
            .error(error)
        },
        signup: function (data, success, error) {
          $http.post(Static.serviceUrl + '/signup', data)
            .success(success)
            .error(error)
        },
        logout: function (success) {
          delete $localStorage.user;
          success();
        }
      };
    }
  ]);
