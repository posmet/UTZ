require('../config');

const sql = require('mssql');
const nconf = require('nconf');
const ConnectionPool = new sql.ConnectionPool(nconf.get("mssql"));
const fs = require('fs');
const file = __dirname + '/export.sql';
const count = nconf.get('EXPORT');

const getValue = item => {
  let result = '';
  Object.keys(item).forEach((key, index) => {
    result = `${result}'${item[key]}'`;
    if (index !== Object.keys(item).length - 1) {
      result = `${result},`;
    }
  });
  return result;
};

const getKeys = item => {
  return Object.keys(item).map(key => {
    return `[${key}]`;
  }).join(',');
};

const fn = async () => {
  try {
    const pool = await ConnectionPool.connect();
    const request = new sql.Request(pool);
    let query = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'";
    await fs.writeFileSync(file, "");
    let rs = await request.query(query);
    for(const table of rs.recordset) {
      const selectQuery = `SELECT TOP ${count} * from ${table.TABLE_NAME}`;
      const selectRs = await request.query(selectQuery);
      if (selectRs.recordset.length) {
        let data = await fs.readFileSync(file);
        data = `${data}SET IDENTITY_INSERT ${table.TABLE_NAME} ON;\n`;
        data = `${data}INSERT INTO ${table.TABLE_NAME} \n(${getKeys(selectRs.recordset[0])}) \nVALUES ${selectRs.recordset.map(item => `(${getValue(item)})`).join(',')};`;
        data = `${data}\n\n`;
        await fs.writeFileSync(file, data);
      }
    }
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
};

fn();