"use strict";
//yasin

var sql = require('mssql');
var conStr = "mssql://username:password@localhost/database";
var dbUserName = "borsam";
var dbPassword = "Karaca#1975";
var conStr = `Server=tcp:borsam.database.windows.net,1433;
                            Data Source=borsam.database.windows.net;
                            Initial Catalog=borsa;Persist Security Info=False;
                            User ID=${dbUserName};Password=${dbPassword};
                            Pooling=False;MultipleActiveResultSets=False;Encrypt=True;
                            TrustServerCertificate=False;ConnectionTimeout=30`;


function connected(params) {
    console.log("connected");
}

sql.connect(conStr).then(connected).catch(function(err){
    
    console.log("not connected");
});


class Sp {
    exec(spName, arr, callback) {

        var request = new sql.Request();
        
        function iterateParameters(val) {
            let type = val.type;
            let sqlType = sql[type];
            
            if (val.size) {
                sqlType = sqlType(val.size);
            }
            request.input(val.name, sqlType, val.value);    
        }
        
        arr.forEach(iterateParameters);
        request.execute(spName, callback);
    }
}


module.exports = Sp;

