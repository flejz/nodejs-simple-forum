'use strict';

angular.module('simpleforum')
  .controller('MessageCtrl', [
    '$rootScope',
    '$scope',
    '$localStorage',
    '$location',
    '$mdDialog',
    '$routeParams',
    'Cache',
    'Util',
    'TopicServices',
    'MessageServices',
    'DialogEvents',
    function($rootScope, $scope, $localStorage, $location, $mdDialog,
      $routeParams,
      Cache, Util, TopicServices, MessageServices, DialogEvents) {

      // Watching the root scope variable
      $rootScope.$watch('token', function() {
        $scope.token = $rootScope.token;
        if (!$scope.token)
          $location.path('/');
      });

      // Inserting a new message
      $scope.new = function(ev) {

        function callback(scope, dialog) {

          scope.loading = true;

          var data = {
            title: scope.data.title,
            description: scope.data.description
          }

          MessageServices.add(data, function(res) {

            load();

            dialog.hide();
            scope.loading = false;

          }, function(res) {

            $rootScope.error = 'Failed to add the message';

            $scope.loading = false;
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
          templateUrl: 'partials/message/item.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        });
      }

      // Editing an existing message
      $scope.edit = function(message) {

        function callback(scope, dialog) {
          scope.loading = true;

          var data = {
            id: scope.data.id,
            title: scope.data.title,
            description: scope.data.description
          }

          MessageServices.update(data, function(res) {
            load();
            dialog.hide();
            scope.loading = false;

          }, function(res) {

            $rootScope.error = 'Failed to update the message';
            $scope.loading = false;
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
          controller: DialogEvents(callback, Util.clone(message)),
          templateUrl: 'partials/topic/item.html',
          parent: angular.element(document.body),
          clickOutsideToClose: false
        });
      }

      // Deleting a message
      $scope.delete = function(message) {
        var confirm = $mdDialog.confirm()
          .title('Would you like to delete the message?')
          .ariaLabel('Deletion')
          .ok('Yes')
          .cancel('No');

        $mdDialog.show(confirm).then(function() {

          MessageServices.delete(message.id, function(res) {

            load();
            scope.loading = false;

          }, function(res) {

            $rootScope.error = 'Failed to update the message';
          });
        });
      }

      // Formats the date and time
      $scope.formatDate = Util.formatDate
      $scope.formatTime = Util.formatTime

      // Loads the topic and topic's messages
      function load() {

        if (!$routeParams.id) return;

        $scope.loading = true;

        TopicServices.get($routeParams.id, function(res) {

          $scope.topic = res.result;

          $scope.loading = false;

        }, function(err) {
          $scope.loading = false;
        });
      }

      // Loadign the topic
      load();

    }
  ]);
