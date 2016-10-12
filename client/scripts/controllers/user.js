'use strict';

angular.module('simpleforum')
  .controller('UserCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$localStorage',
    'UserServices',
    function ($rootScope, $scope, $location, $localStorage, UserServices) {

      function hasToken(){
        $rootScope.token = $scope.token = !!$localStorage.user && !!$localStorage.user.token;
      }

      $scope.signin = function () {

        var data = {
          username: $scope.username,
          password: $scope.password
        }

        UserServices.signin(data, function (user) {

            $localStorage.user = user;

            document.querySelector('.modal-backdrop').attributes["ng-hide"] = "token"

            hasToken();

        }, function (err) {
          $rootScope.error = 'Failed to signin';
        })
      };

      $scope.signup = function () {

        var data = {
          username: $scope.username,
          password: $scope.password
        }

        UserServices.save(data, function (user) {

            $localStorage.user = user;

            hasToken();

        }, function () {
          $rootScope.error = 'Failed to signup';
        })
      };

      $scope.logout = function () {

         delete $localStorage.user;

         hasToken();
      };

      hasToken();
    }
  ]
);
