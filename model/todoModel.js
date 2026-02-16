import listScehma from "../schema/todoSchema.js";
import mongoose from "mongoose";

const listModel= mongoose.model("list",listScehma)

export default listModel;