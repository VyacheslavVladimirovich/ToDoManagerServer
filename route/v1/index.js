/**
 * Created by vyacheslavkazakov on 07.06.16.
 */
var Authentication = require('../../Autentication/Autentication');
var UserRouter = require('./UserRouter');
var TaskRouter = require('./TasksRouter');
var GroupsRouter = require('./GroupsRouter');
var express = require('express');

var userRouter;
var taskRouter;
var groupsRouter;

function v1(){
    this.router = express.Router();

    //setup private routing
    this.router.use('/user', Authentication.checkAuthentication);
    this.router.use('/user/*', Authentication.checkAuthentication);
    this.router.use('/attachment', Authentication.checkAuthentication);
    this.router.use('/attachment/*', Authentication.checkAuthentication);

    //connect specialized routers
    userRouter = new UserRouter(this.router);
    taskRouter = new TaskRouter(this.router);
    groupsRouter = new GroupsRouter(this.router);
}

module.exports = v1;