'use strict';

angular.module('simpleforum')
  .controller('TopicCtrl', [
    '$rootScope',
    '$scope',
    '$localStorage',
    '$mdDialog',
    'TopicServices',
    'DialogEvents',
    function ($rootScope, $scope, $localStorage, $mdDialog,
      TopicServices, DialogEvents) {

      // Watching the root scope variable
      $rootScope.$watch('token', function () {
        $scope.token = $rootScope.token;
        load();
      });

      // Inserting a new topic
      $scope.new = function (ev) {

        function callback(scope, dialog) {

          scope.loading = true;

          var data = {
            title: scope.data.title,
            description: scope.data.description,
            message: scope.data.message
          }

          TopicServices.add(data, function (res) {

            load();

            dialog.hide();
            scope.loading = false;

          }, function (res) {

            $rootScope.error = 'Failed to add the topic';

            $scope.loading = false;
            if (!res)
                res = {error:{message:'Fail!'}};
            scope.error = res.error;
            scope.errorMsg = res.error.message;
          });
        }

        // Shows the dialog
        $mdDialog.show({
          controller: DialogEvents(callback),
          templateUrl: 'partials/topic/item.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        });
      }

      // Editing an existing topic
      $scope.edit = function (topic) {
        $scope.topic = topic;

        function callback(scope, dialog){
            dialog.hide();
        }

        // Shows the dialog
        $mdDialog.show({
          controller: DialogEvents(callback, topic),
          templateUrl: 'partials/topic/item.html',
          parent: angular.element(document.body),
          clickOutsideToClose: false
        });
      }

      // Formats the date
      $scope.formatDate = function (date) {
          return new Date(date).toLocaleDateString()
        }
        // Formats the time
      $scope.formatTime = function (date) {
        return new Date(date).toLocaleTimeString()
      }

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

      // Loadign the topics
      load();
    }
  ]);
