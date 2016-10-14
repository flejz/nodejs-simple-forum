'use strict';

angular.module('simpleforum')
  .factory('Cache', function() {

    var cached = {}
    function it(data) {
      if (data)
        cached = data;
      return cached;
    }

    return {
      it: it
    }
  })
