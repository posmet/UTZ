module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index2', {
            user: req.user
        })
    });
    app.get('/view1', function (req, res) {
        res.render('index2', {
            user: req.user
        })
    });
    app.get('/view3', function (req, res) {
        res.render('index2', {
            user: req.user
        })
    });
    app.get('/view4', function (req, res) {
        res.render('index2', {
            user: req.user
        })
    });
    app.get('/view7', function (req, res) {
        res.render('index2', {
            user: req.user
        })
    });
    app.get('/view8', function (req, res) {
        res.render('index2', {
            user: req.user
        })
    });
    app.get('/view11', function (req, res) {
        res.render('index2', {
            user: req.user
        })
    });
    app.get('/view12', function (req, res) {
        res.render('index2', {
            user: req.user
        })
    });
    app.get('/view13', function (req, res) {
        res.render('index2', {
            user: req.user
        })
    });

    app.get('/:name', function (req, res) {
        var name = req.params.name;
        res.render(name);
    });
}
