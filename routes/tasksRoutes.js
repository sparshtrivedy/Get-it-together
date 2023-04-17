import express from "express";

const tasksRouter = express.Router()

import {createTask, deleteTask, getAllTasks, updateTask, showStats} from '../controllers/tasksController.js'

tasksRouter.route('/').post(createTask).get(getAllTasks)
tasksRouter.route('/stats').get(showStats)
tasksRouter.route('/:id').delete(deleteTask).patch(updateTask)


export default tasksRouter;
