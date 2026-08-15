import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema({
    path:{ type:String, required:true },
    language:{ type:String },
    content:{ type:String, required:true }
},{ _id:false })

const artifactSchema = new Schema({
    title:{ type:String },
    framework:{ type:String },
    files:[fileSchema],
    preview:{ type:String },
    explanation:{ type:String }
},{ _id:false })

const messageSchema = new Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    },
    role:{
        type:String,
        enum:["user","assistant"]
    },
    content:{
        type:String
    },
    images:[
       String
    ],
    artifact:{
        type:artifactSchema,
        default:null
    }
},{timestamps:true})


const Message = mongoose.model("Message",messageSchema)

export default Message