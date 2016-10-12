'use strict';

angular.module('simpleforum')
  .factory('UserServices', [
    '$http',
    '$localStorage',
    function ($http, $localStorage) {

      var service = "http://nodejs-simpleforum-backend.herokuapp.com";

      return {
        signin: function (data, success, error) {
          $http.post(service + '/signin', data)
            .success(success)
            .error(error)
        },
        signup: function (data, success, error) {
          $http.post(service + '/signup', data)
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
