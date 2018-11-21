﻿var sql = require('mssql');
const pool = require('../boot/sql');
const middleware = require('../services/Middleware');
const authService = require('../services/Auth');
const messageManager = require('../services/Message');

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

  app.get('/api/name', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = `SELECT * from ref_users where userid=${req.user.id}`;
    const rs = await request.query(sqlString);
    if (!rs.recordset.length) {
      return messageManager.sendMessage(res, "Пользователь не найден", 401);
    }
    res.json(rs.recordset[0]);
  }));

  app.get('/api/sentupdate', function(req,res) {
    res.json({
      name: 'test'
    });
  });

  app.get('/api/result', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = "SELECT * from pharmsByUser where userid=" + req.user.id;
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));


  app.get('/api/resultrq/:pharmid', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = "SELECT * from matrix_view_e where [Ph_ID]=" + req.params.pharmid + " and Req>0 order by Gr_Name";
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.get('/api/send/:pharmid', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = 'update pharms set sent=1 where ph_id=' + req.params.pharmid;
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));

  app.get('/api/updaterq/:ph_id/:gr_id/:req', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const grcode = req.params.gr_id.replace("grp", "");
    const sqlString = "update matrix set req=" + req.params.req + " where ph_id=" + req.params.ph_id + " and gr_id= " + grcode +"";
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));

  app.get('/api/updateph/:ph_id/:d_d/:d_a/:d_t/:kmin/:kmax', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = "update pharms set d_d=" + req.params.d_d + ",d_a=" + req.params.d_a + ",d_t=" + req.params.d_t + ",kmin=" + req.params.kmin + ",kmax=" + req.params.kmax + " where ph_id=" + req.params.ph_id ;
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));

  app.get('/api/updatemx/:ph_id/:gr_id/:minqty/:minreq/:ratio/:tempreq', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const grcode = req.params.gr_id;
    const sqlString = "update matrix set minqty=" + req.params.minqty + ",minreq=" + req.params.minreq + ",ratio=" + req.params.ratio +  ",tempreq=" + req.params.tempreq + " where ph_id=" + req.params.ph_id + " and gr_id= " + grcode + "";
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));

  app.post('/api/updatemx/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = "update matrix set minqty=" + req.body.MinQty + ",minreq=" + req.body.MinReq + ",ratio=" + req.body.Ratio + ",TempReq=" + req.body.TempReq+", Rating = '" + req.body.Rating + "', Marketing = '" + req.body.Marketing + "', Matrix='" + req.body.Matrix + "', Season='" + req.body.Season +"' where ph_id=" + req.body.Ph_ID + " and gr_id= " + req.body.Gr_ID + "";
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));

  app.post('/api/resultmtrxn/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = 'SELECT * from matrix_cez_n'+addwhere(req.body.conds);
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.get('/api/deletemx/:ph_id/:gr_id', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const grcode = req.params.gr_id;
    const sqlString = "exec api_deletematrix " + req.params.ph_id + " , " + grcode + ",'" + req.user.username + "' " ;
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));

  app.post('/api/deletemx/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    let sqlString = "exec api_deletematrix " + req.body.Ph_ID + " , " + req.body.Gr_ID + ",'" + req.user.username + "' ";
    console.log(sqlString);
    await request.query(sqlString);
    sqlString = "SELECT * from matrix_cez_n where Gr_ID= " + req.body.Gr_ID + " and Ph_ID = " + req.body.Ph_ID + ";";
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.get('/api/addmx/:ph_id/:gr_id', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const grcode = req.params.gr_id;
    let sqlString = "exec api_addmatrix " + req.params.ph_id + ", " + grcode + ",'" + req.user.username + "'";
    console.log(sqlString);
    await request.query(sqlString);
    sqlString = "SELECT Goods_Group_ID, RGG_Name FROM Goods_Group where Goods_Group_ID= " + grcode + ";";
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.post('/api/addmx/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    let sqlString = "exec api_addmatrix " + req.body.Ph_ID + ", " + req.body.Gr_ID + ",'" + req.user.username + "'";
    console.log(sqlString);
    await request.query(sqlString);
    sqlString = "SELECT * from matrix_cez_n where Gr_ID= " + req.body.Gr_ID + " and Ph_ID = " + req.body.Ph_ID+ ";";
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.get('/api/resultmtrxacc', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = 'SELECT matrix.*, ROUND(CalcVel*30000,0)/1000 as CalcVel30,Ph_Name from matrix inner join pharms on pharms.Ph_ID = matrix.Ph_ID  where valid <> 1';
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.get('/api/sales/:phid/:grid', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = "SELECT * from Sales_View where Ph_ID=" + req.params.phid + " and Gr_ID=" + req.params.grid + " ORDER BY dat1";
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.post('/api/overnorm/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = 'SELECT * from overnorm' + addwhere(req.body.conds);
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.post('/api/resulttrans/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = 'SELECT * from transfers_view' + addwhere(req.body.conds);
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.post('/api/transferto/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = 'SELECT * from transferto' + addwhere(req.body.conds);
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.post('/api/transfer/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = 'exec api_addtransfer ' + req.body.Gr_ID + ',' + req.body.Ph_ID + ',' + req.body.toPh_ID + ',' + req.body.Req;
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.get('/api/resultmtrx/:pharmid', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = 'SELECT *, ROUND(CalcVel*30000,0)/1000 as CalcVel30 from matrix_view_e where ph_id=' + req.params.pharmid + ' order by Gr_Name';
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.get('/api/request/:id', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = "SELECT * from Request_by_id where Ph_ID=" + req.params.id ;
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

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

    app.post('/api/updateph/', function (req, res) {
        var sql = require('mssql');
        var connection = new sql.Connection(config);

        connection.connect(function (err) {
            if (err) { res.status(500).send(err); return; }

            var request = new sql.Request(connection);
            var grcode = req.params.gr_id;
            //grcode = grcode.replace("grp", "");
            var sqlString = "update pharms set d_d=" + req.body.D_D + ",d_a=" + req.body.D_A + ",d_t=" + req.body.D_T + ",kmin=" + req.body.Kmin + ",kmax=" + req.body.Kmax + ", Categories='" + req.body.Categories + "', graph = '" + req.body.graph + "', [over]=" + req.body.over+" where ph_id=" + req.body.Ph_ID;
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
    function addwhere(conds) {
        var sqlString = '';
        if (conds.length > 0) {
            sqlString = sqlString + ' where ';
            sqlString = sqlString + conds.reduce(function (prev, curr) {
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
                        Whr = Whr + " > '" + curr.value + "'";
                        break;
                    case 'lt':
                        Whr = Whr + " < '" + curr.value + "'";
                        break;
                }
                return Whr;

            }, "");
            return sqlString;
        }

    };
};

