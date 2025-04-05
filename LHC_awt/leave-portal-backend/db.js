const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',   // replace with your password
  database: 'leave_portal'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected!');
});

module.exports = connection;
