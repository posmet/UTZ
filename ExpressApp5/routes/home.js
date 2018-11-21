const path = require('path');
const dist = path.join(__dirname + "/..", 'dist');

module.exports = function (app) {
  app.get('/view*', function (req, res, next) {
    res.sendFile(path.join(dist, 'index.html'));
  });
};
