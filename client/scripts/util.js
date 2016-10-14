'use strict';

angular.module('simpleforum')
  .factory('Util', [
    function () {

      return {

        // Clones a object
        clone: function(obj){
          let cloned = {};
          for (var attr in obj){
            cloned[attr] = obj[attr]
          }
          return cloned;
        },

        // Formats the date
        formatDate: function (date) {
            return new Date(date).toLocaleDateString()
          },

        // Formats the time
        formatTime: function (date) {
          return new Date(date).toLocaleTimeString()
        }
      };
    }
  ]);
