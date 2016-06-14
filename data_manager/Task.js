/**
 * Created by vyacheslavkazakov on 30.05.16.
 */
var DataService = require('./DataService');

Task.prototype = Object.create(DataService.prototype);

//performs data functions associated with Task entitys
function Task() {
}
function taskToQuery(taskJSON){
    var fields = ['taskId', 'title', 'description',
        'dateCreated', 'dateAlarm', 'dateDeadline',
        'status', 'groupId', 'userId', 'iconName'];
    var attachments = [];
    var values = [taskJSON.taskId, taskJSON.title,
        taskJSON.description, taskJSON.dateCreated,
        taskJSON.dateAlarm, taskJSON.dateDeadline, taskJSON.status, taskJSON.groupId, taskJSON.userId, taskJSON.iconName];
    for(var i=0; i<values; i++){
        if(values[i] == undefined) {
            values.splice(i,1);
            fields.splice(i,1);
        }
    }
    return {fields:fields, values:values};
};

Task.prototype.createTask = function(task, callback){
    var dataManager = Task.prototype.dataManager;
    var queryData = taskToQuery(task);
    dataManager.performQuery("INSERT INTO ?? (??) VALUES (?)", ['Task', queryData.fields, queryData.values],
    function (err, result) {
        if(err) return callback(err);
        task.taskId = result.insertId;
        if(task.userId != undefined) delete task.userId;
        callback(err, task);
    });
};

Task.prototype.tasks = function (userId, groupId, callback){
    var dataManager = Task.prototype.dataManager;
    dataManager.performQuery("SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ?", [['taskId', 'title', 'description',
        'dateCreated', 'dateAlarm', 'dateDeadline',
        'status', 'groupId', 'iconName'], 'Task', 'userId', userId, 'groupId', groupId], callback);
};

Task.prototype.deleteTask = function(userId, taskId, callback){
    var dataManager = Task.prototype.dataManager;
    dataManager.performQuery("DELETE FROM ?? WHERE ?? = ? AND ?? = ?", ['Task', 'taskId', taskId, 'userId', userId], function (err, result) {
        if(err) return callback(err);
        callback(err, {status: 200, message: "Task successfuly deleted"});
    });

};

Task.prototype.tasks = function (userId, callback) {
    var dataManager = Task.prototype.dataManager;
    dataManager.performQuery("SELECT ?? FROM ?? WHERE ?? = ?", [['taskId', 'title', 'description',
        'dateCreated', 'dateAlarm', 'dateDeadline',
        'status', 'groupId', 'iconName'], 'Task', 'userId', userId], callback);
};



module.exports = Task;