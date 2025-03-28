const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const taskController = require('../controllers/assign.task.controller')
const userAddTaskController = require('../controllers/userAddTaskcontroller')
const {authenticate} = require('../middleware/auth')
router.post('/register',userController.register);
router.post('/login',userController.login);

router.use(authenticate)

//user get profile with all details
router.get("/getprofile", userAddTaskController.getUserTaskSummary);

//user getall own assign task
router.get("/getallown-task", taskController.getMyTasks);
router.get("/getallownbyid-task/:id", taskController.getTaskByIdUser);

router.post("/add-task", userAddTaskController.addUserTask);

router.get("/getowndone-task", userAddTaskController.getUserOwnTasks);


module.exports = router;