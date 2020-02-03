var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var moment = require('moment');
const util = require('util');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'xosogacoder'
});
  
// connect to database
dbConn.connect(); 
const query = util.promisify(dbConn.query).bind(dbConn);
global.urlDomain='http://localhost:81';
var dataProvince = async (id) => {
    const rows = await query('SELECT * FROM sys_province where id=?', id);
    let foundProvince = [];
    rows.forEach(element => {
        foundProvince.push({ id: element.id, name: element.name });
    });
    return foundProvince;
}

function get_thu(day) {
    var day = day.toLowerCase();
    switch (day) {
        case 'monday':
            weekday = 'Thứ hai';
            break;
        case 'tuesday':
            weekday = 'Thứ ba';
            break;
        case 'wednesday':
            weekday = 'Thứ tư';
            break;
        case 'thursday':
            weekday = 'Thứ năm';
            break;
        case 'friday':
            weekday = 'Thứ sáu';
            break;
        case 'saturday':
            weekday = 'Thứ bảy';
            break;
        default:
            weekday = 'Chủ nhật';
            break;
    }
    return weekday;
}

app.get('/', async function (req, res) {
    var isData = 0;
    var currentDate = moment().format("YYYY-MM-DD");
    var currentDateVn = moment().format("DD-MM-YYYY");
    const data = await query('SELECT * FROM sys_lottery where ngay_so=? and vung=?', [currentDate, '0']);
    if (data.length > 0) {
        isData = 1;
    }
    return res.render('home', {
        isData: isData, currentDate: currentDate, currentDateVn: currentDateVn, currentToday: currentDate
    });
});

