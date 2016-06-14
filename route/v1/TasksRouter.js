/**
 * Created by vyacheslavkazakov on 08.06.16.
 */
var Task = require('../../data_manager/Task');
var taskService = new Task();

function TasksRouter(router){

    router.get('/user/tasks', function (req, res) {
        taskService.tasks(req.userId, function (err, tasks) {
            if(err || !tasks) return serverError(res, err);
            res.status(200);
            res.json(tasks);
        });
    });

    router.get('/user/tasksOfGroup', function (req, res) {
        taskService.tasks(req.userId, req.params.groupId, function (err, tasks) {
            if(err) return serverError(res, err);
            if(tasks){
                res.status(200);
                res.json({groupId: req.params.groupId, tasks:tasks});
            }else{
                res.status(404);
                res.json({message: "Tasks not found for that goupId: "+req.params.groupId});
            }
        });
    });
    
    router.post('/user/task', function(req, res){
        var task = req.body;
        task.userId = req.userId;
        taskService.createTask(task, function (err, createdTask) {
            if(err || !task) return serverError(res, err);
            res.status(200);
            res.json(createdTask);
        });
    });

    router.post('/user/tasks', function(req, res){

    });

    router.put('/user/task', function (req, res) {

    });

    router.delete('/user/task', function(req, res) {
        var taskId = req.params.taskId;
        taskService.deleteTask(req.userId, taskId, function (err, result) {
            if(err) return serverError(res, err);
            res.status(result.status);
            res.json(result);
        })
    });

    function serverError(res, err){
        res.status(500);
        res.json({message: "Error on server:" + err});
    }
}

module.exports = TasksRouter;