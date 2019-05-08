const sql = require('mssql');
const pool = require('../boot/sql');
const middleware = require('../services/Middleware');
const authService = require('../services/Auth');
const messageManager = require('../services/Message');
const _ = require('lodash');

const addwhere = function (conds) {
  let sqlString = '';
  if (conds.length > 0) {
    sqlString = sqlString + ' where ';
    sqlString = sqlString + conds.reduce(function (prev, curr) {
      var Whr = prev;
		if (prev !== '') {
			Whr = Whr + ' and ';
			if (curr.condition === 'nls') {
				Whr = Whr + ' not (';
			}

		}
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
		case 'ls':
		  Whr = Whr + " IN ('" + curr.value.join() + "')";
		  break;
		case 'nls':
		  Whr = Whr + " IN ('" + curr.value.join() + "'))";
		  break;
	  }
      return Whr;

    }, "");
    return sqlString;
  }

};

const objToString = (obj) => {
  let str = '';
  Object.keys(obj).forEach((key, index) => {
    let postfix = index !== Object.keys(obj).length - 1 ? ',' : '';
    if (key === 'over') {
      str = `${str} [over]=${obj[key]}${postfix}`;
    } else {
      str = `${str} ${key}='${obj[key]}'${postfix}`;
    }
  });
  return str;
};

