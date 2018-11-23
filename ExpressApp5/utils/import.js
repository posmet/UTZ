require('../config');

const sql = require('mssql');
const nconf = require('nconf');
const ConnectionPool = new sql.ConnectionPool(nconf.get("mssql"));
const fs = require('fs');
const file = __dirname + '/export.sql';

const fn = async () => {
  try {
    const pool = await ConnectionPool.connect();
    const request = new sql.Request(pool);
    let query = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'";
    let rs = await request.query(query);
    for(const table of rs.recordset) {
      const selectRs = await request.query(`SELECT TOP 1 * from ${table.TABLE_NAME}`);
      if (selectRs.recordset.length) {
        await request.query(`DELETE FROM [${table.TABLE_NAME}]\n DBCC CHECKIDENT ([${table.TABLE_NAME}], RESEED, 0)`);
      }
    }
    let data = await fs.readFileSync(file, "utf8");
    await request.query(data);
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
};

fn();