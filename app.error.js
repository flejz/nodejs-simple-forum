module.exports = function auth() {
  'use strict'

  return {
    parseError: function(err, req, res, next) {
      res.status(err.status || 500)
      res.json({
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
      })
    },

    handle: function (res, err, status) {

      return res.status(status || 500).json({
        error: {
          message: err.details ? err.details.message : (err.msg ? err.msg :err.message)
        }
      })
    }
  }
}
