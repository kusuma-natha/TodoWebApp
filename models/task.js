const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    task:{
        type: String,
        required: true,
    },
    dueDate:{
        type: String,
        required: true,
    },
    priority:{
        type: String,
        required: true,
        enum: ['High', 'Medium', 'Low']
    },
    completed: {
        type: Boolean,
        default: false,
    }
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;