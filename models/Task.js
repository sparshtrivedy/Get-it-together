import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    taskItem: {
        type: String,
        required:[true, 'Please provide task'],
        maxlength: 50,
    },
    description: {
        type: String,
        maxlength: 100,
    },
    completeBy: {
        type: Date,
        required:[true, 'Please provide due date'],
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['to do', 'in progress', 'complete', 'blocked'],
        default: 'to do'
    },
    taskType: {
        type: String,
        enum: ['chore', 'shopping list', 'work', 'assignment'],
        default: 'chore',
    },
    taskLocation: {
        type: String,
        default: 'my city',
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, {timestamps: true})

export default mongoose.model('Task', TaskSchema);
