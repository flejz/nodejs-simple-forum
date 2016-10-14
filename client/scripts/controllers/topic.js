'use strict';

angular.module('simpleforum')
  .controller('TopicCtrl', [
    '$rootScope',
    '$scope',
    '$localStorage',
    '$location',
    '$mdDialog',
    'Cache',
    'Util',
    'TopicServices',
    'DialogEvents',
    function ($rootScope, $scope, $localStorage, $location, $mdDialog,
      Cache, Util, TopicServices, DialogEvents) {

      // Watching the root scope variable
      $rootScope.$watch('token', function () {
        $scope.token = $rootScope.token;
        load();
      });

      // Shows the detail of the topic
      $scope.detail = function (topic) {

        $location.path('/topic/' + topic.id);
      }

      // Inserting a new topic
      $scope.new = function (ev) {

        function callback(scope, dialog) {

          scope.loading = true;

          var data = {
            title: scope.data.title,
            description: scope.data.description
          }

          TopicServices.add(data, function (res) {

            load();

            dialog.hide();
            scope.loading = false;

          }, function (res) {

            $rootScope.error = 'Failed to add the topic';

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
          templateUrl: 'partials/topic/item.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        });
      }

      // Editing an existing topic
      $scope.edit = function (ev, topic) {

        function callback(scope, dialog) {
          scope.loading = true;

          var data = {
            id: scope.data.id,
            title: scope.data.title,
            description: scope.data.description
          }

          TopicServices.update(data, function (res) {
            load();
            dialog.hide();
            scope.loading = false;

          }, function (res) {

            $rootScope.error = 'Failed to update the topic';
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
          controller: DialogEvents(callback, Util.clone(topic)),
          templateUrl: 'partials/topic/item.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        });
      }

      // Deleting a topic
      $scope.delete = function (topic) {
        var confirm = $mdDialog.confirm()
          .title('Would you like to delete the topic?')
          .ariaLabel('Deletion')
          .ok('Yes')
          .cancel('No');

        $mdDialog.show(confirm).then(function () {

          TopicServices.delete(topic.id, function (res) {

            load();

          }, function (res) {
            $rootScope.error = 'Failed to update the topic';
          });
        });
      }

      // Formats the date and time
      $scope.formatDate = Util.formatDate
      $scope.formatTime = Util.formatTime

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
