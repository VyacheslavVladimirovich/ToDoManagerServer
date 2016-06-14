/**
 * Created by vyacheslavkazakov on 30.05.16.
 */

var DataService = require('./DataService');

//performs data functions associated with User entitys
//IMPORTANT: data functions does not check autentication 
User.prototype = Object.create(DataService.prototype);

function User() {

}

function checkUserExistance(user, callback) {
    var dataManager = User.prototype.dataManager;
    var args = ['username', 'User'];
    var whereClause;
    var username = user.username;
    var email = user.email;
    switch((username!=undefined)+(email!=undefined)*2){
        case 0:
            return callback(new Error("User empty"));
        case 1:
            whereClause = "?? = ?";
            args = args.concat(['username', user.username]);
            break;
        case 2:
            whereClause = "?? = ?";
            args = args.concat(['email', user.email]);
            break;
        case 3:
            whereClause = "?? = ? or ?? = ?" ;
            args = args.concat(['username', user.username, 'email', user.email]);
            break;
    }
    dataManager.performQuery("SELECT ?? FROM ?? WHERE "+whereClause, args, function (err, rows) {
        if (err) return callback(err, undefined);
        var isUserExist = rows.length > 0;
        callback(err, isUserExist);
    });
    
}
function mapUser(row) {
    return {
        userId: row.userId,
        username: row.username,
        email: row.email,
        validPassword: function (password) {
            return password == row.password;
        },
        create_time: row.create_time
    };
}
/**
 * Find user by username
 * @param user
 * @param callback
 */
User.prototype.find = function (user, callback) {
    var dataManager = User.prototype.dataManager;
    var searchArgs = user.id != undefined? ['userId', user.id]:['username', user.name];
    var args = ['User'].concat(searchArgs);
    console.log(args);
    dataManager.performQuery("SELECT * FROM ?? WHERE ?? = ?", args, function (err, rows) {
        if (err) return callback(err);
        if (rows.length < 1) return callback(err, null);
        var user = mapUser(rows[0]);
        callback(err, user);
    });
};

User.prototype.isExist = function (user, callback) {
    var dataManager = User.prototype.dataManager;
    var fieldsOfUser = ['username', 'email', 'password', 'userId'];
    dataManager.performQuery("SELECT ?? FROM ?? WHERE username = ? || email = ?", [fieldsOfUser, 'User', user.username, user.email],
        function (err, rows) {
            if (err) return callback(err);
            callback(err, rows.length > 0);
        });
};

/**
 * Adds new user object
 * @param newUser object {username, email, password}
 * @param callback function (error, userId)
 */
User.prototype.addUser = function addUser(newUser, callback) {
    var dataManager = User.prototype.dataManager;
    const serverError = {status: 500, error: "Problems on server"};
    const userConflictError = {status: 409, error: "Username alredy exist"};
    const userCreatedMessage = {status: 201, message: "User created successfully"};

    checkUserExistance(newUser, function (err, isUserExist) {
        if (err) {
            return callback(err, serverError);
        }
        if (isUserExist) {
            return callback(err, userConflictError);
        } else {
            var fields = ['username', 'email', 'password'];
            var values = [newUser.username, newUser.email, newUser.password];
            dataManager.performQuery("INSERT INTO ?? (??) VALUES (?)", ['User', fields, values], function (err, res) {
                if (err) return callback(err, serverError);
                callback(err, userCreatedMessage);
            })
        }
    });
};

User.prototype.checkEmail = function(email, callback){
    checkUserExistance({email:email}, callback);
};

User.prototype.checkUsername = function (username, callbaack) {
    checkUserExistance({username:username}, callback);
};

User.prototype.userFromRequest = function (req) {
    return {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
};

module.exports = User;
