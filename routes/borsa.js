"use strict";

var express = require('express');
var router = express.Router();
var sp = require('../lib/db');
var http = require('http');

/*
 function get(req, res, next) {
 var proc = new sp();
 var code = req.params.code;

 var param1 = {name: "id", type: "Int", value: "5"};
 var param2 = {name: "name", type: "VarChar", size: 200, value: "serkanozkan" + code};


 function callback(err, recordsets, returnValue, affected) {
 if (err) {
 res.status(401).json({error: err});
 } else {
 res.status(200).json({result: recordsets[0]});
 }
 }
 asdadsas

 proc.exec("bitirme.sel_person", [param1, param2], callback);
 }
 */

function kullaniciEkle(req, res, next) {
    var proc = new sp();

    console.log(req.body);
    console.log(req.params);
    console.log(req.query);

    var adi = req.body.adi;
    var soyadi = req.body.soyadi;
    var email = req.body.email;
    var sifre = req.body.sifre;

    console.log(adi);
    console.log(soyadi);
    console.log(email);
    console.log(sifre);

    var pAdi = {name: "adi", type: "VarChar", size: 50, value: adi};
    var pSoyadi = {name: "soyadi", type: "VarChar", size: 50, value: soyadi};
    var pEmail = {name: "email", type: "VarChar", size: 100, value: email};
    var pSifre = {name: "sifre", type: "VarChar", size: 100, value: sifre};

    function callback(err, recordsets, returnValue, affected) {
        if (err) {
            res.status(401).json({error: err});
        } else{
            res.status(200).json({result: recordsets[0][0]});
        }
        /*
        else if (recordsets && recordsets.length > 0) {
            if (recordsets[0].Mesaj)
                res.status(200).json({result: recordsets[0].Mesaj});
            else if(recordsets[0].HataMesaji)
                res.status(401).json({result: recordsets[0].HataMesaji});
        }*/
    }

    proc.exec("bitirme.spKullaniciEkle", [pAdi, pSoyadi, pEmail, pSifre], callback);
}

function kullaniciKontrol(req, res, next) {
    var proc = new sp();
    var email = req.body.email;
    var sifre = req.body.sifre;

    console.log(req.params);
    console.log(req.query);

    console.log(email);
    console.log(sifre);

    var pEmail = {name: "email", type: "VarChar", size: 100, value: email};
    var pSifre = {name: "sifre", type: "VarChar", size: 100, value: sifre};

    function callback(err, recordsets, returnValue, affected) {
        if (err) {
            res.status(401).json({error: err});
        } else{
            res.status(200).json({result: recordsets[0][0]});
        }
        /*
         else if (recordsets && recordsets.length > 0) {
         if (recordsets[0].Mesaj)
         res.status(200).json({result: recordsets[0].Mesaj});
         else if(recordsets[0].HataMesaji)
         res.status(401).json({result: recordsets[0].HataMesaji});
         }*/
    }

    proc.exec("bitirme.spKullaniciKontrol", [pEmail, pSifre], callback);
}

function emirEkle(req, res, next) {
    var proc = new sp();
    var emirTipi = req.query.emirTipi;
    var hisseKodu = req.query.hisseKodu;
    var hisseAdeti = req.query.hisseAdeti;
    var teklifEdilenBirimFiyat = req.query.teklifEdilenBirimFiyat;
    var kullaniciId = req.query.kullaniciId;

    console.log(req.params);
    console.log(req.query);

    console.log(emirTipi);
    console.log(hisseKodu);
    console.log(hisseAdeti);
    console.log(teklifEdilenBirimFiyat);
    console.log(kullaniciId);

    var pEmirTipi = {name: "emirTipi", type: "VarChar", size: 1, value: emirTipi};
    var pHisseKodu = {name: "hisseKodu", type: "VarChar", size: 6, value: hisseKodu};
    var pHisseAdeti = {name: "hisseAdeti", type: "Int", value: hisseAdeti};
    var pTeklifEdilenBirimFiyat = {name: "teklifEdilenBirimFiyat", type: "Money", value: teklifEdilenBirimFiyat};
    var pKullaniciId = {name: "kullaniciId", type: "Int", value: kullaniciId};

    function callback(err, recordsets, returnValue, affected) {
        if (err) {
            res.status(401).json({error: err});
        } else {
            res.status(200).json({result: 'OK'});
        }
    }

    proc.exec("bitirme.spEmirEkle", [pEmirTipi, pHisseKodu, pHisseAdeti, pTeklifEdilenBirimFiyat, pKullaniciId], callback);
}

