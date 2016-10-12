'use strict';

angular.module('simpleforum')
  .controller('MainCtrl', [
    '$rootScope',
    '$scope',
    '$localStorage',
    function ($rootScope, $scope, $localStorage) {

      function hasToken(){
        $rootScope.token = $scope.token = !!$localStorage.user && !!$localStorage.user.token;
      }

      hasToken();
    }
  ]
);
