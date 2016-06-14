/**
 * Created by vyacheslavkazakov on 07.06.16.
 */

var User = require('../data_manager/User');
var validator = require('validator');
var userService = new User();

function validateUsername(username) {
    return (validator.isLength(username, {min: 4, max: 16}) && validator.isAlphanumeric(username));
}

function validateEmail(email) {
    return validator.isEmail(email);
}

exports.vlidate = function (req, res, next) {
    var user = userService.userFromRequest(req);
    const userValidationError = {status: 400, error: "User validation not passed (username/email not accepted)"}

    if(validateUsername(user.username) && validateEmail(user.email)){
        next();
    }else{
        res.statusCode = 400;
        res.json(userValidationError);
    }
};