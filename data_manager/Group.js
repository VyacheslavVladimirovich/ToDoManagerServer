/**
 * Created by vyacheslavkazakov on 13.06.16.
 */
var DataService = require('./DataService');

Group.prototype = Object.create(DataService.prototype);

function Group() {
}

Group.prototype.addGroup = function (group, callback) {
    var dataManager = Group.prototype.dataManager;
    if(group.name && group.name != ""){
        dataManager.performQuery("INSERT INTO ?? (??) VALUES (?)", ['Group', ['name', 'userId'], [group.name, group.userId]], function (err, result) {
            if(err) return callback(err);
            group.groupId = result.insertId;
            if(group.userId != undefined) delete group.userId;
            callback(err, group);
        });
    }else{
        callback(new Error("Group name is empty"));
    }
};

Group.prototype.groupByName = function(name, callback){
    
};

Group.prototype.groupById = function(id, callback){

};

Group.prototype.groups = function (from, to, userId, callback) {
    var dataManager = Group.prototype.dataManager;
    dataManager.performQuery("SELECT * FROM ?? WHERE ?? = ?", ['Group', 'userId', userId], function (err, groups) {
            if(err) return callback(err);
            callback(err, {groups: groups});
    });
};

module.exports = Group;