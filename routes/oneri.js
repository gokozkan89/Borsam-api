"use strict";
var express = require('express');
var router = express.Router();
var sp = require('../lib/db');
var http = require('http');
//gokhan
var htmlparser2 = require('htmlparser2');
var url = 'http://www.isyatirim.com.tr/in_LT_HTL.aspx';

function siteGetir()
{
    http.get(url,function (response) {
        siteParcala(response);
    });
}

var siteParcala = function (response) {

    var parser = new htmlparser2.Parser({
        onopentag: function(name, attribs){
            if(name === "script" && attribs.type === "text/javascript"){

            }
        },
        ontext: function(text){
            console.log("", text);
        },
        onclosetag: function(tagname){
            if(tagname === "tr"){
                console.log(tagname);
            }
        }
    }, {decodeEntities: true});

    parser.end();

}

router.get('/oneri?', siteGetir);

module.exports = router;