/*
 * Serve JSON to our AngularJS client
 */
module.exports = function (app) {
    app.get('/api/name', function (req, res) {
        res.json({
            name: 'Управление товарными запасами'
        });
    });

    /*
     * Connect to mssql database 
     */


    app.get('/api/result', function (req, res) {
        var sql = require('mssql');

        var config = {
            user: 'online',
            password: 'njkcnsq',
            server: 'ga02.5dd.ru',
            database: 'REQUEST',
            options: { encrypt: false }
        };

        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);

            var sqlString = 'SELECT * from pharms';
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.json(rs);
            });
        });
    });
    app.get('/api/resultmtrx', function (req, res) {
        var sql = require('mssql');

        var config = {
            user: 'online',
            password: 'njkcnsq',
            server: 'ga02.5dd.ru',
            database: 'REQUEST',
            options: { encrypt: false }
        };

        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);

            var sqlString = 'SELECT * from matrix where ph_id=1';
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.json(rs);
            });
        });
    });
    app.get('/api/resultrq', function (req, res) {
        var sql = require('mssql');

        var config = {
            user: 'online',
            password: 'njkcnsq',
            server: 'ga02.5dd.ru',
            database: 'REQUEST',
            options: { encrypt: false }
        };

        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);

            var sqlString = 'SELECT * from matrix_view_e where [Ph_ID]=1 and Req>0';
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.json(rs);
            });
        });
    });
};

