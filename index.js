import express from "express"
import path from "node:path"
import mongoose from "mongoose";
import listModel from "./model/todoModel.js";
const port = process.env.port || 3000;

await mongoose.connect("mongodb://localhost:27017/tododb")
    .then(() => {
        console.log("Database connected")
    })

const app = express();
app.use(express.urlencoded({ extended: true }))
const cssPath = path.resolve("public")
app.set("view engine", "ejs")
app.use(express.static(cssPath))
app.get("/", async (req, res) => {

    console.log("Home route working");
    const data = await listModel.find()

    console.log(data)
    res.render("list", { data })
})
app.get("/add", (req, res) => {
    res.render("add")
})
app.get("/update/:id", async (req, res) => {
    const id = req.params.id; // make sure it's req, not request
    const data = await listModel.findById(id); // use findById, not findOne(id)
    console.log(data); // this should now log the object
    res.render("update",{data}); // pass the object to EJS
});

app.post("/update/:id", async (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;

    try {
        await listModel.findByIdAndUpdate(id, { title, description });
        res.redirect("/");
    } catch (err) {
        res.send("Failed to update task");
    }
});

app.get("/update", (req, res) => {
    // You can send empty data or default values
    const data = { title: "", description: "" };
    res.render("update", { data });
});




app.post("/add", async (req, res) => {

    // const {title,description}=req.body;
    console.log("Data ", req.body)
    const savedData = await listModel.create(req.body)
    // res.send({
    //     message:"Data Added",
    //     info:savedData
    // })
    res.redirect("/")
})

app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const result = await listModel.findByIdAndDelete(id)

    if (result) {
        res.redirect("/")
    }
    else {
        res.send("Task not deleted")
    }
})

app.listen(port, () => {
    console.log("Server Started on port:", port)
})
