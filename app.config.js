module.exports = {
  port: process.env.PORT || '3000',
  token_tag: process.env.TOKEN_TAG || 'qmagico',
  token_secret: process.env.TOKEN_SECRET || 'qmagico_challenge',
  mockData: false,
  mongoUrl: 'mongodb://demo:demo@ds035846.mlab.com:35846/qmagico-challenge'
}
