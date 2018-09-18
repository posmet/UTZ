var sql = require('mssql'); 

var config = {
    user: 'online',
    password: '40NSj,:Jck<F',
    server: 'r02.5dd.ru',
    database: 'REQUEST',
    options: { encrypt: false }
};

exports.readdata = function (req, res) {
    var connection = new sql.Connection(config);
    
    connection.connect(function (err) {
        if (err) { res.status(500).send(err); return; }
        
        var request = new sql.Request(connection);
        var sqlString = 'SELECT ';
        request.query(sqlString, function (err, rs) {
            connection.close();
            
            if (err) { res.status(500).send(err); return; }
            
            var count = rs[0].CT;
            console.log('The solution is: ', count);
            res.end(JSON.stringify(count));
            res.send("There are " + count + " files in the table");
        });
    });
};