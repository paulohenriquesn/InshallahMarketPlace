var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '2525',
  database: 'ish_system'
});

connection.connect();

export default connection;