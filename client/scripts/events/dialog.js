'use strict';

angular.module('simpleforum')
  .factory('DialogEvents', [
    function () {

      return function (callback) {
        return function ($scope, $mdDialog) {
          $scope.hide = function () {
            $mdDialog.hide();
          };

          $scope.cancel = function () {
            $mdDialog.cancel();
          };

          $scope.answer = function (answer) {
            callback($scope, $mdDialog, answer);
          };
        }
      }
    }
  ]);
