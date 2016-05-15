"use strict";

var express = require('express');
var router = express.Router();
var sp = require("../lib/db");

function get(req, res, next) {
    var  proc = new sp();
    var code = req.params.code;    
    
    var param1 = {name : "id", type : "Int", value : "5"};
    var param2 = {name : "name", type : "VarChar", size: 200, value : "serkanozkan" +  code};
    
    
    function callback(err, recordsets, returnValue, affected) {
        if (err) {
            res.status(401).json({error : err});            
        } else {
            res.status(200).json({result : recordsets[0]});
        }
    }
    
    proc.exec("bitirme.sel_person", [param1, param2], callback);
}


router.get('/:code?', get);

module.exports = router;
