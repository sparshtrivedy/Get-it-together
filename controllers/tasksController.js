import Task from "../models/Task.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from 'moment';

const createTask = async (req, res) => {
    const {taskItem} = req.body;
    if (!taskItem) {
        throw new BadRequestError('Please provide all values');
    }
    req.body.createdBy = req.user.userId;
    const task = await Task.create(req.body)
    res.status(StatusCodes.CREATED).json({task});
}

const deleteTask = async (req, res) => {
    const {id: taskId} = req.params;
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
        throw new NotFoundError(`No task with id: ${taskId}`);
    }
    
    checkPermissions(req.user, task.createdBy);

    await task.deleteOne();

    res
    .status(StatusCodes.OK)
    .json({msg: 'Success! Task removed'})
}

const getAllTasks = async (req, res) => {
    const {taskType, status, search, sort} = req.query;

    const queryObject = {
        createdBy: req.user.userId
    };

    if (taskType && taskType !== 'all') {
        queryObject.taskType = taskType;
    }
    if (status && status !== 'all') {
        queryObject.status = status;
    }
    if (search) {
        queryObject.taskItem = {$regex: search, $options: 'i'};
    }

    let result = Task.find(queryObject)

    if (sort === 'due date') {
        result = result.sort('completeBy')
    }
    if (sort === 'a-z') {
        result = result.sort('taskItem');
    }
    if (sort === 'z-a') {
        result = result.sort('-taskItem');
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit; // skip all before this page

    result = result.skip(skip).limit(limit);

    const tasks = await result;

    const totalTasks = await Task.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalTasks / limit);

    res
    .status(StatusCodes.OK)
    .json({tasks, totalTasks, numOfPages})
}

const updateTask = async (req, res) => {
    const {id: taskId} = req.params;
    const {taskItem} = req.body;
    if (!taskItem) {
        throw new BadRequestError('Please provide all values');
    }
    const task = await Task.findOne({ _id: taskId });
    if (!task) {
        throw new NotFoundError(`No task with id: ${taskId}`);
    }

    checkPermissions(req.user, task.createdBy);

    const updatedTask = await Task.findOneAndUpdate({_id: taskId}, req.body, {
        new: true,
        runValidators: true
    });
    res
    .status(StatusCodes.OK)
    .json({updatedTask})
}

const showStats = async (req, res) => {
    let stats = await Task.aggregate([
        {$match: {createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
        {$group: {_id: '$status', count: {$sum: 1}}}
    ])

    // return key values pair instead of array
    stats = stats.reduce((acc, curr) => {
        const {_id: title, count} = curr;
        acc[title] = count;
        return acc;
    }, {})

    const defaultStats = {
        "in progress" : stats["in progress"] || 0,
        "to do" : stats["to do"] || 0,
        "complete" : stats["complete"] || 0,
        "blocked" : stats["blocked"] || 0,
    }

    let monthlyTasks = await Task.aggregate([
        {$match: {createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
        {
            $group: {
                _id: {
                    year: {
                        $year: '$createdAt'
                    },
                    month: {
                        $month: '$createdAt'
                    }
                },
                count: {$sum: 1}
            }
        },
        {$sort: {'_id.year': -1, '_id.month': -1}},
        {$limit: 6},
    ])

    monthlyTasks = monthlyTasks.map((item) => {
        const {
            _id: {year, month},
            count,
        } = item;
        // month in moment starts from 0 to 11 whereas we store as 1 to 12
        const date = moment().month(month-1).year(year).format('MMM Y');
        return {date, count}
    })
    .reverse()

    res.status(StatusCodes.OK).json({defaultStats, monthlyTasks});
}

export {createTask, deleteTask, getAllTasks, updateTask, showStats}