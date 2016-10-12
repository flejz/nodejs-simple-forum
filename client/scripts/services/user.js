'use strict';

angular.module('simpleforum')
  .factory('UserServices', [
    '$http',
    '$localStorage',
    function ($http, $localStorage) {

      var service = "http://nodejs-simpleforum-backend.herokuapp.com";

      function changeUser(user) {
        angular.extend(currentUser, user);
      }

      function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
          case 0:
            break;
          case 2:
            output += '==';
            break;
          case 3:
            output += '=';
            break;
          default:
            throw 'Illegal base64url string!';
        }
        return window.atob(output);
      }

      function getUserFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
          var encoded = token.split('.')[1];
          user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
      }

      //var currentUser = getUserFromToken();

      return {
        signin: function (data, success, error) {
          $http.post(service + '/signin', data).success(success).error(
            error)
        },
        signup: function (data, success, error) {
          $http.post(service + '/signup', data).success(success).error(
            error)
        },
        logout: function (success) {
          delete $localStorage.user;
          success();
        }
      };
    }
  ]);
