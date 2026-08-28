import mongoose, { Schema } from "mongoose";

const creditsSchema = new Schema({
    userId:{
        type:String,
        unique:true
    },
    credits:{
        type:Number,
        default:50,
        min:0
    },
},{timestamps:true})


const Credits = mongoose.model("Credits",creditsSchema)

export default Credits