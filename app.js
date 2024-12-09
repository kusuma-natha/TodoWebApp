const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Task = require("./models/task.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/todoapp";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main().then((res)=>{
    console.log("Connected to DB");
}) .catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL)
}

//Sign Up 
app.get("/login", (req, res)=>{
    res.render("login.ejs");
});

//Login
app.get("/signup", (req, res)=>{
    res.render("signup.ejs");
});

//Index Route
app.get("/tasks", async (req,res)=>{
    let allTasks = await Task.find({});
    res.render("./tasks/index.ejs", {allTasks});
});

app.post("/tasks/:id/toggle", async (req,res)=>{
    try {
        const { id } = req.params;

        // Find the task by ID
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).send("Task not found");
        }

        // Toggle the 'completed' status
        task.completed = !task.completed;

        // Save the updated task
        await task.save();

        // Redirect to the tasks page after updating
        res.redirect("/tasks");
    } catch (err) {
        console.error("Error toggling task status:", err);
        res.status(500).send("Internal Server Error");
    }
});

//New Route
app.get("/tasks/new", (req,res)=>{
    res.render("./tasks/new.ejs");
});

app.post("/tasks", async (req,res)=>{
    let {task, dueDate, priority} = req.body;
    let newTask = new Task({
        task : task,
        dueDate : dueDate,
        priority : priority,
    });
    await newTask.save();
    res.redirect("/tasks");
});

//Show Route
app.get("/tasks/:id", async (req,res)=>{
    let {id} = req.params;
    const task = await Task.findById(id);
    res.render("./tasks/show.ejs", {task});
});

//Edit Route
app.get("/tasks/:id/edit", async (req,res)=>{
    let {id} = req.params;
    let task = await Task.findById(id);
    res.render("./tasks/edit.ejs", {task});
});

//Update Route
app.put("/tasks/:id", async (req,res)=>{
    let {id} = req.params;
    let {task: newtask,dueDate: newdueDate,priority: newPriority} = req.body;
    let updatedTask = await Task.findByIdAndUpdate(
        id,
        {task: newtask,
        dueDate: newdueDate,
        priority: newPriority},
        {runValidators: true, new: true}
    );
    console.log("Updated Task: ", updatedTask);
    res.redirect(`/tasks/${id}`);
});

//Destroy Route
app.delete("/tasks/:id", async (req,res)=>{
    let {id} = req.params;
    let deletedChat = await Task.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/tasks");
});

// app.get("/testtasks", async(req,res)=>{
//     let sampleTasks = new Task({
//         task: "Code for an hour",
//         dueDate: "November 11th 2024",
//         priority: "high",
//     })
//     await sampleTasks.save();
//     console.log("Sample was Saved");
//     res.send("Successful testing");
// });

app.listen(8080, ()=>{
    console.log("server is working");
})