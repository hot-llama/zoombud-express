var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : '',
  password : '',
  database : '',
});
module.exports = db;