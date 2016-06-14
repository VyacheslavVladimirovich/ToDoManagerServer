/**
 * Created by vyacheslavkazakov on 27.05.16.
 */

var Session = require('../data_manager/Session');
var express = require('express');
var fs = require('fs');

/**
 * Checks authentication if ok give access to private routes (via next) otherwise return "authentication error"
 * @param req request
 * @param res response
 * @param next go to next callback
 */
exports.checkAuthentication = function (req, res, next) {
    var session = new Session();
    session.checkSession({token: req.header("session-key"), user: null}, function (err, sessionStatus) {
        if (err) {
            res.status(500);
            res.json({status: 500, message: "Problems on server"});
        }
        if (sessionStatus.state) {
            req.userId = sessionStatus.session.userId;
            next();
        } else {
            res.status(401);
            res.json({status: 401, message: "Try access to private routes without authentication"});
        }
    });
};

exports.identify = function (req, res, next) {
    var appKey = "a8536db6-2230-4a4d-9086-0e500fcd760f";
    var sendAppKey = req.header("app-key");
    console.log(req.headers);
    if (sendAppKey === appKey) {
        console.log("identification passed");
        next();
    }else {
        console.log("identification failed");
        res.status(401);
        res.json({
        status: 401,
        message: "Identification failed"
    });
    }
};

exports.authenticate = function (user, callback) {
    var session = new Session();
    session.startSession(user, function (err, session) {
        if (err) return callback(err);
        if (!session) return callback(err, null);
        callback(err, {session_id: session.token, userId: session.userId});
    });
};
//TODO: Make app key as secret for apps