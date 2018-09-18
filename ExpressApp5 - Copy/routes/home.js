﻿module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {
            user: req.user
        })
    });

    app.get('/partials/:name', function (req, res) {
        var name = req.params.name;
        res.render(name);
    });
}