module.exports = function (app) {

  app.get('/api/name', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = `SELECT userid,User_Name,full_name,interface,params.blocked from ref_users,params where userid=${req.user.id}`;
	  console.log(sqlString);
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
    const sqlString = 'SELECT * from matrix_view_e where ph_id=' + req.params.pharmid + ' order by Gr_Name';
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

  app.get('/api/resultmtrxa/:pharmid/:grid', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    let sqlString = 'SELECT matrix.*, ROUND(CalcVel*30000,0)/1000 as CalcVel30,Ph_Name from matrix inner join pharms on pharms.Ph_ID = matrix.Ph_ID';
    if ((req.params.grid != 0) || (req.params.pharmid != 0)) {
      sqlString = sqlString + ' where ';
    }
    if (req.params.pharmid != 0) {
      sqlString = sqlString + 'matrix.ph_id = ' + req.params.pharmid;
    }
    if (req.params.grid != 0) {
      if (req.params.pharmid != 0) {
        sqlString = sqlString + ' and ';
      }
      sqlString = sqlString + ' Gr_ID = ' + req.params.grid;
    }
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.post('/api/resultmtrxa/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    let sqlString = 'SELECT * from matrix_cez';
    if (req.body.grid != 0 || req.body.pharmid != 0) {
      sqlString = sqlString + ' where ';
    }
    if (req.body.pharmid != 0) {
      sqlString = sqlString + 'ph_id = ' + req.body.pharmid;
    }
    if (req.body.grid != 0) {
      if (req.body.pharmid != 0) {
        sqlString = sqlString + ' and ';
      }
      if (!Number.isInteger(req.body.grid)) {
        req.body.grid = req.body.grid.replace(' ', '%');
        sqlString = sqlString + " Gr_Name  Like '%" + req.body.grid + "%'";
      } else {
        sqlString = sqlString + ' Gr_ID = ' + req.body.grid;
      }
    }
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.post('/api/resultmtrxf/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = "SELECT * from matrix_cez where Filial ='" + req.body.filial + "'";
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.get('/api/pharms/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = `select * from pharms`;
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.post('/api/pharms/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    if (!req.body.Ph_ID) {
      throw new Error('Необходимо указать код аптеки');
    }
    const request = new sql.Request(pool);
    const sqlString = `insert into pharms(Ph_ID) values('${req.body.Ph_ID}')`;
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));

  app.delete('/api/pharms/:id', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = `delete from pharms where ph_id=${req.params.id}`;
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));

  app.put('/api/pharms/:id', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = `update pharms set ${objToString(req.body)} where ph_id=${req.params.id}`;
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));
	app.get('/api/gg_attr/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
		const request = new sql.Request(pool);
		const sqlString = "select * from gg_attr";
		console.log(sqlString);
		const rs = await request.query(sqlString);
		res.json(rs.recordset);
	}));


  /*app.post('/api/updateph/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = "update pharms set d_d=" + req.body.D_D + ",d_a=" + req.body.D_A + ",d_t=" + req.body.D_T + ",kmin=" + req.body.Kmin + ",kmax=" + req.body.Kmax + ", Categories='" + req.body.Categories + "', graph = '" + req.body.graph + "', [over]=" + req.body.over+" where ph_id=" + req.body.Ph_ID;
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));*/

  app.get('/api/acceptmx/:ph_id/:gr_id', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const grcode = req.params.gr_id;
    const sqlString = "update matrix set Valid=1 where ph_id=" + req.params.ph_id + " and gr_id= " + grcode + "";
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));

  app.get('/api/requests/:pharmid', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = "SELECT * from Requests_v where Branch_Contractor_ID=" + req.params.pharmid + "  ORDER BY request_date desc";
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.get('/api/reports/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = "select * from reports";
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

  app.post('/api/reports/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const grcode = req.params.gr_id.replace("grp", "");
    const sqlString = "update matrix set req=" + req.params.req + " where ph_id=" + req.params.ph_id + " and gr_id= " + grcode + "";
    console.log(sqlString);
    await request.query(sqlString);
    res.json(messageManager.buildSuccess());
  }));

	app.post('/api/sendfile/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
		const request = new sql.Request(pool);
		let response = [];
    let responseParams = [];
		req.body.items.forEach(async (rec,i,arr) => {
      let sqlString = '';
      if (rec.M === 'Н') {
        if (rec.Ph_ID) {
          sqlString = `exec api_deletematrix ${rec.Ph_ID}, ${rec.Gr_ID},'${req.user.username}'`;
          try {
            await request.query(sqlString);
          } catch (e) {

          }
          console.log(sqlString);
        }
      } else {
        if (rec.Ph_ID) {
          sqlString = `exec api_addmatrix ${rec.Ph_ID}, ${rec.Gr_ID},'${req.user.username}'`;
          try {
            await request.query(sqlString);
            if (!responseParams.some(v => v.Ph_ID === rec.Ph_ID && v.Gr_ID === rec.Gr_ID)) {
              responseParams.push({Ph_ID: rec.Ph_ID, Gr_ID: rec.Gr_ID});
            }
          } catch (e) {

          }
          console.log(sqlString);
        } else {
          sqlString = `SELECT Ph_ID FROM Pharms WHERE Categories='${rec.Categories}'`;
          let pharms = null;
          try {
            pharms = await request.query(sqlString);
          } catch (e) {

          }
          console.log(sqlString);
          if (pharms) {
            pharms.recordset.forEach(async (ph) => {
              sqlString = `exec api_addmatrix ${ph.Ph_ID}, ${rec.Gr_ID},'${req.user.username}'`;
              try {
                await request.query(sqlString);
                if (!responseParams.some(v => v.Ph_ID === ph.Ph_ID && v.Gr_ID === rec.Gr_ID)) {
                  responseParams.push({Ph_ID: ph.Ph_ID, Gr_ID: rec.Gr_ID});
                }
              } catch (e) {

              }
              console.log(sqlString);
            });
          }
        }
        let sqlUpdate = 'update matrix set valid = 1';
        req.body.cols.forEach(function (col, j, arrc) {
          if (col.enableCellEdit && rec[col.field]) sqlUpdate = sqlUpdate + ",[" + col.field + "] = '" + rec[col.field] + "'";
        });
        sqlString =  `${sqlUpdate} where Gr_ID = ${rec.Gr_ID} and Ph_ID `;
        if (rec.Ph_ID) {
          sqlString = `${sqlString} = ${rec.Ph_ID}`;
        } else {
          sqlString = `${sqlString} IN (SELECT Ph_ID FROM Pharms WHERE Categories='${rec.Categories}')`;
        }
        try {
          await request.query(sqlString);
        } catch (e) {

        }
        console.log(sqlString);
      }
		});
		if (responseParams.length) {
      responseParams.forEach(async (r) => {
        let sqlString = `SELECT * from matrix_cez_n where Ph_ID=${r.Ph_ID} and Gr_ID=${r.Gr_ID}`;
        let rs = null;
        try {
          rs = await request.query(sqlString);
          response = response.concat(rs.recordset);
        } catch (e) {

        }
        console.log(sqlString);
      });
    }
		res.json(response);

	}));

	app.get('/api/users/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
		const request = new sql.Request(pool);
		const sqlString = "select * from ref_users";
		console.log(sqlString);
		const rs = await request.query(sqlString);
		res.json(rs.recordset);
	}));

	app.post('/api/users/', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
		const request = new sql.Request(pool);
		let sqlString = `insert into ref_users(User_Name,pwd,full_name,interface) values('${req.body.User_Name}','${req.body.pwd}','${req.body.full_name || ''}',${req.body.interface})`;
		console.log(sqlString);
		await request.query(sqlString);
		if (req.body.roles && req.body.roles.length) {
		  sqlString = `select TOP (1) * from ref_users where User_Name='${req.body.User_Name}'`;
		  const rs = await request.query(sqlString);
		  for (let i=0; i<req.body.roles.length; i++) {
        const sqlString1 = `insert into Roles(userid,ph_id,Rd_Matrix,Wr_Matrix,Rd_Req,Wr_Req) values('${rs.recordset[0].userid}','${req.body.roles[i].Ph_ID}','${req.body.roles[i].Rd_Matrix || 0}','${req.body.roles[i].Wr_Matrix || 0}','${req.body.roles[i].Rd_Req || 0}','${req.body.roles[i].Wr_Req || 0}')`;
        console.log(sqlString1);
        await request.query(sqlString1);
      }
    }
		res.json(messageManager.buildSuccess());
	}));

	app.put('/api/users/:userId', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
		const request = new sql.Request(pool);
		const sqlString = `update ref_users set pwd='${req.body.pwd}',full_name='${req.body.full_name || ''}',interface=${req.body.interface} where userid=${req.params.userId}`;
		console.log(sqlString);
		const rs = await request.query(sqlString);
		res.json(rs.recordset);
	}));

	app.delete('/api/users/:userId', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
		const request = new sql.Request(pool);
		const sqlString = `delete from ref_users where userid=${req.params.userId}`;
		console.log(sqlString);
		const rs = await request.query(sqlString);
		res.json(rs.recordset);
	}));

  app.get('/api/roles/:userId', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    const sqlString = `SELECT Roles.userid, Roles.Ph_ID, Pharms.Ph_Name, Roles.Rd_Matrix, Roles.Wr_Matrix, Roles.Rd_Req,Roles.Wr_Req	FROM Roles INNER JOIN Pharms ON Roles.Ph_ID = Pharms.Ph_ID where Roles.userid=${req.params.userId}`;
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));

	app.put('/api/roles/:userId', authService.isAuthenticated(), middleware.asyncMiddleware(async (req, res) => {
		const request = new sql.Request(pool);
		if (!Array.isArray(req.body.roles)) {
      return messageManager.sendMessage(res, 'Отсутствует параметр roles');
    }
		let sqlString = `select * from Roles where userid=${req.params.userId}`;
		console.log(sqlString);
		const rs = await request.query(sqlString);
		const bodyRoles = _.keyBy(req.body.roles, 'Ph_ID');
    let queries = [];
    for (let i = 0; i < rs.recordset.length; i++) {
      const item = rs.recordset[i];
      const bodyItem = bodyRoles[item.Ph_ID];
      //удалили
      if (!bodyItem) {
        queries.push(`delete from Roles where userid=${req.params.userId} and ph_id = ${item.Ph_ID}`);
      } else {
        bodyItem.used = true;
        if (bodyItem.Rd_Matrix !== item.Rd_Matrix || bodyItem.Wr_Matrix !== item.Wr_Matrix || bodyItem.Rd_Req !== item.Rd_Req || bodyItem.Wr_Req !== item.Wr_Req) {
          //изменили
          queries.push(`update Roles set Rd_Matrix='${bodyItem.Rd_Matrix || 0}',Wr_Matrix='${bodyItem.Wr_Matrix || 0}',Rd_Req='${bodyItem.Rd_Req || 0}',Wr_Req='${bodyItem.Wr_Req || 0}' where userid=${req.params.userId} and ph_id = ${item.Ph_ID}`);
        }
      }
    }
    for (let i = 0; i < req.body.roles.length; i++) {
      const bodyItem = req.body.roles[i];
      //добавили
      if (!bodyItem.used) {
        queries.push(`insert into Roles(userid,ph_id,Rd_Matrix,Wr_Matrix,Rd_Req,Wr_Req) values('${req.params.userId}','${bodyItem.Ph_ID}','${bodyItem.Rd_Matrix || 0}','${bodyItem.Wr_Matrix || 0}','${bodyItem.Rd_Req || 0}','${bodyItem.Wr_Req || 0}')`);
      }
    }
    console.log(queries);
    for (let i = 0; i < queries.length; i++) {
      await request.query(queries[i]);
    }
		res.json(messageManager.buildSuccess());
	}));

  app.post('/api/table/:key', middleware.asyncMiddleware(async (req, res) => {
    const request = new sql.Request(pool);
    let sqlString = `SELECT * from ${req.params.key} ${addwhere(req.body.filter)}`;
    console.log(sqlString);
    const rs = await request.query(sqlString);
    res.json(rs.recordset);
  }));


};

