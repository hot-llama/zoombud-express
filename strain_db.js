var mysql      = require('mysql');
var strain_db = mysql.createConnection({
  host     : 'localhost',
  user     : '',
  password : '',
  database : '',
});
module.exports = strain_db;