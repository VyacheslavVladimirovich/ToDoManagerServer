/**
 * Created by vyacheslavkazakov on 27.05.16.
 */
var testDB = require("./DB_AWS_TEST").testDB;
var mysql = require('mysql');

var pool;

function DataManager() {
    pool = mysql.createPool({
    host: testDB === 'undefined' ? process.env.RDS_HOSTNAME : testDB.host,
    user: testDB === 'undefined' ? process.env.RDS_USERNAME : testDB.user,
    password: testDB === 'undefined' ? process.env.RDS_PASSWORD : testDB.password,
    database: 'todo_manager_db'
});
}

function connect(callback) {
    pool.getConnection(function (err, connection) {
        if(err) return callback(err);
        callback(err, connection);
        console.log("DB connected");
    });
}

DataManager.prototype.performQuery = function (query, args, callback){
    connect(
        function(err, connection){
            if(err) return callback(err);
            connection.query(query, args, function (err, results) {
                connection.release();
                if(err) {
                    console.log("DB ERROR:\n"+err);
                    return callback(err);
                }
                callback(err, results);
        });
    });
};

module.exports = new DataManager();