'use strict';

angular.module('simpleforum')
  .factory('Util', [
    function () {

      return {
        clone: function(obj){
          let cloned = {};
          for (var attr in obj){
            cloned[attr] = obj[attr]
          }
          return cloned;
        }
      };
    }
  ]);