app.get('/xoso/:ngay', function (req, res) {
    let ngayXo = req.params.ngay;
    url = `https://xskt.com.vn/ket-qua-xo-so-theo-ngay/mien-nam-xsmn/${ngayXo}.html`;
    //url ='https://xskt.com.vn/xsmn/thu-7';
    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html,{ decodeEntities: false });
            var data = $('.tbl-xsmn');
            var listDai = data.find('tr').eq(0);
            var html_thu_xo =listDai.find('th').eq(0).html().split('<br>');
            var thu_xo=html_thu_xo[0];
            thu_xo = thu_xo.replace(/<[^>]*>?/gm, '');
            var ngay_xo=html_thu_xo[1];
            var thu_ngay_xo=thu_xo+' '+ngay_xo;
            //ten dai
            var dai1 =listDai.find('th').eq(1).text();
            var dai2 =listDai.find('th').eq(2).text();
            var dai3 =listDai.find('th').eq(3).text();
            var dai4 =listDai.find('th').eq(4).text();

            //giai 8
            var g8_1 = data.find('tr').eq(1).find('td').eq(1).text();
            var g8_2 = data.find('tr').eq(1).find('td').eq(2).text();
            var g8_3 = data.find('tr').eq(1).find('td').eq(3).text();
            var g8_4 = data.find('tr').eq(1).find('td').eq(4).text();

            //giai 7
            var g7_1 = data.find('tr').eq(2).find('td').eq(1).text();
            var g7_2 = data.find('tr').eq(2).find('td').eq(2).text();
            var g7_3 = data.find('tr').eq(2).find('td').eq(3).text();
            var g7_4 = data.find('tr').eq(2).find('td').eq(4).text();

            //giai 6
            var g6_1 = data.find('tr').eq(3).find('td').eq(1).html().split('<br>');
            var giai6Dai1Array = g6_1;
            g6_1 = g6_1.join(' ');

            var g6_2 = data.find('tr').eq(3).find('td').eq(2).html().split('<br>');
            var giai6Dai2Array = g6_2;
            g6_2 = g6_2.join(' ');

            var g6_3 = data.find('tr').eq(3).find('td').eq(3).html().split('<br>');
            var giai6Dai3Array = g6_3;
            g6_3 = g6_3.join(' ');

            var g6_4 = data.find('tr').eq(3).find('td').eq(4).html();
            if(g6_4!==null){
                g6_4 = data.find('tr').eq(3).find('td').eq(4).html().split('<br>');
                var giai6Dai4Array = g6_4;
                g6_4 = g6_4.join(' ');
            }

            //giai 5
            var g5_1 = data.find('tr').eq(4).find('td').eq(1).text();
            var g5_2 = data.find('tr').eq(4).find('td').eq(2).text();
            var g5_3 = data.find('tr').eq(4).find('td').eq(3).text();
            var g5_4 = data.find('tr').eq(4).find('td').eq(4).text();

            //giai 4
            var g4_1 = data.find('tr').eq(5).find('td').eq(1).html().split('<br>');
            var giai4Dai1Array = g4_1;
            g4_1 = g4_1.join(' ');

            var g4_2 = data.find('tr').eq(5).find('td').eq(2).html().split('<br>');
            var giai4Dai2Array = g4_2;
            g4_2 = g4_2.join(' ');

            var g4_3 = data.find('tr').eq(5).find('td').eq(3).html().split('<br>');
            var giai4Dai3Array = g4_3;
            g4_3 = g4_3.join(' ');

            var g4_4 = data.find('tr').eq(5).find('td').eq(4).html();
            if(g4_4!==null){
                g4_4 = data.find('tr').eq(5).find('td').eq(4).html().split('<br>');
                var giai4Dai4Array = g4_4;
                g4_4 = g4_4.join(' ');
            }
            //giai 3
            var g3_1 = data.find('tr').eq(6).find('td').eq(1).html().split('<br>');
            var giai3Dai1Array = g3_1;
            g3_1 = g3_1.join(' ');

            var g3_2 = data.find('tr').eq(6).find('td').eq(2).html().split('<br>');
            var giai3Dai2Array = g3_2;
            g3_2 = g3_2.join(' ');

            var g3_3 = data.find('tr').eq(6).find('td').eq(3).html().split('<br>');
            var giai3Dai3Array = g3_3;
            g3_3 = g3_3.join(' ');

            var g3_4 = data.find('tr').eq(6).find('td').eq(4).html();
            if(g3_4!==null){
                g3_4 = data.find('tr').eq(6).find('td').eq(4).html().split('<br>');
                var giai3Dai4Array = g3_4;
                g3_4 = g3_4.join(' ');
            }
            //giai 2
            var g2_1 = data.find('tr').eq(7).find('td').eq(1).text();
            var g2_2 = data.find('tr').eq(7).find('td').eq(2).text();
            var g2_3 = data.find('tr').eq(7).find('td').eq(3).text();
            var g2_4 = data.find('tr').eq(7).find('td').eq(4).text();

            //giai 1
            var g1_1 = data.find('tr').eq(8).find('td').eq(1).text();
            var g1_2 = data.find('tr').eq(8).find('td').eq(2).text();
            var g1_3 = data.find('tr').eq(8).find('td').eq(3).text();
            var g1_4 = data.find('tr').eq(8).find('td').eq(4).text();

            //dac biet
            var db_1 = data.find('tr').eq(9).find('td').eq(1).text();
            var db_2 = data.find('tr').eq(9).find('td').eq(2).text();
            var db_3 = data.find('tr').eq(9).find('td').eq(3).text();
            var db_4 = data.find('tr').eq(9).find('td').eq(4).text();
            //insert dai 1
            dbConn.query('SELECT * FROM sys_province where name=?', dai1, function (error, results, fields) {
                if (error) throw error;
                var provinceId=results[0].id;
                var dataInsert={
                    province_id:provinceId,
                    g1: g1_1,
                    g2: g2_1,
                    g3: g3_1,
                    g4: g4_1,
                    g5: g5_1,
                    g6: g6_1,
                    g7: g7_1,
                    g8: g8_1,
                    db: db_1,
                    ngay_so: moment(ngay_xo, "DD/MM").format("YYYY-MM-DD"),
                    thu_so: thu_xo,
                    vung:0,
                    created_at:moment().format('YYYY-MM-DD H:mm:ss')
                }
                dbConn.query("INSERT INTO sys_lottery SET ? ",dataInsert, function (error, results, fields) {
                    if (error) throw error;
                });
            });
            //insert dai 2
            dbConn.query('SELECT * FROM sys_province where name=?', dai2, function (error, results, fields) {
                if (error) throw error;
                var provinceId=results[0].id;
                var dataInsert={
                    province_id:provinceId,
                    g1: g1_2,
                    g2: g2_2,
                    g3: g3_2,
                    g4: g4_2,
                    g5: g5_2,
                    g6: g6_2,
                    g7: g7_2,
                    g8: g8_2,
                    db: db_2,
                    ngay_so: moment(ngay_xo, "DD/MM").format("YYYY-MM-DD"),
                    thu_so: thu_xo,
                    vung:0,
                    created_at:moment().format('YYYY-MM-DD H:mm:ss')
                }
                dbConn.query("INSERT INTO sys_lottery SET ? ",dataInsert, function (error, results, fields) {
                    if (error) throw error;
                });
            });
            //insert dai 3
            dbConn.query('SELECT * FROM sys_province where name=?', dai3, function (error, results, fields) {
                if (error) throw error;
                var provinceId=results[0].id;
                var dataInsert={
                    province_id:provinceId,
                    g1: g1_3,
                    g2: g2_3,
                    g3: g3_3,
                    g4: g4_3,
                    g5: g5_3,
                    g6: g6_3,
                    g7: g7_3,
                    g8: g8_3,
                    db: db_3,
                    ngay_so: moment(ngay_xo, "DD/MM").format("YYYY-MM-DD"),
                    thu_so: thu_xo,
                    vung:0,
                    created_at:moment().format('YYYY-MM-DD H:mm:ss')
                }
                dbConn.query("INSERT INTO sys_lottery SET ? ",dataInsert, function (error, results, fields) {
                    if (error) throw error;
                });
            });
            //insert dai 4
            if(g6_4!==null){
                dbConn.query('SELECT * FROM sys_province where name=?', dai4, function (error, results, fields) {
                    if (error) throw error;
                    var provinceId=results[0].id;
                    var dataInsert={
                        province_id:provinceId,
                        g1: g1_4,
                        g2: g2_4,
                        g3: g3_4,
                        g4: g4_4,
                        g5: g5_4,
                        g6: g6_4,
                        g7: g7_4,
                        g8: g8_4,
                        db: db_4,
                        ngay_so: moment(ngay_xo, "DD/MM").format("YYYY-MM-DD"),
                        thu_so: thu_xo,
                        vung:0,
                        created_at:moment().format('YYYY-MM-DD H:mm:ss')
                    }
                    dbConn.query("INSERT INTO sys_lottery SET ? ",dataInsert, function (error, results, fields) {
                        if (error) throw error;
                    });
                });
            }
            return res.send({info:'success',message: 'New lottery has been created successfully.' });
        }
    })
})
app.get("/ket-qua-xo-so/:ngay?", async function (req, res) {
    let ngayXo = req.params.ngay;
    var currentDate = moment(ngayXo, "DD-MM-YYYY").format("YYYY-MM-DD");
    var currentDateVn = moment(ngayXo, "DD-MM-YYYY").format("DD-MM-YYYY");
    var thu_today = moment(ngayXo, "DD-MM-YYYY").format('dddd');
    thu_today = get_thu(thu_today);
    const data = await query('SELECT * FROM sys_lottery where ngay_so=? and vung=?', [currentDate, '0']);
    var isData = 0;
    if (data.length > 0) {
        isData = 1;
    }
    var giai1 = [];
    var giai2 = [];
    var giai3 = [];
    var giai4 = [];
    var giai5 = [];
    var giai6 = [];
    var giai7 = [];
    var giai8 = [];
    var db = [];
    var thu_so = '';
    var listProvince = [];
    data.forEach(function (item) {
        giai1.push(item.g1);
        giai2.push(item.g2);
        giai3.push(item.g3.replace(/ /g, '<br>'));
        giai4.push(item.g4.replace(/ /g, '<br>'));
        giai5.push(item.g5);
        giai6.push(item.g6.replace(/ /g, '<br>'));
        giai7.push(item.g7);
        giai8.push(item.g8);
        db.push(item.db);
        thu_so = item.thu_so;
        listProvince.push(dataProvince(item.province_id));
    })
    listProvince = await Promise.all(listProvince);
    var paramsTemplate = {
        currentToday: currentDate,
        thu_today: thu_today,
        currentDateVn: currentDateVn,
        giai1: giai1,
        giai2: giai2,
        giai3: giai3,
        giai4: giai4,
        giai5: giai5,
        giai6: giai6,
        giai7: giai7,
        giai8: giai8,
        db: db,
        thu_so: thu_so,
        listProvince: listProvince,
        isData: isData
    }
    res.render("home", paramsTemplate);
});
app.listen('81')
console.log('Magic happens on port 81');
exports = module.exports = app;