const mysql = require('mysql');

var connection = mysql.createConnection({
    // socketPath: '/cloudsql/proud-structure-327618:us-central1:mysql-instance',
    user: 'root',
    password: '123456789',
    database: 'MYSQLDB',
    host: "34.122.20.143",
    charset: 'utf8mb4'
});

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("Database is not connected: " + err);
        throw err;
    }
});

module.exports = connection;