var hisseBilgileriniAl = function (emir) {
    var proc = new sp();
    var hisseKodu = emir.HisseKodu;
    http.get({
        host: 'finance.yahoo.com',
        path: '/webservice/v1/symbols/' + hisseKodu + '.IS/quote?format=json&view=detail'
    }, function (response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function (d) {
            var data = JSON.parse(d);
            if (data != null && data.list != null && data.list.resources != null && data.list.resources.length > 0) {
                var resource = data.list.resources[0].resource;
                if (resource != null && resource.fields != null) {
                    var emirId = emir.EmirId;
                    var hisseKodu2 = emir.HisseKodu;
                    var emirTipi = emir.EmirTipi;
                    var teklifEdilenBirimFiyat = parseFloat(emir.TeklifEdilenBirimFiyat);

                    console.log(emirId);
                    console.log(hisseKodu);
                    console.log(hisseKodu2);
                    console.log(emirTipi);
                    console.log(teklifEdilenBirimFiyat);

                    var fields = resource.fields;
                    var hisseFiyati = parseFloat(fields.price);

                    console.log('hisseFiyati - ' + hisseKodu + ' : ' + hisseFiyati);

                    if ((emirTipi == 'A' && hisseFiyati <= teklifEdilenBirimFiyat) || (emirTipi == 'S' && hisseFiyati >= teklifEdilenBirimFiyat)) {
                        var pEmirId = {name: "emirId", type: "Int", value: emirId};
                        var pGerceklesenBirimFiyat = {
                            name: "gerceklesenBirimFiyat",
                            type: "Money",
                            value: hisseFiyati
                        };

                        console.log('bitirme.spEmirGerceklestir - ' + emirTipi + ' - ' + hisseKodu);

                        proc.exec("bitirme.spEmirGerceklestir", [pEmirId, pGerceklesenBirimFiyat], function () {
                        });
                    }
                }
            }
            /*
             //console.log('data:' + d);

             var jsonData = JSON.parse(data);

             console.log('list:' + JSON.stringify(jsonData.list));
             console.log('meta:' + JSON.stringify(jsonData.list.meta));
             console.log('resources:' + JSON.stringify(jsonData.list.resources));
             body += d;
             });
             response.on('end', function(x) {
             //console.log('end:' + x);
             //console.log('end:' + body);
             /*
             // Data reception is done, do whatever with it!
             var parsed = JSON.parse(body);

             console.log('end:' + body);

             callback({
             email: parsed.email,
             password: parsed.pass
             });
             */
        });
    });
};

function emirKontrol(req, res, next) {
    var proc = new sp();

    proc.exec("bitirme.spEmirleriAl", [], function (err, recordsets, returnValue, affected) {
        //console.log(recordsets);

        if (err) {
            res.status(401).json({error: err});
        } else {
            if (recordsets.length > 0) {
                var emirler = recordsets[0];

                for (var i = 0; i < emirler.length; i++) {
                    console.log(emirler[i]);

                    //var emirId = emirler[i].EmirId;
                    //var hisseKodu = emirler[i].HisseKodu;
                    //var emirTipi = emirler[i].EmirTipi;
                    //var teklifEdilenBirimFiyat = parseFloat(emirler[i].TeklifEdilenBirimFiyat);

                    //'http://finance.yahoo.com/webservice/v1/symbols/_HISSEKODU_/quote?format=json&view=detail&callback=JSON_CALLBACK'

                    hisseBilgileriniAl(emirler[i]);

                    //console.log(emirId);
                    //console.log(hisseKodu);
                    //console.log(emirTipi);
                    //console.log(teklifEdilenBirimFiyat);
                }

                res.status(200).json({result: emirler.length});
            }
        }
    });
}

