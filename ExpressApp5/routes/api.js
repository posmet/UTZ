/*
 * Serve JSON to our AngularJS client
 */


module.exports = function (app) {
    const config = {
        user: 'online',
        password: 'njkcnsq',
        server: 'ga02.5dd.ru',
        database: 'REQUEST',
        connectionTimeout: 180000,
        requestTimeout: 180000,
        options: {
            encrypt: false,
            connectionTimeout: 180000,
            requestTimeout: 180000
}
    };
    app.get('/api/name', function (req, res) {
        var sql = require('mssql');


        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            if (!req.user) { res.redirect('/'); return; };
            if (!("username" in req.user)) { res.redirect('/'); return; };
            var sqlString = "SELECT * from ref_users where User_Name='" + req.user.username + "'";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.status(200);
               // if (length(rs) > 0) {
                    res.json(rs[0]);
               // }
            });
        });
    });

    app.get('/api/sentupdate', function(req,res) {
        res.json({
            name: 'test'
        });
    });
    /*
     * Connect to mssql database 
     */


    app.get('/api/result', function (req, res) {
        var sql = require('mssql');

       var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            if (!req.user) { res.redirect('/'); return; };
            if (!("username" in req.user)) { res.redirect('/'); return; };
            var sqlString = "SELECT * from pharmsByUser where User_Name='" + req.user.username + "'";
//            var sqlString = "SELECT * from pharmsByUser where User_Name='ella'";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.status(200);
                res.json(rs);
            });
        });
    });
    app.get('/api/resultmtrx/:pharmid', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);

            var sqlString = 'SELECT *, ROUND(CalcVel*30000,0)/1000 as CalcVel30 from matrix where ph_id=' + req.params.pharmid + ' order by Gr_Name';
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.status(200);
                res.json(rs);
            });
        });
    });
    app.get('/api/resultmtrxa/:pharmid/:grid', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);

            var sqlString = 'SELECT matrix.*, ROUND(CalcVel*30000,0)/1000 as CalcVel30,Ph_Name from matrix inner join pharms on pharms.Ph_ID = matrix.Ph_ID';
            if ((req.params.grid != 0) || (req.params.pharmid != 0)) {
                sqlString = sqlString + ' where ';
            }
            if (req.params.pharmid != 0) {
                sqlString = sqlString + 'matrix.ph_id = ' + req.params.pharmid 
            }
            if (req.params.grid != 0) {
                if (req.params.pharmid != 0) {
                    sqlString = sqlString + ' and ';
                };
                sqlString = sqlString + ' Gr_ID = ' + req.params.grid;
            }
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.status(200);
                res.json(rs);
            });
        });
    });
    app.post('/api/resultmtrxa/', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }
            console.log(req.body);
            var request = new sql.Request(connection);

            var sqlString = 'SELECT * from matrix_cez';
            if ((req.body.grid != 0) || (req.body.pharmid != 0)) {
                sqlString = sqlString + ' where ';
            }
            if (req.body.pharmid != 0) {
                sqlString = sqlString + 'ph_id = ' + req.body.pharmid
            }
            if (req.body.grid != 0) {
                if (req.body.pharmid != 0) {
                    sqlString = sqlString + ' and ';
                };
                if (!Number.isInteger(req.body.grid)) {
                    req.body.grid = req.body.grid.replace(' ', '%');
                    sqlString = sqlString + " Gr_Name  Like '%" + req.body.grid + "%'";
                }
                else
                    sqlString = sqlString + ' Gr_ID = ' + req.body.grid;
            }
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.status(200);
                res.json(rs);
            });
        });
    });
    app.post('/api/resultmtrxf/', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }
            console.log(req.body);
            var request = new sql.Request(connection);

            var sqlString = "SELECT * from matrix_cez where Filial ='" + req.body.filial + "'";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.status(200);
                res.json(rs);
            });
        });
    });
    app.post('/api/resultmtrxn/', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }
            console.log(req.body);
            var request = new sql.Request(connection);

            var sqlString = 'SELECT * from matrix_cez_n';
            if (req.body.conds.length > 0) {
                sqlString = sqlString + ' where ';
                sqlString = sqlString + req.body.conds.reduce(function (prev, curr) {
                    var Whr = prev;
                    if (prev != '')
                        Whr = Whr + ' and ';
                    Whr = Whr + curr.field;
                    switch (curr.cond) {
                        case 'eq':
                            Whr = Whr + " = '" + curr.value + "'";
                            break;
                        case 'neq':
                            Whr = Whr + " <> '" + curr.value + "'";
                            break;
                        case 'cn':
                            Whr = Whr + " Like '%" + curr.value + "%'";
                            break;
                        case 'ncn':
                            Whr = Whr + " = '" + curr.value + "'";
                            break;
                        case 'nl':
                            Whr = Whr + " = ''";
                            break;
                        case 'nnl':
                            Whr = Whr + " <> ''";
                            break;
                        case 'gt':
                            Whr = Whr + " > ''";
                            break;
                        case 'lt':
                            Whr = Whr + " < ''";
                            break;
                    }
                    return Whr;

                }, "")
            }

            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.status(200);
                res.json(rs);
            });
        });
    });
    app.get('/api/resultmtrxacc', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);

            var sqlString = 'SELECT matrix.*, ROUND(CalcVel*30000,0)/1000 as CalcVel30,Ph_Name from matrix inner join pharms on pharms.Ph_ID = matrix.Ph_ID  where valid <> 1';
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.status(200);
                res.json(rs);
            });
        });
    });
    app.get('/api/resultrq/:pharmid', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);

            var sqlString = "SELECT * from matrix_view_e where [Ph_ID]=" + req.params.pharmid + " and Req>0 order by Gr_Name";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.status(200);
                res.json(rs);
            });
        });
    });
    app.get('/api/send/:pharmid', function (req,res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);

            var sqlString = 'update pharms set sent=1 where ph_id=' + req.params.pharmid;
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).send("ok");
                res = "ok";
            });
        });

    });
    app.get('/api/updaterq/:ph_id/:gr_id/:req', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            var grcode = req.params.gr_id;
            grcode = grcode.replace("grp", "");
            var sqlString = "update matrix set req=" + req.params.req + " where ph_id=" + req.params.ph_id + " and gr_id= " + grcode +"";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).send("ok");
                res = "ok";
            });
        });

    });
    app.get('/api/updatemx/:ph_id/:gr_id/:minqty/:minreq/:ratio/:tempreq', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            var grcode = req.params.gr_id;
            //grcode = grcode.replace("grp", "");
            var sqlString = "update matrix set minqty=" + req.params.minqty + ",minreq=" + req.params.minreq + ",ratio=" + req.params.ratio +  ",tempreq=" + req.params.tempreq + " where ph_id=" + req.params.ph_id + " and gr_id= " + grcode + "";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).send("ok");
                res = "ok";
            });
        });

    });
    app.post('/api/updatemx/', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }
            console.log(req.body);
            var request = new sql.Request(connection);
            var grcode = req.body.gr_id;
            //grcode = grcode.replace("grp", "");
            var sqlString = "update matrix set minqty=" + req.body.MinQty + ",minreq=" + req.body.MinReq + ",ratio=" + req.body.Ratio + ",TempReq=" + req.body.TempReq+", Rating = '" + req.body.Rating + "', Marketing = '" + req.body.Marketing + "', Matrix='" + req.body.Matrix + "', Season='" + req.body.Season +"' where ph_id=" + req.body.Ph_ID + " and gr_id= " + req.body.Gr_ID + "";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).send("ok");
                res = "ok";
            });
        });

    });
    app.get('/api/updateph/:ph_id/:d_d/:d_a/:d_t/:kmin/:kmax', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            var grcode = req.params.gr_id;
            //grcode = grcode.replace("grp", "");
            var sqlString = "update pharms set d_d=" + req.params.d_d + ",d_a=" + req.params.d_a + ",d_t=" + req.params.d_t + ",kmin=" + req.params.kmin + ",kmax=" + req.params.kmax + " where ph_id=" + req.params.ph_id ;
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).send("ok");
                res = "ok";
            });
        });

    });
    app.post('/api/updateph/', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            var grcode = req.params.gr_id;
            //grcode = grcode.replace("grp", "");
            var sqlString = "update pharms set d_d=" + req.body.D_D + ",d_a=" + req.body.D_A + ",d_t=" + req.body.D_T + ",kmin=" + req.body.Kmin + ",kmax=" + req.body.Kmax + ", Categories='" + req.body.Categories + "', graph = '" + req.body.graph +  "' where ph_id=" + req.body.Ph_ID;
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();
                 
                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).send("ok");
                res = "ok";
            });
        });

    });
   app.get('/api/acceptmx/:ph_id/:gr_id', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }
            console.log('CONNECT');
            var request = new sql.Request(connection);
            var grcode = req.params.gr_id;
            //grcode = grcode.replace("grp", "");
            var sqlString = "update matrix set Valid=1 where ph_id=" + req.params.ph_id + " and gr_id= " + grcode + "";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).send("ok");
                //res = "ok";
            });
        });

    });
    app.get('/api/deletemx/:ph_id/:gr_id', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            var grcode = req.params.gr_id;
            //grcode = grcode.replace("grp", "");
            if (!req.user) { res.redirect('/'); return; };
            if (!("username" in req.user)) { res.redirect('/'); return; };
          var sqlString = "exec api_deletematrix " + req.params.ph_id + " , " + grcode + ",'" + req.user.username + "' " ;
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).send("ok");
                res = "ok";
            });
        });

    });
    app.post('/api/deletemx/', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            var grcode = req.params.gr_id;
            //grcode = grcode.replace("grp", "");
            if (!req.user) { res.redirect('/'); return; };
            if (!("username" in req.user)) { res.redirect('/'); return; };
            var sqlString = "exec api_deletematrix " + req.body.Ph_ID + " , " + req.body.Gr_ID + ",'" + req.user.username + "' ";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
              
                if (err) { res.status(500).send(err); return; }
                              
            });
            var sqlString = "SELECT * from matrix_cez_n where Gr_ID= " + req.body.Gr_ID + " and Ph_ID = " + req.body.Ph_ID + ";"
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();
                if (err) { res.status(500).send(err); return; }
                res.status(200).json(rs[0]);
             
            });

        });

    });
    app.get('/api/addmx/:ph_id/:gr_id', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            var grcode = req.params.gr_id;
            //grcode = grcode.replace("grp", "");
            if (!req.user) { res.redirect('/'); return; };
            if (!("username" in req.user)) { res.redirect('/'); return; };
            var sqlString = "exec api_addmatrix " + req.params.ph_id + ", " + grcode + ",'" + req.user.username + "'" 
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
             //   connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
             //   res.status(200).send("ok");
             //   res = "ok";
            });
            var sqlString = "SELECT Goods_Group_ID, RGG_Name FROM Goods_Group where Goods_Group_ID= " + grcode + ";" 
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).json(rs);
                //res = "ok";
            });
        });

    });
    app.post('/api/addmx/', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            //var grcode = req.params.gr_id;
            //grcode = grcode.replace("grp", "");
            if (!req.user) { res.redirect('/'); return; };
            if (!("username" in req.user)) { res.redirect('/'); return; };
            var sqlString = "exec api_addmatrix " + req.body.Ph_ID + ", " + req.body.Gr_ID + ",'" + req.user.username + "'"
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                //   connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                //   res.status(200).send("ok");
                //   res = "ok";
            });
            var sqlString = "SELECT * from matrix_cez_n where Gr_ID= " + req.body.Gr_ID + " and Ph_ID = " + req.body.Ph_ID+ ";"
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).json(rs[0]);
                //res = "ok";
            });
        });

    });
    app.get('/api/sales/:phid/:grid', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
 //           if (!req.user) { res.redirect('/'); return; };
 //           if (!("username" in req.user)) { res.redirect('/'); return; };
            var sqlString = "SELECT * from Sales_View where Ph_ID=" + req.params.phid + " and Gr_ID=" + req.params.grid + " ORDER BY dat1";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.status(200).json(rs);
                
            });
        });
    });
    app.get('/api/requests/:pharmid', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            //           if (!req.user) { res.redirect('/'); return; };
            //           if (!("username" in req.user)) { res.redirect('/'); return; };
            var sqlString = "SELECT * from Requests_v where Branch_Contractor_ID=" + req.params.pharmid + "  ORDER BY request_date desc";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); console.log(err); return; }

                var count = rs;
                res.status(200).json(rs);

            });
        });
    });
    app.get('/api/request/:id', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            //           if (!req.user) { res.redirect('/'); return; };
            //           if (!("username" in req.user)) { res.redirect('/'); return; };
            var sqlString = "SELECT * from Request_by_id where Ph_ID=" + req.params.id ;
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                var count = rs;
                res.status(200).json(rs);

            });
        });
    });
    app.get('/api/reports/', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            var sqlString = "select * from reports";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).json(rs);
                res = "ok";
            });
        });

    });
    app.post('/api/reports/', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);
        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            var grcode = req.params.gr_id;
            grcode = grcode.replace("grp", "");
            var sqlString = "update matrix set req=" + req.params.req + " where ph_id=" + req.params.ph_id + " and gr_id= " + grcode + "";
            console.log(sqlString);
            request.query(sqlString, function (err, rs) {
                connection.close();

                if (err) { res.status(500).send(err); return; }

                //var count = rs;
                res.status(200).send("ok");
                res = "ok";
            });
        });

    });
};

