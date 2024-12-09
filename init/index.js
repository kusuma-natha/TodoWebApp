const mongoose = require("mongoose");
const initData = require("./data.js");
const Task = require("../models/task.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/todoapp";

main().then((res)=>{
    console.log("Connected to DB");
}) .catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL)
};

const initDB = async()=>{
    await Task.deleteMany({});
    await Task.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();