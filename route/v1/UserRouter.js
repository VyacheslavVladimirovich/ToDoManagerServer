/**
 * Created by vyacheslavkazakov on 07.06.16.
 */
var Autentication = require('../../Autentication/Autentication');
var User = require('../../data_manager/User');
var UserValidator = require('../../Validation/UserValidation');
var userService = new User();

function UserRouter(router) {
    router.post('/users/create/', UserValidator.vlidate ,function (req, res) {
        var newUser = userService.userFromRequest(req);

        function callback(err, userFields) {
            if (err) {
                return serverError(res, err);
            } else if(userFields){
                res.status(201);
                res.json(userFields);
            }else{
                res.status(409);
                res.send();
            }
        }

        userService.addUser(newUser, callback);
    });

    router.post('/login', function (req, res) {
            var username = req.body.username;
            var password = req.body.password;
            Autentication.authenticate({name: username, password: password}, function (err, session) {
                if (err) {
                    return serverError(res, err);
                }
                else if (session) {
                    return res.json({session_key: session.session_id, userId: session.userId});
                } else {
                    res.status(401);
                    return res.json({message: "Wrong username/password"});
                }
            });
        }
    );

    router.get('/email/:email', function (req, res) {
        var email = req.params.email;
        if(email){
            userService.checkEmail(email, function (err, exist) {
                if(err) return serverError(res, err);
                exist? userConflict(res): userNotExist(res);
            });
        }else{
            console.log("email check error: "+email);
        }
    });
    
    router.get('/username/:username', function (req, res) {
        var username = req.params.username;
        if(username){
            userService.checkUsername(username, function (err, exist) {
                if(err) return serverError(res, err);
                exist? userConflict(res): userNotExist(res);
            })
        }else{
            console.log("username check error: "+email);
        }
        
    });

    router.get('/user', function (req, res) {
        var userId = req.userId;
        userService.find({id: userId}, function (err, user) {
            if (user) delete user.validPassword;
            res.json(user);
        })
    });

    //EASY RESPONSE METHODS
    function userConflict(res){
        res.status(409);
        res.json({message: "User alredy exist"});
    }

    function userNotExist(res){
        res.status(200);
        res.json({message: "User not exist"});
    }

    function serverError(res, err){
        res.status(500);
        res.json({message: "Error on server:" + err});
    }


}

module.exports = UserRouter;