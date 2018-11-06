module.exports = function (app) {
  app.get('/view*', function (req, res, next) {
    req.user = {
      User_Name: "ella",
      full_name: "Маркетолог",
      interface: 2,
      pwd: "20ella18",
      userid: 9
    };
    res.locals.host = process.env.HOST || '';
    res.render('index2');
  });

  app.get('/:name', function (req, res) {
     var name = req.params.name;
     res.render(name);
  });
};
