const express = require('express')
const router = express.Router()
const {authenticate,isAdmin} = require('../middleware/auth')
const adminController = require('../controllers/admin.controllers')
const userController = require('../controllers/user.controller')
const taskController = require('../controllers/assign.task.controller')
const userAddTaskcontroller = require('../controllers/userAddTaskcontroller')
router.post('/register',adminController.register);
router.post('/login',adminController.login);

router.use(authenticate,isAdmin)
router.post("/add-user",userController.register);
router.get('/getall-users',userController.getallUser);
router.get('/getbyid-users/:id', userController.getbyIdUser); 
router.put('/update-users/:id', userController.updateUser);  
router.delete('/delete-users/:id', userController.deleteUser);

router.post("/assign-task", taskController.assignTask);
router.get("/getall-task", taskController.getAllTasks);

router.get("/getbyid-assign-task/:id", taskController.getTaskById);
router.put("/update-assign-task/:id", taskController.updateTaskById);
router.delete("/delete-assign-task/:id", taskController.deleteTaskById);
//getby user id
router.get("/getbyid-task/:userId", userAddTaskcontroller.getUserTasks);
router.delete("/deleteuserstask/:id", userAddTaskcontroller.deleteUserTask);
module.exports = router;