function takipListesineEkle(req, res, next) {
    var proc = new sp();
    var hisseKodu = req.query.hisseKodu;
    var kullaniciId = req.query.kullaniciId;

    console.log(hisseKodu);
    console.log(kullaniciId);

    var pHisseKodu = {name: "hisseKodu", type: "VarChar", size: 6, value: hisseKodu};
    var pKullaniciId = {name: "kullaniciId", type: "Int", value: kullaniciId};

    function callback(err, recordsets, returnValue, affected) {
        if (err) {
            res.status(401).json({error: err});
        } else {
            res.status(200).json({result: 'OK'});
        }
    }

    proc.exec("bitirme.spTakipListesineEkle", [pHisseKodu, pKullaniciId], callback);
}

function takipListesiGetir(req, res, next) {
    var proc = new sp();
    var kullaniciId = req.query.kullaniciId;

    console.log(kullaniciId);

    var pKullaniciId = {name: "kullaniciId", type: "Int", value: kullaniciId};

    function callback(err, recordsets, returnValue, affected) {
        if (err) {
            res.status(401).json({error: err});
        } else {
            if (recordsets != null && recordsets.length > 0) {
                var takipListesi = recordsets[0];
                res.status(200).json({result: takipListesi});
            }
        }
    }

    proc.exec("bitirme.spTakipListesiGetir", [pKullaniciId], callback);
}

function takipListesindenCikar(req, res, next) {
    var proc = new sp();
    var hisseKodu = req.query.hisseKodu;
    var kullaniciId = req.query.kullaniciId;

    console.log(hisseKodu);
    console.log(kullaniciId);

    var pHisseKodu = {name: "hisseKodu", type: "VarChar", size: 6, value: hisseKodu};
    var pKullaniciId = {name: "kullaniciId", type: "Int", value: kullaniciId};

    function callback(err, recordsets, returnValue, affected) {
        if (err) {
            res.status(401).json({error: err});
        } else {
            res.status(200).json({result: 'OK'});
        }
    }

    proc.exec("bitirme.spTakipListesindenCikar", [pHisseKodu, pKullaniciId], callback);
}

function portfoyGetir(req, res, next) {
    var proc = new sp();
    var kullaniciId = req.query.kullaniciId;

    console.log(kullaniciId);

    var pKullaniciId = {name: "kullaniciId", type: "Int", value: kullaniciId};

    function callback(err, recordsets, returnValue, affected) {
        if (err) {
            res.status(401).json({error: err});
        } else {
            if (recordsets != null && recordsets.length > 1) {
                var portfoyListesi = recordsets[0];
                var kullaniciListesi = recordsets[1];
                res.status(200).json({result: {PortfoyListesi: portfoyListesi, KullaniciListesi: kullaniciListesi}});
            }
        }
    }

    proc.exec("bitirme.spPortfoyGetir", [pKullaniciId], callback);
}

function portfoyDetayGetir(req, res, next) {
    var proc = new sp();
    var kullaniciId = req.query.kullaniciId;
    var hisseKodu = req.query.hisseKodu;

    console.log(kullaniciId);
    console.log(hisseKodu);

    var pKullaniciId = {name: "kullaniciId", type: "Int", value: kullaniciId};
    var pHisseKodu = {name: "hisseKodu", type: "VarChar", size: 6, value: hisseKodu};

    function callback(err, recordsets, returnValue, affected) {
        if (err) {
            res.status(401).json({error: err});
        } else {
            if (recordsets != null && recordsets.length > 0) {
                var portfoy = recordsets[0];
                res.status(200).json({result: portfoy});
            }
        }
    }

    proc.exec("bitirme.spPortfoyDetayGetir", [pKullaniciId, pHisseKodu], callback);
}

router.post('/kullaniciEkle?', kullaniciEkle);
router.post('/kullaniciKontrol?', kullaniciKontrol);
router.get('/emirEkle?', emirEkle);
router.get('/emirKontrol?', emirKontrol);
router.get('/takipListesineEkle?', takipListesineEkle);
router.get('/takipListesiGetir?', takipListesiGetir);
router.get('/takipListesindenCikar?', takipListesindenCikar);
router.get('/portfoyGetir?', portfoyGetir);
router.get('/portfoyDetayGetir?', portfoyDetayGetir);

module.exports = router;
