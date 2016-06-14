/**
 * Created by vyacheslavkazakov on 09.06.16.
 */
var Group = require('../../data_manager/Group');
var groupService = new Group();

function GroupRoter(router){
    router.get('/user/groups', function (req, res) {
        groupService.groups(0,0, req.userId, function (err, groups) {
            if(err) serverError(res, err);
            res.status(200);
            res.json(groups);
        });
    });

    router.get('/user/group', function (req, res) {
        
    });
    
    router.post('/user/group', function (req, res) {
        console.log(req.body);
        var group = req.body;
        group.userId = req.userId;
        groupService.addGroup(group, function (err, group) {
            if(err){
                serverError(res, err);
            }else{
                res.status(201);
                res.json(group);
            }
        });
    });

    function serverError(res, err){
        res.status(500);
        res.json({message: "Error on server:" + err});
    }
}

module.exports = GroupRoter;