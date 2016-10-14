'use strict';

angular.module('simpleforum')
  .controller('MainCtrl', [
    '$rootScope',
    '$scope',
    '$localStorage',
    '$location',
    '$mdDialog',
    'UserServices',
    'DialogEvents',
    function($rootScope, $scope, $localStorage, $location, $mdDialog,
      UserServices, DialogEvents) {

      // Validates if the context has the token
      function hasToken() {
        $rootScope.token = $scope.token = !!$localStorage.user && !!
          $localStorage.user.token;
        $scope.user = !!$rootScope.token ? $localStorage.user : null;
      }

      $scope.home = function() {
        $location.path('/');
      }

      // Request the sign in
      $scope.signin = function(ev) {

        function callback(scope, dialog) {

          scope.error = false;
          scope.loading = true;

          var data = {
            username: scope.username,
            password: scope.password
          }

          UserServices.signin(data, function(res) {

            $localStorage.user = res.result;

            dialog.hide();
            scope.loading = false;

            hasToken();

          }, function(res) {
            $rootScope.error = 'Failed to signin';

            scope.loading = false;
            if (!res)
              res = {
                error: {
                  message: 'Fail!'
                }
              };
            scope.error = res.error;
            scope.errorMsg = res.error.message;
          });
        }

        // Shows the dialog
        $mdDialog.show({
          controller: DialogEvents(callback),
          templateUrl: 'partials/signin.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        });
      };

      // Requests the sign up
      $scope.signup = function(ev) {

        function callback(scope, dialog) {

          scope.error = false;
          scope.loading = true;

          var data = {
            name: scope.name,
            username: scope.username,
            password: scope.password,
            passwordMatch: scope.passwordMatch,
            isAdm: scope.isAdm
          }

          UserServices.signup(data, function(res) {

            $localStorage.user = res.result;

            dialog.hide();
            scope.loading = false;

            hasToken();

          }, function(res) {
            $rootScope.error = 'Failed to signup';

            scope.loading = false;
            if (!res)
              res = {
                error: {
                  message: 'Fail!'
                }
              };
            scope.error = res.error;
            scope.errorMsg = res.error.message;
          });
        }

        // Shows the dialog
        $mdDialog.show({
          controller: DialogEvents(callback),
          templateUrl: 'partials/signup.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        });
      };

      // Logs out
      $scope.logout = function() {

        delete $localStorage.user;

        hasToken();
      };

      hasToken();
    }
  ]);
