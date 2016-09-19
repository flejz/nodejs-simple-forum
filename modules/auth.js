module.exports = function (req, res, next) {

  if (req.session == null || req.session.loggedUser == null)
    res.redirect('/user/login')
  else
    next()
}
