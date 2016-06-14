/**
 * Created by vyacheslavkazakov on 03.06.16.
 */

var dataManager = require('./DataManager');
var UserService = require('./User');

var userService = new UserService();

function Session() {
}

function createSessionForUser(user, callback) {
    var uuid = require('node-uuid');
    var token = uuid.v1();
    Session.prototype.expire(null, user.userId, function (err, expireStatus) {
        if (err) callback(err);
        dataManager.performQuery("INSERT INTO ?? (??, ??) VALUES (?, ?)",
            ['Session', 'sessionKey', 'userId', token, user.userId],
            function (err) {
                if (err) return callback();
                console.log("createSession");
                callback(err, token);
            }
        );
    });
}

/**
 *
 * @param user
 * @param callback
 */
Session.prototype.startSession = function startSession(user, callback) {
    //check user for existing
    userService.find(user, function (err, findedUser) {
        if (err) return callback(err);
        if (findedUser && findedUser.validPassword(user.password)) {
            //create session if user found and valid
            createSessionForUser(findedUser, function (err, token) {
                if (err) return callback(err);
                callback(err, {token: token, userId: findedUser.userId, message: "Session started"});
            });
        } else {
            callback(err, null);
        }
    });
};

/**
 *
 * @param session
 * @param callback
 * @returns {*}
 */
Session.prototype.checkSession = function checkSession(session, callback) {
    if (!session.token && !session.user) return callback(null, {state: false});
    var queryParams = session.token ? ['Session', 'sessionKey', session.token] :
        ['Session', 'userId', session.user.userId];
    dataManager.performQuery("SELECT * FROM ?? WHERE ??=?", queryParams, function (err, foundSession) {
        if (err) return callback(err);
        switch (foundSession.length) {
            case 0:
                callback(err, {state: false});
                break;
            case 1:
                callback(err, {state: true, session: foundSession[0]});
                break;
            default:
                callback(new Error("Something broken on db"), null);
        }
    });
};

/**
 *
 * @param token
 * @param user
 * @param callback
 */
Session.prototype.expire = function expire(token, userId, callback) {
    var args = token ? ['Session', 'sessionKey', token] : ['Session', 'userId', userId];
    dataManager.performQuery("DELETE FROM ?? WHERE ??=?", args, function (err) {
        if (err) callback(err);
        callback(err, {token: token, message: "token: " + token + " expired"});
    })
};

module.exports = Session;

//TODO: timeout expiration