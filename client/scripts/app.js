'use strict';

angular.module('simpleforum', [
    'ngStorage',
    'ngRoute',
    'ngMaterial'
  ])
  .config(['$routeProvider',
    '$httpProvider',
    function ($routeProvider, $httpProvider) {

      $routeProvider.
      when('/', {
        templateUrl: 'partials/topic/list.html',
        controller: 'TopicCtrl'
      }).
      when('/topic/:id', {
        templateUrl: 'partials/topic/detail.html',
        controller: 'MessageCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });

      $httpProvider.interceptors.push(['$q', '$location', '$localStorage',
        function ($q, $location, $localStorage) {
          return {
            'request': function (config) {
              config.headers = config.headers || {};
              if (!!$localStorage.user && !!$localStorage.user.token) {
                config.headers.Authorization = 'qmagico ' +
                  $localStorage.user.token;
              }
              return config;
            },
            'responseError': function (response) {
              return $q.reject(response);
            }
          };
        }
      ]);

    }
  ]);
