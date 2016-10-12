'use strict';

angular.module('simpleforum')
  .controller('TopicCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$localStorage',
    'TopicServices',
    function ($rootScope, $scope, $location, $localStorage,
      TopicServices) {

      // Watching the root scope variable
      $rootScope.$watch('token', function () {
        $scope.token = $rootScope.token;
        load();
      });

      // Loads the topics
      function load() {

        if (!$scope.token) return;

        $scope.topics = [];
        $scope.loading = true;

        TopicServices.all(function (res) {

          $scope.topics = res.result;
          $scope.loading = false;

        }, function (err) {
          $scope.loading = false;
        })
      }

      // Formats the date
      $scope.formatDate = function (date) {
          return new Date(date).toLocaleDateString()
        }
        // Formats the time
      $scope.formatTime = function (date) {
        return new Date(date).toLocaleTimeString()
      }

      load();
    }
  ]);
