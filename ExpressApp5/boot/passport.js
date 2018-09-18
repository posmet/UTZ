//boot/passport.js
var config = require("nconf");
var passport = require('passport');
var AuthLocalStrategy = require('passport-local').Strategy;

passport.use('local', new AuthLocalStrategy(
    function (username, password, done) {
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
            if (err) { console.log(err); return; }
            console.log("CONNECT");
            var request = new sql.Request(connection);

            var sqlString = "SELECT u.userid,user_name,full_name,p.ph_id,ph_name from ref_users u inner join roles r on r.userid=u.userid inner join pharms p on p.ph_id = r.ph_id where user_name='" + username + "' and pwd = '" + password + "'";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { console.log(err); return; };
                console.log(rs);
                console.log(rs.length);
                if (rs.length>0) {
                    return done(null, {
                        username: username,
                        full_name: rs[0][2],
                        profileUrl: "url_to_profile",
                        userid: rs[0][0],
                        ph_id: rs[0][3],
                        ph_name: rs[0][4]
                    });
                }
                return done(null, false, {
                    message: 'Неверный логин или пароль'
                });
            });
        })
    }
));



passport.serializeUser(function (user, done) {
    done(null, JSON.stringify(user));
});


passport.deserializeUser(function (data, done) {
    try {
        done(null, JSON.parse(data));
    } catch (e) {
        done(err)
    }
});

module.exports = function (app) {
};