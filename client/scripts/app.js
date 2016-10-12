'use strict';

angular.module('simpleforum', [
    'ngStorage',
    'ngRoute',
    'ngMaterial'
  ])
  .config(['$routeProvider', '$httpProvider',
  function ($routeProvider,
    $httpProvider) {

    $routeProvider.
    when('/', {
      templateUrl: 'partials/topic.html',
      controller: 'TopicCtrl'
    }).
    when('/me', {
      templateUrl: 'partials/me.html',
      controller: 'HomeCtrl'
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
              config.headers.Authorization = 'qmagico ' + $localStorage.user.token;
            }
            return config;
          },
          'responseError': function (response) {
            if (response.status === 401 || response.status === 403) {
              $location.path('/signin');
            }
            return $q.reject(response);
          }
        };
      }
    ]);

  }]);
